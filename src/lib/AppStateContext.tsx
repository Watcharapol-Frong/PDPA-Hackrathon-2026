"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  ExemptionCase,
  IncidentData,
  IncidentDocuments,
  PolicyState,
} from "./types";
import type { TranslationKey } from "./LanguageContext";

/** สถานะทางกฎหมายรวมขององค์กร ณ ขณะนั้น (Legal Risk State ตาม Spec 4) */
export type LegalState = "1a" | "1b" | "2" | "3";

export type AuditCategory = "detection" | "enforcement" | "dpo_action" | "policy" | "report";

export interface AuditEntry {
  id: string;
  timestamp: string;
  /** ผู้กระทำ — ระบบ หรือ DPO */
  actorKey: TranslationKey;
  actionKey: TranslationKey;
  /** เหตุผลสำเร็จรูป */
  rationaleKey?: TranslationKey;
  /** เหตุผลที่ผู้ใช้พิมพ์เอง — ไม่ต้องแปล */
  rationaleText?: string;
  category: AuditCategory;
  caseId?: string;
}

interface AppStateValue {
  /** เหตุวิกฤตที่ยังไม่ปิดทั้งหมด — องค์กรมีหลายเหตุพร้อมกันได้ */
  incidents: IncidentData[];
  /** เหตุแรกในคิว (เรียงตามเวลาที่เหลือน้อยสุด) — ใช้ตอนต้องการตัวเดียว */
  incident: IncidentData | null;
  getIncident: (caseId: string) => IncidentData | undefined;

  /** เคสที่ส่งคำร้องขอขยายเวลาไป สคส. แล้ว */
  gracePendingIds: string[];
  isGracePending: (caseId: string) => boolean;

  /** เคสที่ DPO ยังไม่เคยเปิดดู — ใช้ขึ้นป้าย NEW */
  isNewCase: (caseId: string) => boolean;
  newCaseCount: number;
  markCaseViewed: (caseId: string) => void;

  /**
   * นาฬิกา 72 ชม. เริ่มนับจาก Time of Awareness (เวลาที่ DPO ทราบเหตุจริง)
   * ไม่ใช่ Alert Timestamp ที่ระบบตรวจพบ — Technical Spec ข้อ 6
   */
  isAwarenessConfirmed: (caseId: string) => boolean;
  confirmAwareness: (caseId: string) => void;

  /** เอกสารที่ยื่นแล้วของแต่ละเคส */
  documentsFor: (caseId: string) => IncidentDocuments;
  /** State 3 ต้องครบทั้ง 2 ฉบับ / State 2 ต้องมีรายงาน สคส. */
  canCloseCase: (caseId: string) => boolean;

  policy: PolicyState;
  exemptionQueue: ExemptionCase[];
  auditLog: AuditEntry[];

  /** สถานะรวมที่คำนวณจากทุกอย่างข้างบน — ใช้ขับ GlobalHealthBox */
  legalState: LegalState;

