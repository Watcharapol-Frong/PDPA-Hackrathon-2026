import type { ExemptionCase, IncidentData, KpiSeries } from "./types";

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

export const exemptionQueue: ExemptionCase[] = [
  {
    id: "EX-3021",
    detectedAt: "2026-07-18 09:12",
    requestVolume: 1,
    fieldsInvolved: ["phone_number"],
    maskedSample: "phone_number: 081-XXX-XXXX",
    mitigation: "เข้ารหัสแล้ว (M=10.0)",
    status: "Pending",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "1 แถว" },
      { label: "Mitigation Factor (M)", value: "10.0 — ข้อมูลผ่านการเข้ารหัสแล้ว" },
      { label: "Sensitivity Weight", value: "1.0 — ข้อมูลติดต่อทั่วไป" },
    ],
  },
  {
    id: "EX-3022",
    detectedAt: "2026-07-18 08:47",
    requestVolume: 3,
    fieldsInvolved: ["email"],
    maskedSample: "email: som***@gm***.com",
    mitigation: "พรางค่าแล้ว (M=5.0)",
    status: "Pending",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "3 แถว" },
      { label: "Mitigation Factor (M)", value: "5.0 — ข้อมูลถูกพรางค่าระหว่างส่ง" },
      { label: "Sensitivity Weight", value: "1.0 — ข้อมูลติดต่อทั่วไป" },
    ],
  },
  {
    id: "EX-3023",
    detectedAt: "2026-07-18 07:58",
    requestVolume: 2,
    fieldsInvolved: ["citizen_id"],
    maskedSample: "citizen_id: 1-1037-XXXXX-XX-1",
    mitigation: "เข้ารหัสแล้ว (M=10.0)",
    status: "Approved",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "2 แถว" },
      { label: "Mitigation Factor (M)", value: "10.0 — ข้อมูลผ่านการเข้ารหัสแล้ว" },
      { label: "Sensitivity Weight", value: "2.0 — เลขบัตรประชาชน" },
    ],
  },
  {
    id: "EX-3024",
    detectedAt: "2026-07-17 22:31",
    requestVolume: 1,
    fieldsInvolved: ["phone_number", "email"],
    maskedSample: "phone_number: 089-XXX-XXXX",
    mitigation: "เข้ารหัสแล้ว (M=10.0)",
    status: "Pending",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "1 แถว" },
      { label: "Mitigation Factor (M)", value: "10.0 — ข้อมูลผ่านการเข้ารหัสแล้ว" },
      { label: "Sensitivity Weight", value: "1.0 — ข้อมูลติดต่อทั่วไป" },
    ],
  },
  {
    id: "EX-3025",
    detectedAt: "2026-07-17 19:04",
    requestVolume: 4,
    fieldsInvolved: ["citizen_id"],
    maskedSample: "citizen_id: 3-4509-XXXXX-XX-8",
    mitigation: "พรางค่าแล้ว (M=5.0)",
    status: "Reviewing",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "4 แถว" },
      { label: "Mitigation Factor (M)", value: "5.0 — ข้อมูลถูกพรางค่าระหว่างส่ง" },
      { label: "Sensitivity Weight", value: "2.0 — เลขบัตรประชาชน" },
    ],
  },
  {
    id: "EX-3026",
    detectedAt: "2026-07-17 15:22",
    requestVolume: 12,
    fieldsInvolved: ["credit_card"],
    maskedSample: "credit_card: 4540-XXXX-XXXX-8902",
    mitigation: "จำกัดทราฟฟิก (M=7.0)",
    status: "Rejected",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "12 แถว" },
      { label: "Mitigation Factor (M)", value: "7.0 — จำกัดความเร็วเพื่อชะลอการดึงข้อมูล" },
      { label: "Sensitivity Weight", value: "3.0 — ข้อมูลการเงิน" },
    ],
  },
  {
    id: "EX-3027",
    detectedAt: "2026-07-17 11:15",
    requestVolume: 1,
    fieldsInvolved: ["address"],
    maskedSample: "address: 123/45 ซอยสุขุมวิท XX...",
    mitigation: "พรางค่าแล้ว (M=5.0)",
    status: "Approved",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "1 แถว" },
      { label: "Mitigation Factor (M)", value: "5.0 — ข้อมูลถูกพรางค่าบางส่วน" },
      { label: "Sensitivity Weight", value: "1.0 — ข้อมูลติดต่อทั่วไป" },
    ],
  },
  {
    id: "EX-3028",
    detectedAt: "2026-07-17 08:30",
    requestVolume: 5,
    fieldsInvolved: ["citizen_id", "phone_number"],
    maskedSample: "citizen_id: 5-3012-XXXXX-XX-4",
    mitigation: "เข้ารหัสแล้ว (M=10.0)",
    status: "Pending",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "5 แถว" },
      { label: "Mitigation Factor (M)", value: "10.0 — ข้อมูลผ่านการเข้ารหัสแล้ว" },
      { label: "Sensitivity Weight", value: "2.0 — เลขบัตรประชาชน" },
    ],
  },
  {
    id: "EX-3029",
    detectedAt: "2026-07-16 23:44",
    requestVolume: 8,
    fieldsInvolved: ["ip_address"],
    maskedSample: "ip_address: 192.168.X.X",
    mitigation: "จำกัดทราฟฟิก (M=7.0)",
    status: "Reviewing",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "8 แถว" },
      { label: "Mitigation Factor (M)", value: "7.0 — จำกัดความเร็วทราฟฟิก" },
      { label: "Sensitivity Weight", value: "0.5 — ข้อมูลระบบทั่วไป" },
    ],
  },
  {
    id: "EX-3030",
    detectedAt: "2026-07-16 14:18",
    requestVolume: 2,
    fieldsInvolved: ["health_record"],
    maskedSample: "health_record: Patient exhibits XX symptoms...",
    mitigation: "ไม่มี (M=0.0)",
    status: "Pending",
    scoreFactors: [
      { label: "ปริมาณคำขอ (Volume)", value: "2 แถว" },
      { label: "Mitigation Factor (M)", value: "0.0 — ไม่มีมาตรการป้องกันหน้างาน" },
      { label: "Sensitivity Weight", value: "4.0 — ข้อมูลสุขภาพ (Sensitive PII)" },
    ],
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
  status: "awaiting_review",
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

  {
    caseId: "INC-2026-0716-02",
    titleKey: "incidentTitle2",
    severity: "high_risk",
    status: "in_progress",
    detectedAt: "2026-07-16 23:44",
    // ใกล้เส้นตายที่สุด — ต้องถูกจัดขึ้นบนสุดของคิว
    remainingSeconds: 11 * 3600 + 8 * 60 + 40,
    affectedRows: 890,
    compromisedFields: [
      {
        id: "credit_card",
        labelKey: "piiCreditCard",
        column: "card_pan",
        table: "billing.payment_method",
        dataType: "VARCHAR(16)",
        sensitivity: "sensitivityFinancial",
        affectedRows: 890,
        leaked: true,
      },
      {
        id: "full_name",
        labelKey: "piiFullName",
        column: "cardholder_name",
        table: "billing.payment_method",
        dataType: "VARCHAR(255)",
        sensitivity: "sensitivityGeneral",
        affectedRows: 890,
        leaked: true,
      },
    ],
    timeline: [
      { time: "23:44", labelKey: "timeline2a", severity: "warning" },
      { time: "23:47", labelKey: "timeline2b", severity: "critical" },
      { time: "23:52", labelKey: "timeline2c", severity: "info" },
    ],
    nodes: [
      { id: "attacker", labelKey: "nodeAttacker", kind: "attacker", x: 12, y: 50 },
      { id: "gateway", labelKey: "nodeGateway", kind: "gateway", x: 50, y: 50 },
      { id: "database", labelKey: "nodeBillingDb", kind: "database", x: 88, y: 50 },
    ],
    edges: [
      { from: "attacker", to: "gateway", labelKey: "edgeExploit" },
      { from: "gateway", to: "database", labelKey: "edgeExfil" },
    ],
    aiSummaryKey: "aiSummary2",
  },

  {
    caseId: "INC-2026-0717-04",
    titleKey: "incidentTitle3",
    severity: "risk_present",
    status: "grace_requested",
    detectedAt: "2026-07-17 14:02",
    remainingSeconds: 31 * 3600 + 26 * 60 + 5,
    affectedRows: 2400,
    compromisedFields: [
      {
        id: "email",
        labelKey: "piiEmail",
        column: "contact_email",
        table: "marketing.subscriber",
        dataType: "VARCHAR(255)",
        sensitivity: "sensitivityGeneral",
        affectedRows: 2400,
        leaked: true,
      },
    ],
    timeline: [
      { time: "14:02", labelKey: "timeline3a", severity: "warning" },
      { time: "14:09", labelKey: "timeline3b", severity: "warning" },
      { time: "14:15", labelKey: "timeline3c", severity: "info" },
    ],
    nodes: [
      { id: "attacker", labelKey: "nodeInternalScript", kind: "attacker", x: 12, y: 50 },
      { id: "gateway", labelKey: "nodeGateway", kind: "gateway", x: 50, y: 50 },
      { id: "database", labelKey: "nodeMarketingDb", kind: "database", x: 88, y: 50 },
    ],
    edges: [
      { from: "attacker", to: "gateway", labelKey: "edgeMisconfig" },
      { from: "gateway", to: "database", labelKey: "edgeExport" },
    ],
    aiSummaryKey: "aiSummary3",
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
