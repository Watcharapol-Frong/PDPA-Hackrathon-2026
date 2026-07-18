"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ExemptionCase, IncidentData, PolicyState } from "./types";
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
  /** เหตุวิกฤตที่ยังไม่ปิด — null คือไม่มีเหตุค้างอยู่ */
  incident: IncidentData | null;
  /** ส่งคำร้องขอขยายเวลาไป สคส. แล้วหรือยัง */
  gracePending: boolean;
  policy: PolicyState;
  exemptionQueue: ExemptionCase[];
  auditLog: AuditEntry[];

  /** สถานะรวมที่คำนวณจากทุกอย่างข้างบน — ใช้ขับ GlobalHealthBox */
  legalState: LegalState;

  requestGracePeriod: (rationaleKey: TranslationKey, note?: string) => void;
  updatePolicy: (next: PolicyState) => void;
  approveExemptions: (ids: string[], note: string) => void;
  resolveIncident: () => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

function nowStamp() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

let seq = 0;
function nextId() {
  seq += 1;
  return `LOG-${String(seq).padStart(4, "0")}`;
}

interface AppStateProviderProps {
  children: ReactNode;
  /** เหตุวิกฤตตั้งต้น (mock) */
  initialIncident: IncidentData | null;
  initialExemptions?: ExemptionCase[];
  initialAuditLog?: AuditEntry[];
}

export function AppStateProvider({
  children,
  initialIncident,
  initialExemptions = [],
  initialAuditLog = [],
}: AppStateProviderProps) {
  const [incident, setIncident] = useState<IncidentData | null>(initialIncident);
  const [gracePending, setGracePending] = useState(initialIncident?.status === "grace_requested");
  const [policy, setPolicy] = useState<PolicyState>({
    dataMasking: false,
    trafficThrottling: false,
  });
  const [exemptionQueue, setExemptionQueue] = useState<ExemptionCase[]>(initialExemptions);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(initialAuditLog);

  const appendLog = useCallback((entry: Omit<AuditEntry, "id" | "timestamp">) => {
    setAuditLog((log) => [{ ...entry, id: nextId(), timestamp: nowStamp() }, ...log]);
  }, []);

  const requestGracePeriod = useCallback(
    (rationaleKey: TranslationKey, note?: string) => {
      setGracePending(true);
      appendLog({
        actorKey: "auditActorDpo",
        actionKey: "auditActionGraceRequested",
        rationaleKey,
        rationaleText: note,
        category: "dpo_action",
        caseId: incident?.caseId,
      });
    },
    [appendLog, incident?.caseId],
  );

  const updatePolicy = useCallback(
    (next: PolicyState) => {
      setPolicy((prev) => {
        // บันทึกเฉพาะ guard ที่เปลี่ยนสถานะจริง
        (Object.keys(next) as (keyof PolicyState)[]).forEach((key) => {
          if (prev[key] !== next[key]) {
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
          }
        });
        return next;
      });
    },
    [appendLog],
  );

  const approveExemptions = useCallback(
    (ids: string[], note: string) => {
      setExemptionQueue((q) => q.filter((c) => !ids.includes(c.id)));
      appendLog({
        actorKey: "auditActorDpo",
        actionKey: "auditActionExemptionApproved",
        rationaleText: note,
        category: "dpo_action",
      });
    },
    [appendLog],
  );

  const resolveIncident = useCallback(() => {
    appendLog({
      actorKey: "auditActorDpo",
      actionKey: "auditActionCaseResolved",
      category: "report",
      caseId: incident?.caseId,
    });
    setIncident(null);
    setGracePending(false);
  }, [appendLog, incident?.caseId]);

  const legalState: LegalState = useMemo(() => {
    if (incident) return "3";
    if (exemptionQueue.length > 0) return "2";
    if (policy.dataMasking || policy.trafficThrottling) return "1b";
    return "1a";
  }, [incident, exemptionQueue.length, policy]);

  const value = useMemo<AppStateValue>(
    () => ({
      incident,
      gracePending,
      policy,
      exemptionQueue,
      auditLog,
      legalState,
      requestGracePeriod,
      updatePolicy,
      approveExemptions,
      resolveIncident,
    }),
    [
      incident,
      gracePending,
      policy,
      exemptionQueue,
      auditLog,
      legalState,
      requestGracePeriod,
      updatePolicy,
      approveExemptions,
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
