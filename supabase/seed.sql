-- SafeGate / PDPA Guardian — demo seed data
-- ย้ายชุดข้อมูลจำลองเดิมจาก src/lib/mockData.ts เข้า Supabase ตรงตัว
-- เพื่อให้ demo ที่ต่อ Supabase จริงแสดงเคสเดียวกับตอนใช้ mock data source
-- รันหลังจาก supabase/schema.sql เท่านั้น (ต้องมีตารางอยู่ก่อน)
-- ใช้ ON CONFLICT DO NOTHING ทุกตาราง จึงรันซ้ำได้โดยไม่ error/ไม่ซ้ำข้อมูล

-- ─────────────────────────────────────────────
-- incidents (Crisis Management Room)
-- ─────────────────────────────────────────────

insert into incidents (
  case_id, title_key, severity, status, detected_at, remaining_seconds,
  affected_rows, compromised_fields, timeline, nodes, edges, ai_summary_key
) values
(
  'INC-2026-0718-01', 'incidentTitle1', 'high_risk', 'in_progress',
  '2026-07-18 02:15', 68 * 3600 + 42 * 60 + 15,
  15200,
  '[
    {"id":"citizen_id","labelKey":"piiCitizenId","column":"citizen_id","table":"customers.identity_profile","dataType":"VARCHAR(13)","sensitivity":"sensitivityGeneralId","affectedRows":15200,"leaked":true},
    {"id":"health_allergy","labelKey":"piiHealthAllergy","column":"allergy_records","table":"customers.health_profile","dataType":"JSONB","sensitivity":"sensitivitySection26","affectedRows":4380,"leaked":true},
    {"id":"full_name","labelKey":"piiFullName","column":"full_name","table":"customers.identity_profile","dataType":"VARCHAR(255)","sensitivity":"sensitivityGeneral","affectedRows":15200,"leaked":true}
  ]'::jsonb,
  '[
    {"time":"02:15","labelKey":"timeline1","severity":"warning"},
    {"time":"02:16","labelKey":"timeline2","severity":"critical"},
    {"time":"02:18","labelKey":"timeline3","severity":"critical"},
    {"time":"02:21","labelKey":"timeline4","severity":"info"}
  ]'::jsonb,
  '[
    {"id":"attacker","labelKey":"nodeAttacker","kind":"attacker","x":12,"y":50},
    {"id":"gateway","labelKey":"nodeGateway","kind":"gateway","x":50,"y":50},
    {"id":"database","labelKey":"nodeDatabase","kind":"database","x":88,"y":50}
  ]'::jsonb,
  '[
    {"from":"attacker","to":"gateway","labelKey":"edgeExploit"},
    {"from":"gateway","to":"database","labelKey":"edgeExfil"}
  ]'::jsonb,
  'aiSummary1'
),
(
  'INC-2026-0718-02', 'incidentTitle3', 'risk_present', 'awaiting_review',
  '2026-07-18 02:19', 61 * 3600 + 12 * 60 + 40,
  2400,
  '[
    {"id":"email","labelKey":"piiEmail","column":"contact_email","table":"marketing.subscriber","dataType":"VARCHAR(255)","sensitivity":"sensitivityGeneral","affectedRows":2400,"leaked":true}
  ]'::jsonb,
  '[
    {"time":"02:19","labelKey":"timeline3a","severity":"warning"},
    {"time":"02:24","labelKey":"timeline3b","severity":"warning"},
    {"time":"02:31","labelKey":"timeline3c","severity":"info"}
  ]'::jsonb,
  '[
    {"id":"attacker","labelKey":"nodeInternalScript","kind":"attacker","x":12,"y":50},
    {"id":"gateway","labelKey":"nodeGateway","kind":"gateway","x":50,"y":50},
    {"id":"database","labelKey":"nodeMarketingDb","kind":"database","x":88,"y":50}
  ]'::jsonb,
  '[
    {"from":"attacker","to":"gateway","labelKey":"edgeMisconfig"},
    {"from":"gateway","to":"database","labelKey":"edgeExport"}
  ]'::jsonb,
  'aiSummary3'
)
on conflict (case_id) do nothing;

-- ─────────────────────────────────────────────
-- exemption_cases (Form 5 queue — State 1b)
-- ─────────────────────────────────────────────

insert into exemption_cases (
  id, legal_state, detected_at, request_volume, fields_involved,
  masked_sample, mitigation, mitigation_factor, score_factors, status
) values
(
  'CASE-2026-0003', '1b', '2026-07-18 02:20', 320,
  '["session_token","device_fingerprint"]'::jsonb,
  'SESSION:***-MASK-*** | DEVICE:***-MASK-***',
  'เข้ารหัสทั้งชุดก่อนออกจากระบบ · Token หมุนเวียนแล้ว',
  10,
  '[
    {"label":"Data Sensitivity","value":"×0.5 — ข้อมูลระบบ ไม่ใช่ PII โดยตรง"},
    {"label":"Affected Volume","value":"320 records"},
    {"label":"Mitigation Factor (M)","value":"10.0 — เข้ารหัสครบถ้วน"},
    {"label":"Residual Risk","value":"ไม่มีความเสี่ยงต่อเจ้าของข้อมูล"}
  ]'::jsonb,
  'Pending'
),
(
  'CASE-2026-0004', '1b', '2026-07-18 02:21', 890,
  '["phone_number","address"]'::jsonb,
  'PHONE:08X-XXX-XXXX | ADDR:***-MASK-***',
  'พรางค่าก่อนส่งออก · Export job ถูกกักไว้',
  5,
  '[
    {"label":"Data Sensitivity","value":"×1.0 — ข้อมูลติดต่อทั่วไป"},
    {"label":"Affected Volume","value":"890 records"},
    {"label":"Mitigation Factor (M)","value":"5.0 — พรางค่าระหว่างส่ง"},
    {"label":"Residual Risk","value":"ต่ำ — ไม่พบการนำข้อมูลไปใช้ต่อ"}
  ]'::jsonb,
  'Pending'
),
(
  'CASE-2026-0005', '1b', '2026-07-18 02:22', 12,
  '["email_address"]'::jsonb,
  'EMAIL:qa-***@internal.test',
  'ทราฟฟิกทดสอบภายใน · เข้ารหัสครบ',
  10,
  '[
    {"label":"Data Sensitivity","value":"×1.0 — อีเมลทดสอบภายใน"},
    {"label":"Affected Volume","value":"12 records"},
    {"label":"Mitigation Factor (M)","value":"10.0 — เข้ารหัสครบถ้วน"},
    {"label":"Residual Risk","value":"ไม่มี — ไม่ใช่ข้อมูลลูกค้าจริง"}
  ]'::jsonb,
  'Approved'
)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────
-- audit_log (WORM log ตั้งต้น)
-- ─────────────────────────────────────────────

insert into audit_log (id, "timestamp", actor_key, action_key, category, case_id) values
('LOG-0001', '2026-07-18 02:15:03', 'auditActorSystem', 'auditActionDetected', 'detection', 'INC-2026-0718-01'),
('LOG-0002', '2026-07-18 02:18:41', 'auditActorSystem', 'auditActionExfiltration', 'detection', 'INC-2026-0718-01')
on conflict (id) do nothing;
