/**
 * สถานะทางกฎหมายตามประกาศ สคส. — เป็นตัวกำหนดว่าต้องทำอะไรต่อ
 * ห้ามใช้ป้ายความรุนแรงลอย ๆ ที่ไม่ผูกกับกฎหมาย (Design Spec ข้อ 8.1)
 *
 *  1b = เกิดเหตุจริงแต่ Mitigation Factor สูงพอจนไม่มีความเสี่ยง → ยกเว้นการแจ้ง (Form 5)
 *  2  = มีความเสี่ยง แต่ไม่ถึงระดับสูง → แจ้ง สคส. ภายใน 72 ชม.
 *  3  = เสี่ยงสูงต่อสิทธิเสรีภาพ → แจ้ง สคส. + เจ้าของข้อมูล ภายใน 72 ชม.
 */
export type CaseLegalState = "1b" | "2" | "3";

/** ความคืบหน้าการทำงานของ DPO — เป็นคนละแกนกับความเสี่ยง */
export type ExemptionStatus = "Pending" | "Approved" | "Reviewing" | "Rejected";

export interface ExemptionCase {
  id: string;
  /** ความเสี่ยงมาจากตัวเหตุ (sensitivity × volume ÷ M) ไม่ใช่จากการที่ DPO กดปุ่ม */
  legalState: CaseLegalState;
  detectedAt: string;
  requestVolume: number;
  fieldsInvolved: string[];
  maskedSample: string;
  mitigation: string;
  /** ค่า Mitigation Factor (M) ที่ทำให้เคสนี้เข้าเงื่อนไขยกเว้น */
  mitigationFactor: number;
  scoreFactors: { label: string; value: string }[];
  status: ExemptionStatus;
  /** ถ้าถูกตีกลับแล้วยกระดับเป็นเหตุวิกฤต — เก็บเลขคดีปลายทางไว้เชื่อมกัน */
  escalatedTo?: string;
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

/**
 * สถานะทางกฎหมายตาม ม.37(4) — ตรงกับ CaseLegalState
 *   risk_present = State 2 → แจ้ง สคส. อย่างเดียว
 *   high_risk    = State 3 → แจ้ง สคส. + เจ้าของข้อมูล
 */
export type IncidentSeverity = "risk_present" | "high_risk";

/** เอกสารที่ต้องยื่นให้ครบก่อนปิดคดี — State 3 ต้องครบทั้งคู่ */
export interface IncidentDocuments {
  pdpcReport: boolean;
  dataSubjectNotice: boolean;
}

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
  /** ถ้าเหตุนี้เกิดจากการที่ DPO ตีกลับเคสยกเว้น — เก็บเลขเคสต้นทางไว้ */
  escalatedFrom?: string;
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
