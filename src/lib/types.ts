export interface ExemptionCase {
  id: string;
  detectedAt: string;
  requestVolume: number;
  fieldsInvolved: string[];
  maskedSample: string;
  mitigation: string;
  scoreFactors: { label: string; value: string }[];
  status: "Pending" | "Approved" | "Reviewing" | "Rejected";
}

export interface PolicyState {
  dataMasking: boolean;
  trafficThrottling: boolean;
}

import type { TranslationKey } from "./LanguageContext";

/** ฟิลด์ PII ที่ถูกเจาะ — คลิกเพื่อดู schema เชิงลึก (Crisis Action Flow A) */
export interface CompromisedField {
  id: string;
  /** ป้ายที่แสดงบนหน้าจอ เช่น "บัตรประชาชน" */
  labelKey: TranslationKey;
  /** ชื่อฟิลด์จริงในฐานข้อมูล */
  column: string;
  table: string;
  dataType: string;
  /** ระดับความอ่อนไหวตาม ม.26 */
  sensitivity: TranslationKey;
  affectedRows: number;
  leaked: boolean;
}

export interface TimelineEvent {
  time: string;
  labelKey: TranslationKey;
  severity: "info" | "warning" | "critical";
}

export interface AttackNode {
  id: string;
  labelKey: TranslationKey;
  kind: "attacker" | "gateway" | "database";
  x: number;
  y: number;
}

export interface AttackEdge {
  from: string;
  to: string;
  labelKey: TranslationKey;
}

/** สถานะทางกฎหมายตาม ม.37(4) */
export type IncidentSeverity = "risk_present" | "high_risk";

/** ความคืบหน้าการจัดการเคสฝั่งองค์กร */
export type IncidentStatus = "awaiting_review" | "in_progress" | "grace_requested";

export interface IncidentData {
  caseId: string;
  titleKey: TranslationKey;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: string;
  /** วินาทีที่เหลือของกรอบเวลากฎหมาย 72 ชม. */
  remainingSeconds: number;
  affectedRows: number;
  compromisedFields: CompromisedField[];
  timeline: TimelineEvent[];
  nodes: AttackNode[];
  edges: AttackEdge[];
  /** ข้อสรุปจาก Pipeline B เฉพาะของเคสนี้ */
  aiSummaryKey: TranslationKey;
}

export interface KpiSeries {
  label: string;
  value: string;
  sub: string;
  labelKey?: string;
  subKey?: string;
  data: number[];
  color: string;
}
