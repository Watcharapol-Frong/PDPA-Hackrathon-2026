"use client";

import { use, useMemo, type ReactNode } from "react";
import { AppStateProvider } from "../AppStateContext";
import { getDataSource } from "./index";
import { mockDataSource } from "./mockDataSource";

interface AppDataProviderProps {
  children: ReactNode;
}

/**
 * ตัวคั่นระหว่าง "ข้อมูลมาจากไหน" กับ AppStateContext ที่เป็นเจ้าของ state ในเครื่อง
 * เปลี่ยนแหล่งข้อมูล (mock/supabase) ที่นี่ที่เดียว — ไม่ต้องแตะ UI component ใด ๆ
 * ใช้ Suspense (`use`) เพื่อให้พร้อมรับ fetch จริงจาก Supabase ในอนาคตโดยไม่ต้องเขียนใหม่
 */
export function AppDataProvider({ children }: AppDataProviderProps) {
  const dataSource = useMemo(() => getDataSource(), []);
  // ถ้า Supabase ตั้งค่าไว้แต่ query ล้มเหลว (เช่นยังไม่รัน schema.sql) ให้ตกกลับไป mock
  // แทนที่จะพังทั้งแอป — เห็น error ใน console แต่ demo ยังใช้งานต่อได้
  const seed = use(
    useMemo(
      () =>
        dataSource.load().catch((err) => {
          console.error("[AppDataProvider] โหลดข้อมูลจาก data source ล้มเหลว ใช้ mock แทน:", err);
          return mockDataSource.load();
        }),
      [dataSource],
    ),
  );

  return (
    <AppStateProvider
      initialIncidents={seed.incidents}
      initialExemptions={seed.exemptions}
      initialAuditLog={seed.auditLog}
      sinks={dataSource.sinks}
    >
      {children}
    </AppStateProvider>
  );
}
