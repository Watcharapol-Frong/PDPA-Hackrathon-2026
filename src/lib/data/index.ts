import type { DataSource } from "./DataSource";
import { mockDataSource } from "./mockDataSource";

/**
 * จุดเดียวที่เลือกแหล่งข้อมูล — ตอนนี้มีแค่ mock
 * เพิ่มแหล่งข้อมูลใหม่ในอนาคตได้โดยเติม case ที่นี่ ไม่ต้องแตะ UI component ใด ๆ
 */
export function getDataSource(): DataSource {
  return mockDataSource;
}

export type { DataSource, SeedData, DataSinks } from "./DataSource";
