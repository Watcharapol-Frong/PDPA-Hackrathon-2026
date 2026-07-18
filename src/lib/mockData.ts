import type { ExemptionCase, IncidentData, KpiSeries } from "./types";
import type { AuditEntry } from "./AppStateContext";

export const kpiCards: KpiSeries[] = [
  {
    label: "Total Inspected Traffic",
    labelKey: "kpiTraffic",
    value: "1,280,000",
    sub: "requests สแกนแล้วใน 30 วัน · +9.2% จากเดือนก่อน",
    subKey: "kpiTrafficSub",
    data: [820, 902, 860, 940, 1010, 980, 1120, 1180, 1150, 1240, 1300, 1280],
    color: "#ff5c00",
  },
  {
    label: "Auto-Masked Count",
    labelKey: "kpiMasked",
    value: "812,000",
    sub: "คีย์ข้อมูลส่วนบุคคลที่ระบบช่วยบังตาสำเร็จ · 99.97%",
    subKey: "kpiMaskedSub",
    data: [400, 460, 470, 520, 560, 610, 640, 700, 730, 760, 790, 812],
    color: "#059669",
  },
  {
    label: "Pending Exemption Cases",
    labelKey: "kpiPending",
    value: "5",
    sub: "รายงานคำร้องขอยกเว้น (Form 5) ที่รอกดอนุมัติ",
    subKey: "kpiPendingSub",
    data: [12, 10, 14, 9, 11, 8, 13, 10, 7, 9, 6, 5],
    color: "#d97706",
  },
];

export const riskTelemetrySeries = [
  { t: "00:00", score: 8 },
  { t: "02:00", score: 6 },
  { t: "04:00", score: 7 },
  { t: "06:00", score: 12 },
  { t: "08:00", score: 18 },
  { t: "10:00", score: 15 },
  { t: "12:00", score: 22 },
  { t: "14:00", score: 19 },
  { t: "16:00", score: 26 },
  { t: "18:00", score: 21 },
  { t: "20:00", score: 14 },
  { t: "22:00", score: 10 },
];

/** คิวประเมินข้อยกเว้นที่เชื่อมกับ INC-2026-0718-01 */
export const exemptionQueue: ExemptionCase[] = [
  {
    id: "EX-2026-0001",
    detectedAt: "2026-07-18 02:17",
    requestVolume: 4380,
    fieldsInvolved: ["allergy_records", "health_profile"],
    maskedSample: "ALLERGY:***-MASK-*** | DRUG:***-MASK-***",
    mitigation: "Deep Audit Logging เปิดใช้งาน · ข้อมูลสุขภาพผ่าน Re-encryption แล้ว",
    scoreFactors: [
      { label: "Data Sensitivity (ม.26)", value: "×5.0 — Critical" },
      { label: "Affected Volume", value: "4,380 records" },
      { label: "Masking Coverage", value: "100% masked post-detection" },
      { label: "Breach Containment", value: "Confirmed within 6 min" },
    ],
    status: "Pending",
  },
  {
    id: "EX-2026-0002",
    detectedAt: "2026-07-18 02:18",
    requestVolume: 15200,
    fieldsInvolved: ["citizen_id", "full_name"],
    maskedSample: "NID:1-XXXX-XXXXX-XX-X | NAME:***-MASK-***",
    mitigation: "IP บล็อกแล้ว · Token หมุนเวียนครบ · Traffic Throttling เปิด",
    scoreFactors: [
      { label: "Data Sensitivity", value: "×2.0 — National ID" },
      { label: "Affected Volume", value: "15,200 records" },
      { label: "Exfiltration Confirmed", value: "Yes — must notify สคส." },
      { label: "Post-containment Risk", value: "Low — no further leak" },
    ],
    status: "Rejected",
  },
  {
    id: "EX-2026-0003",
    detectedAt: "2026-07-18 02:20",
    requestVolume: 812,
    fieldsInvolved: ["session_token", "device_fingerprint"],
    maskedSample: "SES:eyJ***REDACTED*** | DEV:fp_***MASK***",
    mitigation: "Session tokens revoked ทั้งหมด · Device fingerprint purged จาก cache",
    scoreFactors: [
      { label: "Data Sensitivity", value: "×1.0 — Technical metadata" },
      { label: "Affected Volume", value: "812 records" },
      { label: "PII Exposure", value: "Indirect only" },
      { label: "Forensic Status", value: "Under active investigation" },
    ],
    status: "Reviewing",
  },
  {
    id: "EX-2026-0004",
    detectedAt: "2026-07-18 02:21",
    requestVolume: 230,
    fieldsInvolved: ["email_address"],
    maskedSample: "EMAIL:u***@***.com",
    mitigation: "Email field masked · Downstream webhook ถูก suspend แล้ว",
    scoreFactors: [
      { label: "Data Sensitivity", value: "×1.0 — General PII" },
      { label: "Affected Volume", value: "230 records" },
      { label: "Masking Coverage", value: "100%" },
      { label: "Risk Score", value: "Low (1.2/5.0)" },
    ],
    status: "Approved",
  },
  {
    id: "EX-2026-0005",
    detectedAt: "2026-07-18 02:22",
    requestVolume: 96,
    fieldsInvolved: ["phone_number", "address"],
    maskedSample: "TEL:0XX-XXX-XXXX | ADDR:***-MASK-***",
    mitigation: "Contact fields masked · Export job quarantined",
    scoreFactors: [
      { label: "Data Sensitivity", value: "×1.0 — General PII" },
      { label: "Affected Volume", value: "96 records" },
      { label: "Export Scope", value: "Internal batch only" },
      { label: "Risk Score", value: "Low (0.9/5.0)" },
    ],
    status: "Pending",
  },
];

