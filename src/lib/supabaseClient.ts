import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** true เมื่อมี env ครบพอที่จะเปิดใช้ Supabase ได้จริง */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** สร้าง client ครั้งเดียวแบบ lazy — โยน error ถ้าเรียกโดยไม่มี env ครบ */
export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase env ไม่ครบ: ต้องตั้ง NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  if (!client) {
    client = createClient(url!, anonKey!);
  }
  return client;
}