  requestGracePeriod: (caseId: string, rationaleKey: TranslationKey, note?: string) => void;
  updatePolicy: (next: PolicyState) => void;
  approveExemptions: (ids: string[], note: string) => void;
  /** ตีกลับเคสยกเว้น → ยกระดับเป็นเหตุวิกฤตจริงในห้องวิกฤต */
  escalateExemption: (id: string, note: string) => string | undefined;
  fileDocument: (caseId: string, doc: keyof IncidentDocuments) => void;
  resolveIncident: (caseId: string) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

function nowStamp() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function formatId(n: number) {
  return `LOG-${String(n).padStart(4, "0")}`;
}

interface AppStateProviderProps {
  children: ReactNode;
  /** เหตุวิกฤตตั้งต้น (mock) */
  initialIncidents: IncidentData[];
  initialExemptions?: ExemptionCase[];
  initialAuditLog?: AuditEntry[];
}

export function AppStateProvider({
  children,
  initialIncidents,
  initialExemptions = [],
  initialAuditLog = [],
}: AppStateProviderProps) {
  const [incidents, setIncidents] = useState<IncidentData[]>(initialIncidents);
  const [gracePendingIds, setGracePendingIds] = useState<string[]>(() =>
    initialIncidents.filter((i) => i.status === "grace_requested").map((i) => i.caseId),
  );
  const [documents, setDocuments] = useState<Record<string, IncidentDocuments>>({});
  // เคสที่สถานะยังเป็น awaiting_review คือเคสที่เพิ่งเข้ามาและ DPO ยังไม่เคยเปิด
  const [viewedCaseIds, setViewedCaseIds] = useState<string[]>(() =>
    initialIncidents.filter((i) => i.status !== "awaiting_review").map((i) => i.caseId),
  );
  // เคสที่ DPO บันทึกเวลาทราบเหตุแล้วเท่านั้นที่นาฬิกาเดิน
  const [awarenessConfirmedIds, setAwarenessConfirmedIds] = useState<string[]>(() =>
    initialIncidents.filter((i) => i.status !== "awaiting_review").map((i) => i.caseId),
  );
  const [policy, setPolicy] = useState<PolicyState>({
    dataMasking: true,
    trafficThrottling: false,
  });
  const [exemptionQueue, setExemptionQueue] = useState<ExemptionCase[]>(initialExemptions);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(initialAuditLog);

  // นับต่อจากบันทึกตั้งต้น ไม่งั้น id จะชนกับ seed แล้ว React ฟ้อง key ซ้ำ
  const seqRef = useRef(initialAuditLog.length);
  const escalationSeqRef = useRef(0);

  const appendLog = useCallback((entry: Omit<AuditEntry, "id" | "timestamp">) => {
    // สร้าง id/เวลานอก updater — ไม่งั้น StrictMode จะเรียกซ้ำและกิน id เปล่า
    seqRef.current += 1;
    const sealed: AuditEntry = { ...entry, id: formatId(seqRef.current), timestamp: nowStamp() };
    setAuditLog((log) => [sealed, ...log]);
  }, []);

  const getIncident = useCallback(
    (caseId: string) => incidents.find((i) => i.caseId === caseId),
    [incidents],
  );

  const isGracePending = useCallback(
    (caseId: string) => gracePendingIds.includes(caseId),
    [gracePendingIds],
  );

  const isNewCase = useCallback(
    (caseId: string) => !viewedCaseIds.includes(caseId),
    [viewedCaseIds],
  );

  const isAwarenessConfirmed = useCallback(
    (caseId: string) => awarenessConfirmedIds.includes(caseId),
    [awarenessConfirmedIds],
  );

  /** บันทึกเวลาทราบเหตุ = เริ่มนับ 72 ชม. อย่างเป็นทางการ และสลักลง WORM Log */
  const confirmAwareness = useCallback(
    (caseId: string) => {
      let started = false;
      setAwarenessConfirmedIds((ids) => {
        if (ids.includes(caseId)) return ids;
        started = true;
        return [...ids, caseId];
      });
      if (!awarenessConfirmedIds.includes(caseId)) {
        appendLog({
          actorKey: "auditActorDpo",
          actionKey: "auditActionAwarenessConfirmed",
          category: "dpo_action",
          caseId,
        });
      }
      return started;
    },
    [appendLog, awarenessConfirmedIds],
  );

  const markCaseViewed = useCallback((caseId: string) => {
    setViewedCaseIds((ids) => (ids.includes(caseId) ? ids : [...ids, caseId]));
  }, []);

  const documentsFor = useCallback(
    (caseId: string): IncidentDocuments =>
      documents[caseId] ?? { pdpcReport: false, dataSubjectNotice: false },
    [documents],
  );

  /** State 3 ต้องยื่นครบทั้ง 2 ฉบับ ส่วน State 2 ต้องมีรายงาน สคส. อย่างเดียว (ม.37(4)) */
  const canCloseCase = useCallback(
    (caseId: string) => {
      const inc = incidents.find((i) => i.caseId === caseId);
      if (!inc) return false;
      const docs = documents[caseId] ?? { pdpcReport: false, dataSubjectNotice: false };
      return inc.severity === "high_risk"
        ? docs.pdpcReport && docs.dataSubjectNotice
        : docs.pdpcReport;
    },
    [incidents, documents],
  );

  const requestGracePeriod = useCallback(
    (caseId: string, rationaleKey: TranslationKey, note?: string) => {
      setGracePendingIds((ids) => (ids.includes(caseId) ? ids : [...ids, caseId]));
      appendLog({
        actorKey: "auditActorDpo",
        actionKey: "auditActionGraceRequested",
        rationaleKey,
        rationaleText: note,
        category: "dpo_action",
        caseId,
      });
    },
    [appendLog],
  );

  const updatePolicy = useCallback(
    (next: PolicyState) => {
      // คำนวณ diff นอก updater — ห้ามเขียน log ในนั้น เพราะ React เรียก updater ซ้ำได้
      (Object.keys(next) as (keyof PolicyState)[]).forEach((key) => {
        if (policy[key] === next[key]) return;
        appendLog({
          actorKey: "auditActorDpo",
          actionKey:
            key === "dataMasking"
              ? next[key]
                ? "auditActionMaskingOn"
                : "auditActionMaskingOff"
              : next[key]
                ? "auditActionThrottleOn"
                : "auditActionThrottleOff",
          category: "policy",
        });
      });
      setPolicy(next);
    },
    [appendLog, policy],
  );

  const approveExemptions = useCallback(
    (ids: string[], note: string) => {
      setExemptionQueue((q) =>
        q.map((c) => (ids.includes(c.id) ? { ...c, status: "Approved" as const } : c)),
      );
      ids.forEach((id) =>
        appendLog({
          actorKey: "auditActorDpo",
          actionKey: "auditActionExemptionApproved",
          rationaleText: note,
          category: "dpo_action",
          caseId: id,
        }),
      );
    },
    [appendLog],
  );

  /**
   * ตีกลับเคสยกเว้น = ประกาศว่า "ไม่เข้าเงื่อนไขยกเว้น" → กลายเป็นเหตุวิกฤตจริง
   * เคสถูกยกระดับเป็น State 2 และเข้าไปอยู่ในห้องวิกฤตพร้อมนาฬิกา 72 ชม.
   */
  const escalateExemption = useCallback(
    (id: string, note: string) => {
      const source = exemptionQueue.find((c) => c.id === id);
      if (!source) return undefined;

      escalationSeqRef.current += 1;
      const newCaseId = `INC-2026-0718-${String(10 + escalationSeqRef.current).padStart(2, "0")}`;

      const escalated: IncidentData = {
        caseId: newCaseId,
        titleKey: "incidentEscalatedTitle",
        severity: "risk_present",
        status: "awaiting_review",
        detectedAt: source.detectedAt,
        remainingSeconds: 72 * 3600,
        affectedRows: source.requestVolume,
        compromisedFields: source.fieldsInvolved.map((f) => ({
          id: f,
          labelKey: "piiEscalatedField",
          column: f,
          table: "escalated.source_table",
          dataType: "VARCHAR",
          sensitivity: "sensitivityGeneral",
          affectedRows: source.requestVolume,
          leaked: true,
        })),
        timeline: [{ time: source.detectedAt.slice(11), labelKey: "timelineEscalated", severity: "warning" }],
        nodes: [
          { id: "attacker", labelKey: "nodeAttacker", kind: "attacker", x: 12, y: 50 },
          { id: "gateway", labelKey: "nodeGateway", kind: "gateway", x: 50, y: 50 },
          { id: "database", labelKey: "nodeDatabase", kind: "database", x: 88, y: 50 },
        ],
        edges: [
          { from: "attacker", to: "gateway", labelKey: "edgeExploit" },
          { from: "gateway", to: "database", labelKey: "edgeExfil" },
        ],
        aiSummaryKey: "aiSummaryEscalated",
        escalatedFrom: id,
      };

      setExemptionQueue((q) =>
        q.map((c) => (c.id === id ? { ...c, status: "Rejected" as const, escalatedTo: newCaseId } : c)),
      );
      setIncidents((list) => [...list, escalated]);
      appendLog({
        actorKey: "auditActorDpo",
        actionKey: "auditActionExemptionRejected",
        rationaleText: note,
        category: "dpo_action",
        caseId: id,
      });
      return newCaseId;
    },
    [appendLog, exemptionQueue],
  );

  const fileDocument = useCallback(
    (caseId: string, doc: keyof IncidentDocuments) => {
      setDocuments((d) => ({
        ...d,
        [caseId]: { ...(d[caseId] ?? { pdpcReport: false, dataSubjectNotice: false }), [doc]: true },
      }));
      appendLog({
        actorKey: "auditActorDpo",
        actionKey: doc === "pdpcReport" ? "auditActionReportFiled" : "auditActionNoticeIssued",
        category: "report",
        caseId,
      });
    },
    [appendLog],
  );

  const resolveIncident = useCallback(
    (caseId: string) => {
      appendLog({
        actorKey: "auditActorDpo",
        actionKey: "auditActionCaseResolved",
        category: "report",
        caseId,
      });
      setIncidents((list) => list.filter((i) => i.caseId !== caseId));
      setGracePendingIds((ids) => ids.filter((i) => i !== caseId));
    },
    [appendLog],
  );

  // เรียงตามเวลาที่เหลือน้อยสุดก่อนเสมอ (Triage Logic ตาม spec)
  const sortedIncidents = useMemo(
    () => [...incidents].sort((a, b) => a.remainingSeconds - b.remainingSeconds),
    [incidents],
  );

  const newCaseCount = useMemo(
    () => incidents.filter((i) => !viewedCaseIds.includes(i.caseId)).length,
    [incidents, viewedCaseIds],
  );

  const legalState: LegalState = useMemo(() => {
    if (incidents.some((i) => i.severity === "high_risk")) return "3";
    if (incidents.length > 0) return "2";
    if (exemptionQueue.some((c) => c.status === "Pending")) return "2";
    if (policy.dataMasking || policy.trafficThrottling) return "1b";
    return "1a";
  }, [incidents, exemptionQueue, policy]);

  const value = useMemo<AppStateValue>(
    () => ({
      incidents: sortedIncidents,
      incident: sortedIncidents[0] ?? null,
      getIncident,
      gracePendingIds,
      isGracePending,
      isNewCase,
      newCaseCount,
      markCaseViewed,
      isAwarenessConfirmed,
      confirmAwareness,
      documentsFor,
      canCloseCase,
      policy,
      exemptionQueue,
      auditLog,
      legalState,
      requestGracePeriod,
      updatePolicy,
      approveExemptions,
      escalateExemption,
      fileDocument,
      resolveIncident,
    }),
    [
      sortedIncidents,
      getIncident,
      gracePendingIds,
      isGracePending,
      isNewCase,
      newCaseCount,
      markCaseViewed,
      isAwarenessConfirmed,
      confirmAwareness,
      documentsFor,
      canCloseCase,
      policy,
      exemptionQueue,
      auditLog,
      legalState,
      requestGracePeriod,
      updatePolicy,
      approveExemptions,
      escalateExemption,
      fileDocument,
      resolveIncident,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within an AppStateProvider");
  return ctx;
}