export const bulkReasonOptions = [
  "ตรวจสอบแล้วเป็นทราฟฟิกทดสอบภายใน (Internal Load Test)",
  "ข้อมูลผ่านการเข้ารหัส/พรางค่าครบถ้วน — ไม่มีความเสี่ยงต่อเจ้าของข้อมูล",
  "เป็นการเข้าถึงตามรอบงาน Batch ปกติที่ได้รับอนุญาต",
  "ทราฟฟิกจากระบบ Monitoring ของบริษัทเอง",
];

/* ─────────────────────────────────────────────
   Crisis Management Room (Active Incident Room)
   ───────────────────────────────────────────── */

export const incidents: IncidentData[] = [
  {
  caseId: "INC-2026-0718-01",
  titleKey: "incidentTitle1",
  severity: "high_risk",
  status: "in_progress",
  detectedAt: "2026-07-18 02:15",
  // เหลือ 68:42:15 จากกรอบ 72 ชม.
  remainingSeconds: 68 * 3600 + 42 * 60 + 15,
  affectedRows: 15200,
  compromisedFields: [
    {
      id: "citizen_id",
      labelKey: "piiCitizenId",
      column: "citizen_id",
      table: "customers.identity_profile",
      dataType: "VARCHAR(13)",
      sensitivity: "sensitivityGeneralId",
      affectedRows: 15200,
      leaked: true,
    },
    {
      id: "health_allergy",
      labelKey: "piiHealthAllergy",
      column: "allergy_records",
      table: "customers.health_profile",
      dataType: "JSONB",
      sensitivity: "sensitivitySection26",
      affectedRows: 4380,
      leaked: true,
    },
    {
      id: "full_name",
      labelKey: "piiFullName",
      column: "full_name",
      table: "customers.identity_profile",
      dataType: "VARCHAR(255)",
      sensitivity: "sensitivityGeneral",
      affectedRows: 15200,
      leaked: true,
    },
  ],
  timeline: [
    { time: "02:15", labelKey: "timeline1", severity: "warning" },
    { time: "02:16", labelKey: "timeline2", severity: "critical" },
    { time: "02:18", labelKey: "timeline3", severity: "critical" },
    { time: "02:21", labelKey: "timeline4", severity: "info" },
  ],
  nodes: [
    { id: "attacker", labelKey: "nodeAttacker", kind: "attacker", x: 12, y: 50 },
    { id: "gateway", labelKey: "nodeGateway", kind: "gateway", x: 50, y: 50 },
    { id: "database", labelKey: "nodeDatabase", kind: "database", x: 88, y: 50 },
  ],
  edges: [
    { from: "attacker", to: "gateway", labelKey: "edgeExploit" },
    { from: "gateway", to: "database", labelKey: "edgeExfil" },
  ],
  aiSummaryKey: "aiSummary1",
  },
];

/** ค้นหาเคสจาก caseId บน URL */
export function getIncidentById(caseId: string): IncidentData | undefined {
  return incidents.find((i) => i.caseId === caseId);
}

export const incidentData = incidents[0];

/** เหตุผลความจำเป็นสำหรับขอ Grace Period (Crisis Action Flow B) */
export const gracePeriodReasonKeys = [
  "graceReason1",
  "graceReason2",
  "graceReason3",
  "graceReason4",
] as const;

/** บันทึก WORM ตั้งต้น — เหตุการณ์ที่ระบบตรวจพบเองก่อน DPO จะเข้ามา */
export const initialAuditLog: AuditEntry[] = [
  {
    id: "LOG-0002",
    timestamp: "2026-07-18 02:18:41",
    actorKey: "auditActorSystem",
    actionKey: "auditActionExfiltration",
    category: "detection",
    caseId: "INC-2026-0718-01",
  },
  {
    id: "LOG-0001",
    timestamp: "2026-07-18 02:15:03",
    actorKey: "auditActorSystem",
    actionKey: "auditActionDetected",
    category: "detection",
    caseId: "INC-2026-0718-01",
  },
];
