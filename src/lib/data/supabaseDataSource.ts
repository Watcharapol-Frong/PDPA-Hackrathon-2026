import { getSupabaseClient } from "../supabaseClient";
import type {
  CompromisedField,
  ExemptionCase,
  IncidentData,
  TimelineEvent,
  AttackNode,
  AttackEdge,
} from "../types";
import type { AuditEntry } from "../AppStateContext";
import type { DataSource, SeedData } from "./DataSource";

interface IncidentRow {
  case_id: string;
  title_key: string;
  severity: IncidentData["severity"];
  status: IncidentData["status"];
  detected_at: string;
  remaining_seconds: number;
  affected_rows: number;
  compromised_fields: CompromisedField[];
  timeline: TimelineEvent[];
  nodes: AttackNode[];
  edges: AttackEdge[];
  ai_summary_key: string;
  escalated_from: string | null;
}

interface ExemptionRow {
  id: string;
  legal_state: ExemptionCase["legalState"];
  detected_at: string;
  request_volume: number;
  fields_involved: string[];
  masked_sample: string;
  mitigation: string;
  mitigation_factor: number;
  score_factors: { label: string; value: string }[];
  status: ExemptionCase["status"];
  escalated_to: string | null;
}

interface AuditRow {
  id: string;
  timestamp: string;
  actor_key: AuditEntry["actorKey"];
  action_key: AuditEntry["actionKey"];
  rationale_key: AuditEntry["rationaleKey"] | null;
  rationale_text: string | null;
  category: AuditEntry["category"];
  case_id: string | null;
}

function toIncident(row: IncidentRow): IncidentData {
  return {
    caseId: row.case_id,
    titleKey: row.title_key as IncidentData["titleKey"],
    severity: row.severity,
    status: row.status,
    detectedAt: row.detected_at,
    remainingSeconds: row.remaining_seconds,
    affectedRows: row.affected_rows,
    compromisedFields: row.compromised_fields,
    timeline: row.timeline,
    nodes: row.nodes,
    edges: row.edges,
    aiSummaryKey: row.ai_summary_key as IncidentData["aiSummaryKey"],
    escalatedFrom: row.escalated_from ?? undefined,
  };
}

function toExemption(row: ExemptionRow): ExemptionCase {
  return {
    id: row.id,
    legalState: row.legal_state,
    detectedAt: row.detected_at,
    requestVolume: row.request_volume,
    fieldsInvolved: row.fields_involved,
    maskedSample: row.masked_sample,
    mitigation: row.mitigation,
    mitigationFactor: row.mitigation_factor,
    scoreFactors: row.score_factors,
    status: row.status,
    escalatedTo: row.escalated_to ?? undefined,
  };
}

function toAuditEntry(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    timestamp: row.timestamp,
    actorKey: row.actor_key,
    actionKey: row.action_key,
    rationaleKey: row.rationale_key ?? undefined,
    rationaleText: row.rationale_text ?? undefined,
    category: row.category,
    caseId: row.case_id ?? undefined,
  };
}

function fromIncident(incident: IncidentData): IncidentRow {
  return {
    case_id: incident.caseId,
    title_key: incident.titleKey,
    severity: incident.severity,
    status: incident.status,
    detected_at: incident.detectedAt,
    remaining_seconds: incident.remainingSeconds,
    affected_rows: incident.affectedRows,
    compromised_fields: incident.compromisedFields,
    timeline: incident.timeline,
    nodes: incident.nodes,
    edges: incident.edges,
    ai_summary_key: incident.aiSummaryKey,
    escalated_from: incident.escalatedFrom ?? null,
  };
}

/** log สำเร็จรูปสำหรับผลลัพธ์ของ fire-and-forget write ไปยัง Supabase */
function logSinkError(action: string, error: { message: string } | null) {
  if (error) console.error(`[supabase-sink] ${action} ล้มเหลว:`, error.message);
}

export const supabaseDataSource: DataSource = {
  async load(): Promise<SeedData> {
    const supabase = getSupabaseClient();

    const [incidentsRes, exemptionsRes, auditRes] = await Promise.all([
      supabase.from("incidents").select("*").order("remaining_seconds", { ascending: true }),
      supabase.from("exemption_cases").select("*").order("detected_at", { ascending: true }),
      supabase.from("audit_log").select("*").order("timestamp", { ascending: false }),
    ]);

    if (incidentsRes.error) throw incidentsRes.error;
    if (exemptionsRes.error) throw exemptionsRes.error;
    if (auditRes.error) throw auditRes.error;

    return {
      incidents: (incidentsRes.data as IncidentRow[]).map(toIncident),
      exemptions: (exemptionsRes.data as ExemptionRow[]).map(toExemption),
      auditLog: (auditRes.data as AuditRow[]).map(toAuditEntry),
    };
  },

  sinks: {
    onConfirmAwareness(caseId) {
      const supabase = getSupabaseClient();
      const deadlineAt = Date.now() + 72 * 3600 * 1000;
      supabase
        .from("incidents")
        .update({ awareness_confirmed_at: new Date().toISOString(), deadline_at: deadlineAt })
        .eq("case_id", caseId)
        .then(({ error }) => logSinkError("onConfirmAwareness", error));
    },

    onRequestGracePeriod(caseId) {
      const supabase = getSupabaseClient();
      supabase
        .from("incidents")
        .update({ status: "grace_requested" })
        .eq("case_id", caseId)
        .then(({ error }) => logSinkError("onRequestGracePeriod", error));
    },

    onApproveExemptions(ids) {
      const supabase = getSupabaseClient();
      supabase
        .from("exemption_cases")
        .update({ status: "Approved" })
        .in("id", ids)
        .then(({ error }) => logSinkError("onApproveExemptions", error));
    },

    onEscalateExemption(id, newIncident) {
      const supabase = getSupabaseClient();
      supabase
        .from("exemption_cases")
        .update({ status: "Rejected", escalated_to: newIncident.caseId })
        .eq("id", id)
        .then(({ error }) => logSinkError("onEscalateExemption (update source)", error));
      supabase
        .from("incidents")
        .insert(fromIncident(newIncident))
        .then(({ error }) => logSinkError("onEscalateExemption (insert incident)", error));
    },

    onFileDocument(caseId, doc) {
      const supabase = getSupabaseClient();
      supabase
        .from("incident_documents")
        .upsert({ case_id: caseId, [doc]: true })
        .then(({ error }) => logSinkError("onFileDocument", error));
    },

    onResolveIncident(caseId) {
      const supabase = getSupabaseClient();
      supabase
        .from("incidents")
        .delete()
        .eq("case_id", caseId)
        .then(({ error }) => logSinkError("onResolveIncident", error));
    },

    onUpdatePolicy(next) {
      const supabase = getSupabaseClient();
      supabase
        .from("policy_state")
        .upsert({ id: 1, data_masking: next.dataMasking, traffic_throttling: next.trafficThrottling })
        .then(({ error }) => logSinkError("onUpdatePolicy", error));
    },
  },
};
