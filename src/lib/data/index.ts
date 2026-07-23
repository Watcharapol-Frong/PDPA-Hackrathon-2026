import type { DataSource } from "./DataSource";
import { mockDataSource } from "./mockDataSource";

/**
 * เลือกแหล่งข้อมูลด้วย env ตัวเดียว: NEXT_PUBLIC_DATA_SOURCE=mock|supabase
 * ต้องใช้ prefix NEXT_PUBLIC_ เพราะอ่านฝั่ง client ใน AppDataProvider
 * ค่า "supabase" ยังไม่ implement ในรอบนี้ — ตกกลับไปใช้ mock พร้อม warning
 */
export function getDataSource(): DataSource {
  const selected = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  switch (selected) {
    case "mock":
      return mockDataSource;
    case "supabase":
      console.warn(
        "[data-source] NEXT_PUBLIC_DATA_SOURCE=supabase ยังไม่ implement ในรอบนี้ — ใช้ mock แทน",
      );
      return mockDataSource;
    default:
      console.warn(`[data-source] ไม่รู้จัก "${selected}" — ใช้ mock แทน`);
      return mockDataSource;
  }
}

export type { DataSource, SeedData, DataSinks } from "./DataSource";
