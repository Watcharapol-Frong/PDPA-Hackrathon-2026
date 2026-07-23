import { isSupabaseConfigured } from "../supabaseClient";
import type { DataSource } from "./DataSource";
import { mockDataSource } from "./mockDataSource";
import { supabaseDataSource } from "./supabaseDataSource";

/**
 * เลือกแหล่งข้อมูลด้วย env ตัวเดียว: NEXT_PUBLIC_DATA_SOURCE=mock|supabase
 * ต้องใช้ prefix NEXT_PUBLIC_ เพราะอ่านฝั่ง client ใน AppDataProvider
 */
export function getDataSource(): DataSource {
  const selected = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  switch (selected) {
    case "mock":
      return mockDataSource;
    case "supabase":
      if (!isSupabaseConfigured) {
        console.warn(
          "[data-source] NEXT_PUBLIC_DATA_SOURCE=supabase แต่ไม่มี NEXT_PUBLIC_SUPABASE_URL/ANON_KEY — ใช้ mock แทน",
        );
        return mockDataSource;
      }
      return supabaseDataSource;
    default:
      console.warn(`[data-source] ไม่รู้จัก "${selected}" — ใช้ mock แทน`);
      return mockDataSource;
  }
}

export type { DataSource, SeedData, DataSinks } from "./DataSource";
