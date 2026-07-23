import type { ExemptionCase, IncidentData } from "../types";
import type { AuditEntry } from "../AppStateContext";

/** ชุดข้อมูลตั้งต้นที่ AppStateProvider ใช้ seed state ในเครื่อง */
export interface SeedData {
  incidents: IncidentData[];
  exemptions: ExemptionCase[];
  auditLog: AuditEntry[];
}

/**
 * Hook เขียนกลับต่อ action ของ DPO — ไม่บังคับ (optional)
 * เรียกแบบ fire-and-forget หลังจาก local state ใน AppStateContext อัปเดตแล้ว
 * ห้าม await ใน render path เพราะ derived state ทั้งหมดยังอิง local array แบบ sync
 */
export interface DataSinks {
  onConfirmAwareness?: (caseId: string) => void;
  onRequestGracePeriod?: (caseId: string, note?: string) => void;
  onApproveExemptions?: (ids: string[], note: string) => void;
  onEscalateExemption?: (id: string, newIncident: IncidentData, note: string) => void;
  onFileDocument?: (caseId: string, doc: "pdpcReport" | "dataSubjectNotice") => void;
  onResolveIncident?: (caseId: string) => void;
  onUpdatePolicy?: (next: { dataMasking: boolean; trafficThrottling: boolean }) => void;
}

/** จุดตัดระหว่าง UI กับแหล่งข้อมูล — swap แหล่งได้โดย UI ไม่ต้องแก้ */
export interface DataSource {
  load(): Promise<SeedData>;
  sinks?: DataSinks;
}
