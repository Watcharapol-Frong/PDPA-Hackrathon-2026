import { incidents, exemptionQueue, initialAuditLog } from "../mockData";
import type { DataSource, SeedData } from "./DataSource";

/**
 * แหล่งข้อมูลจำลอง — resolve ทันที (ไม่มี network delay) เพื่อไม่ให้เกิด
 * skeleton flash หรือ hydration mismatch ระหว่าง SSR กับ client
 * ไม่ใส่ sinks: การกระทำของ DPO ยังคงอยู่ในหน่วยความจำเหมือนเดิมทุกประการ
 */
export const mockDataSource: DataSource = {
  async load(): Promise<SeedData> {
    return {
      incidents,
      exemptions: exemptionQueue,
      auditLog: initialAuditLog,
    };
  },
};
