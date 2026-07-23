-- SafeGate / PDPA Guardian — Supabase schema
-- Maps 1:1 to the domain types in src/lib/types.ts and AuditEntry in
-- src/lib/AppStateContext.tsx. Run this once in the Supabase SQL editor
-- (or via `supabase db push`) on a fresh project before switching
-- NEXT_PUBLIC_DATA_SOURCE=supabase.
--
-- Fields with nested arrays/objects (compromised fields, timeline, attack
-- graph nodes/edges, score factors) are stored as JSONB since the UI reads
-- them as opaque structures keyed by TranslationKey — no relational value
-- in normalizing them further for this app's scale.

create table if not exists incidents (
  case_id             text primary key,
  title_key           text not null,
  severity            text not null check (severity in ('risk_present', 'high_risk')),
  status              text not null check (status in ('awaiting_review', 'in_progress', 'grace_requested')),
  detected_at         text not null,
  remaining_seconds   integer not null,
  affected_rows       integer not null,
  compromised_fields  jsonb not null default '[]',
  timeline            jsonb not null default '[]',
  nodes               jsonb not null default '[]',
  edges               jsonb not null default '[]',
  ai_summary_key      text not null,
  escalated_from      text,
  -- เวลาที่ DPO ยืนยันทราบเหตุ + deadline ที่คำนวณจากเวลานั้น (นาฬิกา 72 ชม. ตาม ม.37(4))
  awareness_confirmed_at timestamptz,
  deadline_at         bigint,
  created_at          timestamptz not null default now()
);

create table if not exists exemption_cases (
  id                 text primary key,
  legal_state        text not null check (legal_state in ('1b', '2', '3')),
  detected_at        text not null,
  request_volume     integer not null,
  fields_involved    jsonb not null default '[]',
  masked_sample      text not null,
  mitigation         text not null,
  mitigation_factor  numeric not null,
  score_factors      jsonb not null default '[]',
  status             text not null check (status in ('Pending', 'Approved', 'Reviewing', 'Rejected')),
  escalated_to       text,
  created_at         timestamptz not null default now()
);

create table if not exists audit_log (
  id             text primary key,
  "timestamp"    text not null,
  actor_key      text not null,
  action_key     text not null,
  rationale_key  text,
  rationale_text text,
  category       text not null check (category in ('detection', 'enforcement', 'dpo_action', 'policy', 'report')),
  case_id        text,
  created_at     timestamptz not null default now()
);

-- แถวเดียวต่อองค์กร — ค่า toggle นโยบายปัจจุบัน
create table if not exists policy_state (
  id                  integer primary key default 1 check (id = 1),
  data_masking        boolean not null default true,
  traffic_throttling  boolean not null default false
);
insert into policy_state (id, data_masking, traffic_throttling)
values (1, true, false)
on conflict (id) do nothing;

-- เอกสารที่ยื่นแล้วต่อเคส — State 3 ต้องครบทั้ง pdpc_report และ data_subject_notice ก่อนปิดเคสได้
create table if not exists incident_documents (
  case_id             text primary key references incidents(case_id) on delete cascade,
  pdpc_report         boolean not null default false,
  data_subject_notice boolean not null default false
);

create index if not exists idx_audit_log_case_id on audit_log(case_id);
create index if not exists idx_exemption_cases_status on exemption_cases(status);

-- RLS: ปิดไว้ก่อนสำหรับ hackathon/demo — เปิดและตั้ง policy ก่อนใช้งานจริงกับข้อมูลลูกค้าจริง
-- alter table incidents enable row level security;
-- alter table exemption_cases enable row level security;
-- alter table audit_log enable row level security;
-- alter table policy_state enable row level security;
-- alter table incident_documents enable row level security;
