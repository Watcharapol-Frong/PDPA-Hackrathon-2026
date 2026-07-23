"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "th";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  tArray: (key: TranslationArrayKey) => string[];
}

const translations = {
  en: {
    // Topbar
    appTitle: "ThanKan",
    companyName: "Siam Commerce Co., Ltd.",
    gatewayType: "SME-0001 · Centralized Shared Gateway",
    lastUpdated: "Last updated: 1 minute ago",
    notification: "Notifications",
    logout: "Log out",
    openNav: "Open navigation menu",
    closeSidebar: "Close sidebar",
    openSidebar: "Open sidebar",
    userName: "Nattakarn (DPO)",
    notifTitle: "Notification Center",
    notifSectionBroadcast: "PDPC Urgent Broadcast",
    notifSectionGeneral: "System Notifications",
    notifMsg1: "Baseline proven log recorded continuously as safety proof.",
    notifMsg2: "DPO security credential verified on 2FA pipeline.",
    notifMsg3: "Daily automated backup storage check: 98.4% capacity.",

    // Sidebar Items
    menuOverview: "Overview",
    menuOverviewSub: "Operational Command Center",
    menuIncident: "Crisis Management Room",
    menuIncidentSub: "Active Incident Room",
    menuAudit: "Digital Evidence Log",
    menuAuditSub: "Immutable Auditing Log",
    menuThreat: "Threat Analytics Panel",
    menuThreatSub: "Threat Analytics Panel",
    menuSettings: "Policy & Settings",
    menuSettingsSub: "Policy & Schema Settings",

    // GlobalHealthBox
    systemNormal: "System Normal",
    systemNormalSub: "Secure connection · No policy violation detected",
    legalRole: "Legal Role",
    dataController: "Data Controller",
    guardStatus: "Guard Status",
    maskingOn: "Masking ON",
    maskingOff: "Masking OFF",
    throttleOn: "Throttle ON",
    throttleOff: "Throttle OFF",
    baselineProven: "BASELINE PROVEN — Regular logs recorded continuously as safety proof",

    // Legal Risk States (Specification 4)
    state1aTitle: "Edge Proxy: Connected",
    state1aSub: "ACTIVE & SECURE",
    state1aDetail: "CONNECTION SECURE — All front-end gateways operating normally",
    state1bTitle: "Edge Proxy: Connected",
    state1bSub: "ACTIVE & THROTTLING",
    state1bDetail: "SAFE MITIGATION ACTIVE — Safe traffic connection & WORM log recorded",
    state2Title: "Edge Proxy: Connected",
    state2Sub: "ACTIVE & DEEP AUDIT",
    state2Detail: "AUDIT TRAIL ACTIVE — Detailed database access logging enabled",
    state3Title: "Edge Proxy: Connected",
    state3Sub: "ACTIVE & VULNERABLE",
    state3Detail: "UNMITIGATED EXPOSURE — Front-end gateways operating without recommended guards",

    // KPI Cards
    kpiTraffic: "Total Inspected Traffic",
    kpiTrafficSub: "requests scanned in 30 days · +9.2% MoM",
    kpiMasked: "Auto-Masked Count",
    kpiMaskedSub: "PII keys successfully masked by system · 99.97%",
    kpiPending: "Pending Exemption Cases",
    kpiPendingSub: "Low-risk exemption reports (Form 5) pending approval",

    // RiskTelemetryChart
    chartTitle: "24-Hour Risk Trend",
    chartSub: "Risk Telemetry Time-Series — Cumulative score from Pipeline A (Deterministic Scorer)",
    chartTime: "Time: {label}",
    chartScore: "{value} Points",

    // NationalAlertFeed
    alertTitle: "PDPC Urgent Broadcast",
    alertFeedTitle: "National Threat Intelligence Feed",
    noAlerts: "No active threat warnings from PDPC at this time.",
    alertDetail: "Distributed Botnet campaign attack detected using the same payload to exploit multiple organizations nationwide. PDPC recommends temporarily enabling Traffic Throttling.",
    guardEnabledMsg: "Recommended guard is enabled",
    enableGuardBtn: "Enable recommended guard",

    // ExemptionQueue
    queueTitle: "Exemption Assessment",
    queueSub: "Risk assessment queue under PDPA rules for data breach notification exemptions",
    bulkApprove: "Record Exemption (Bulk)",
    selectedItems: "Selected {count} cases",
    queueCleared: "Exemption Queue Cleared",
    queueClearedSub: "All cases recorded as Form 5 compliance logs in WORM storage",
    tableCaseId: "Case ID",
    tableDetectedAt: "Detected At",
    tableFields: "PII Categories",
    tableMitigation: "Security Measures",
    tableSelectAll: "Select all items",
    tableSelectCase: "Select case",
    
    // Exemption Detail Modal
    detailTitle: "Compliance Assessment Detail",
    detailSub: "Explainable Glass-Box UI — Confirm appropriate security measures (Sec 37(1))",
    rawSample: "Auto-Masked Data Sample",
    scoreBreakdown: "Breach Risk Evaluation Factors",
    evaluationResult: "Legal Assessment",
    evaluationValue: "Exempted (Form 5) — Safe mitigation confirmed",
    approveSingleBtn: "Approve Exemption",
    rejectSingleBtn: "Reject & Escalate",
    deepAnalyseLink: "Perform Forensic Investigation",

    // Bulk Approve Modal
    bulkConfirmTitle: "Confirm Bulk Exemption — {count} Items",
    bulkConfirmSub: "Friction Gate — Require legal reasoning before recording to WORM Log",
    legalReasonLabel: "Legal Reasoning (Required)",
    legalReasonPlaceholder: "— Choose pre-defined reason —",
    additionalNoteLabel: "Additional Notes (Required)",
    additionalNotePlaceholder: "Enter brief reasoning for legal records...",
    bulkConfirmCheckbox: "I verified that all items meet the exemption criteria under PDPC Announcement Clause 9 Paragraph 2 and accept that this record is stored permanently as read-only.",
    bulkConfirmSubmit: "Confirm Permanent Bulk Close",

    // PolicyCenter
    policyTitle: "Safety Gate Policy Center",
    policySub: "Client-Controlled Policy Center — Optional Opt-in Guard",
    policyFooter: "Every policy state change is logged in the Zero-Trust Governance Log to establish the Data Controller's intent.",
    switchLabel: "Switch",
    
    // Policy Guards
    guardMaskingTitle: "Data Masking System",
    guardMaskingSub: "Data Masking",
    guardMaskingWarning: "Enabling Data Masking will instantly mask outbound PII fields with placeholders (XXX). Some downstream applications that require real values might experience temporary issues. Do you confirm enabling this guard?",
    
    // Traffic Throttling
    guardThrottleTitle: "Traffic Throttling System",
    guardThrottleSub: "Traffic Throttling",
    guardThrottleWarning: "Enabling Traffic Throttling might temporarily slow down page loads for regular users. Do you confirm enabling this guard?",

    // Safety Gate Dialog
    safetyGateTitle: "Confirm Risks Before Enabling Guard",
    safetyGateSub: "The Safety Gate — Intentional UX Friction",
    safetyGateCheckbox: "I understand the impact on our organization's IT systems and accept this agreement to enable the guard.",
    safetyGateConfirmBtn: "I accept the risk and confirm enabling",

    /* ── Crisis Management Room ── */
    crisisPageTitle: "Crisis Management Room",
    crisisPageSub: "Active Incident Room — Confirmed breach under Section 37(4) legal timeframe",
    crisisCaseId: "Case ID",
    crisisDetectedAt: "Detected at",
    crisisSectionContext: "Problems & Context",
    crisisSectionDrivers: "Reasons & Drivers",
    crisisSectionActions: "Actions & Causes",

    // 1.1 Countdown
    countdownTitle: "72-Hour Legal Countdown",
    countdownLabel: "Time remaining to report this incident to PDPC as required by law",
    countdownLegalBasis: "Section 37(4) · Personal Data Protection Act",
    countdownGraceTitle: "Awaiting PDPC review of emergency extension (+24h)",
    countdownGraceSub: "Grace period request submitted — countdown paused pending decision",

    // 1.2 Blast Radius
    blastTitle: "Incident Blast Radius",
    blastSub: "Metadata-only impact summary — no raw PII displayed",
    blastAffectedRows: "Affected records",
    blastRowsUnit: "rows",
    blastCompromisedFields: "Compromised high-risk PII fields",
    blastClickHint: "Click a tag to inspect the affected schema",

    // PII labels
    piiCitizenId: "National ID",
    piiHealthAllergy: "Health data: allergy records",
    piiFullName: "Full name",
    sensitivitySection26: "Sensitive under Section 26 (×5.0)",
    sensitivityGeneralId: "National ID (×2.0)",
    sensitivityGeneral: "General personal data (×1.0)",

    // Flow A — schema modal
    schemaModalTitle: "Affected schema detail",
    schemaModalSub: "Read-only backend schema — pinpointing the leaked field",
    schemaColumn: "Column",
    schemaTable: "Table",
    schemaDataType: "Data type",
    schemaSensitivity: "Legal sensitivity weight",
    schemaAffected: "Affected rows",
    schemaLeakStatus: "Leak status",
    schemaLeaked: "Confirmed leaked",
    schemaAuditLink: "Open Immutable Auditing Log for this time window",

    // 2.1 Timeline
    timelineTitle: "Attack Timeline Log",
    timelineSub: "Chronological event sequence recorded at the Edge Proxy",
    timeline1: "Abnormal traffic pattern detected at Edge Proxy",
    timeline2: "Masking failed — auth token expired mid-request",
    timeline3: "Data exfiltration confirmed (15,200 rows)",
    timeline4: "Edge Proxy switched to Fail-Secure local rules",

    // 2.2 Attack vector
    vectorTitle: "AI Attack Vector Analysis",
    vectorSub: "Pipeline B (Probabilistic) — Behavioral Campaign Clustering under hashed IP",
    nodeAttacker: "Unknown source (hashed IP)",
    nodeGateway: "Your org — API Gateway",
    nodeDatabase: "Customer DB (BigQuery)",
    edgeExploit: "Exploit",
    edgeExfil: "Exfiltration",
    vectorAiSummary:
      "Attack fingerprint (Metadata Pattern) matches the hacker group that PDPC broadcast a warning about two days ago.",
    vectorAiLabel: "AI Advisory (Internal Use Only)",
    btnRequestGrace: "Request Extension (Grace Period)",
    btnDraftReport: "Draft Official Report (Form DPO)",
    btnFileNotice: "Notify Affected Individuals (Form 2)",
    noticeAlreadySent: "Notice already sent to affected individuals",
    blastHeaderTitle: "Incident Scope & Impact Summary",

    // 3.1 Grace Period
    graceTitle: "Emergency Grace Period Request",
    graceSub: "CEO Emergency Grace Period Activator — request a reporting extension from PDPC.",
    graceReasonLabel: "Necessity reason (Required)",
    graceReasonPlaceholder: "— Select necessity reason —",
    graceReason1: "Core network was shut down for security — logs cannot be retrieved in time",
    graceReason2: "Ransomware encrypted the evidence store — forensic recovery in progress",
    graceReason3: "Third-party processor has not yet returned the required access logs",
    graceReason4: "Scope of affected data subjects still under verification by the IT team",
    graceCheckbox:
      "I certify that the stated reason is accurate and understand this request is recorded in the WORM Log as evidence of the Data Controller's intent.",
    graceSubmitBtn: "Approve & send emergency request",
    graceSentTitle: "Emergency request submitted",
    graceSentBody:
      "Your grace period request has been sent to PDPC. The countdown is paused pending their decision. Continue system recovery in the meantime.",
    graceSentClose: "Close",
    graceAlreadySent: "Request submitted — awaiting PDPC decision",

    // 3.2 Report draft
    reportTitle: "Automated Regulatory Report Draft",
    reportSub: "AI-Generated Initial Assessment (Internal Use Only) — not legal advice",
    reportDisclaimer:
      "This draft is a data-extraction aid only. The DPO must review, edit the remediation fields, and confirm each step before submitting to PDPC. One-click send is disabled by design.",
    reportFieldOrg: "Organization",
    reportFieldCategory: "Affected data category",
    reportFieldVolume: "Estimated record volume",
    reportFieldAwareness: "Time of awareness",
    reportCategoryValue: "Sensitive (Section 26) + National ID",
    reportDownloadBtn: "Download draft report (PDF)",
    reportReviewBtn: "Review & prepare submission",
    reportStatusDraft: "DRAFT",

    // Nav back
    crisisBackToOverview: "Back to Overview",

    /* ── Incident Triage Queue (list view) ── */
    incidentListTitle: "Active Incident Queue",
    incidentListSub:
      "All incidents under the 72-hour legal clock — sorted by time remaining, closest to deadline first",
    incidentListEmpty: "No active incidents",
    incidentListEmptySub: "All cases have been resolved and archived to the WORM Log",
    incidentColCase: "Case",
    incidentColSeverity: "Legal state",
    incidentColImpact: "Impact",
    incidentColDetected: "Detected at",
    incidentColRemaining: "Time remaining",
    incidentColStatus: "Progress",
    incidentOpenAction: "Open case",
    incidentUrgentBanner: "{count} case(s) require action within the legal timeframe",
    incidentSortNote: "Triage order — most urgent first",

    // severity labels
    severityHighRisk: "High Risk",
    severityRiskPresent: "Risk Present",
    severityHighRiskNote: "Must notify PDPC + data subjects",
    severityRiskPresentNote: "Must notify PDPC only",

    // status labels
    statusAwaitingReview: "Awaiting DPO review",
    statusInProgress: "DPO Reviewing — Internal Investigation",
    statusGraceRequested: "Grace period requested",

    // incident titles
    incidentTitle1: "Mass exfiltration of health & identity records",
    incidentTitle2: "Payment card data exposed via billing endpoint",
    incidentTitle3: "Subscriber email list exported by misconfigured script",

    // extra PII labels
    piiCreditCard: "Credit card number",
    piiEmail: "Email address",
    sensitivityFinancial: "Financial data (×3.0)",

    // extra nodes
    nodeBillingDb: "Billing DB (PostgreSQL)",
    nodeMarketingDb: "Marketing DB (BigQuery)",
    nodeInternalScript: "Internal batch script (misconfigured)",
    edgeMisconfig: "Misconfiguration",
    edgeExport: "Bulk export",

    // extra timelines
    timeline2a: "Unusual card-data read volume on billing endpoint",
    timeline2b: "PAN values returned unmasked (890 records)",
    timeline2c: "Endpoint rate-limited and tokens rotated",
    timeline3a: "Scheduled export job ran with overly broad scope",
    timeline3b: "Subscriber emails written to an external bucket",
    timeline3c: "Bucket access revoked, export job disabled",

    crisisBackToList: "Back to incident queue",
    aiSummary1: "Attack fingerprint (Metadata Pattern) matches the hacker group that PDPC broadcast a warning about two days ago.",
    aiSummary2: "Request pattern is consistent with automated card-testing behaviour. No cross-tenant match found in the national campaign index.",
    aiSummary3: "No external attacker detected. Root cause is an internally-triggered batch job whose export scope was configured too broadly.",
    incidentNotFound: "Incident not found",
    incidentNotFoundSub: "This case ID does not exist or has already been archived.",

    /* ── Immutable audit log (WORM) ── */
    auditActorSystem: "System (Edge Proxy)",
    auditActionDetected: "Anomalous traffic detected at Edge Proxy",
    auditActionExfiltration: "Data exfiltration confirmed",

    /* ── Digital Evidence Log page ── */
    evidencePageTitle: "Digital Evidence Log",
    evidencePageSub: "Immutable Auditing Log (WORM) — write-once records proving duty of care under Sections 75–76",
    evidenceColTime: "Timestamp",
    evidenceColActor: "Actor",
    evidenceColAction: "Action",
    evidenceColRationale: "Legal rationale",
    evidenceColCategory: "Category",
    evidenceColCase: "Case",
    evidenceEmpty: "No audit records yet",
    evidenceEmptySub: "Actions taken across the portal are sealed here automatically.",
    evidenceExport: "Export signed audit trail",
    evidenceSealed: "Sealed — read-only",
    evidenceEntryCount: "{count} sealed record(s)",
    evidenceFilterAll: "All records",
    evidenceFilteredByCase: "Filtered to case {case}",
    evidenceClearFilter: "Show all records",
    evidenceCatDetection: "Detection",
    evidenceCatEnforcement: "Enforcement",
    evidenceCatDpoAction: "DPO action",
    evidenceCatPolicy: "Policy",
    evidenceCatReport: "Report",
    evidenceNoRationale: "—",

    /* ── Threat Analytics Panel ── */
    threatPageTitle: "Threat Analytics Panel",
    threatPageSub: "Pipeline B (Probabilistic) — Isolation Forest campaign clustering over pseudonymised metadata",
    threatActiveCampaign: "Linked national campaign",
    threatCampaignId: "Campaign ID",
    threatCampaignName: "Distributed Botnet — cross-tenant credential probing",
    threatMatchConfidence: "Match confidence",
    threatPeerOrgs: "Peer organisations affected",
    threatPeerOrgsValue: "6 organisations (sector-anonymised)",
    threatFirstSeen: "First seen nationally",
    threatTelemetryTitle: "Risk telemetry — last 24 hours",
    threatTelemetrySub: "Deterministic score from Pipeline A, plotted against detection time",
    threatIoaTitle: "Indicators of attack (IoA)",
    threatIoaSub: "Behavioural fingerprints shared across tenants — no raw PII, hashed identifiers only",
    threatIoaEndpoint: "Repeated hits on a single export endpoint",
    threatIoaVelocity: "Request velocity 312/min — far above tenant baseline",
    threatIoaPayload: "Identical payload signature seen at other tenants",
    threatIoaHours: "Activity concentrated outside business hours",
    threatNoIncident: "No active campaign linked to your organisation",
    threatNoIncidentSub: "Pipeline B continues monitoring anonymised metadata for cross-tenant patterns.",
    threatViewIncident: "Open linked incident",
    threatPrivacyNote: "Cross-tenant analysis runs on HMAC-SHA256 pseudonymised identifiers. Peer organisations are shown as industry sectors only.",
    auditActorDpo: "DPO (Nattakarn)",
    auditActionGraceRequested: "Emergency Grace Period Requested",
    auditActionMaskingOn: "Data Masking Enabled",
    auditActionMaskingOff: "Data Masking Disabled",
    auditActionThrottleOn: "Traffic Throttling Enabled",
    auditActionThrottleOff: "Traffic Throttling Disabled",
    auditActionExemptionApproved: "Form 5 Exemption Approved & Recorded",
    auditActionCaseResolved: "Crisis Incident Resolved & Closed",
    auditActionExemptionRejected: "Exemption rejected — escalated to a reportable incident",
    auditActionReportFiled: "PDPC incident report filed",
    auditActionNoticeIssued: "Data subject remediation notice issued",
    incidentEscalatedTitle: "Escalated from exemption review — DPO rejected the exemption",
    piiEscalatedField: "Escalated PII field",
    timelineEscalated: "DPO rejected the exemption — case escalated for reporting",
    aiSummaryEscalated: "Escalated by DPO judgement rather than automated scoring. Pipeline B found no cross-tenant campaign match for this case.",
    actionRequiredTitle: "Action required — reportable incidents open",
    actionRequiredOne: "1 case must be reported to PDPC within the legal timeframe",
    actionRequiredMany: "{count} cases must be reported to PDPC within the legal timeframe",
    actionRequiredOpen: "Open case",
    actionRequiredRemaining: "time left",
    actionRequiredNotifyBoth: "Notify PDPC + data subjects",
    actionRequiredNotifyPdpc: "Notify PDPC",
    actionRequiredGraceHeld: "Extension requested — awaiting PDPC",
    escalatedViewIncident: "View escalated incident",
    caseNewBadge: "NEW",
    caseNewAria: "New case — not yet opened by the DPO",
    caseNewCount: "{count} new",
    auditActionAwarenessConfirmed: "Time of awareness recorded — 72-hour clock started",
    auditActionExemptionDetected: "Low-risk anomaly detected — exemption assessment opened",
    auditRationaleMitigated: "Mitigation factor neutralised the residual risk (Clause 9 paragraph 2)",
    evidenceCatExemption: "Exemption",
    evidenceViewForCase: "View evidence log for this case",
    evidenceMitigationFactor: "Mitigation factor M={value}",
    countdownNotStarted: "Legal clock not started",
    countdownNotStartedSub: "The 72-hour window runs from the time the DPO becomes aware, not from system detection. Review the incident, then record the time of awareness to start it.",
    countdownConfirmBtn: "Record time of awareness & start clock",
    countdownAwaitingShort: "Not started",
    countdownDetectedAtLabel: "System detected at",
    countdownConfirmText: "Confirm",
    countdownConfirmTextSub: "Start clock",
  },
  th: {
    // Topbar
    appTitle: "ทันการณ์",
    companyName: "บริษัท สยามคอมเมิร์ซ จำกัด",
    gatewayType: "SME-0001 · Centralized Shared Gateway",
    lastUpdated: "อัปเดตล่าสุด: เมื่อ 1 นาทีที่แล้ว",
    notification: "การแจ้งเตือน",
    logout: "ออกจากระบบ (Log out)",
    openNav: "เปิดเมนูนำทาง",
    closeSidebar: "ปิดแถบข้าง",
    openSidebar: "เปิดแถบข้าง",
    userName: "ณัฐกานต์ (DPO)",
    notifTitle: "ศูนย์การแจ้งเตือน",
    notifSectionBroadcast: "สคส. Urgent Broadcast",
    notifSectionGeneral: "รายการแจ้งเตือนของระบบ",
    notifMsg1: "ระบบทำการบันทึก Baseline Log ในหน่วยความจำถาวรสำเร็จ",
    notifMsg2: "ตรวจสอบสิทธิ์การเข้าถึงข้อมูลของ DPO สำเร็จแบบ 2FA",
    notifMsg3: "สำรองข้อมูลระบบอัตโนมัติประจำวันเสร็จสิ้น: ความจุคงเหลือ 98.4%",

    // Sidebar Items
    menuOverview: "ภาพรวมระบบ",
    menuOverviewSub: "Operational Command Center",
    menuIncident: "ห้องจัดการเหตุวิกฤต",
    menuIncidentSub: "Active Incident Room",
    menuAudit: "บันทึกพยานหลักฐานดิจิทัล",
    menuAuditSub: "Immutable Auditing Log",
    menuThreat: "วิเคราะห์ภาพรวมภัยคุกคาม",
    menuThreatSub: "Threat Analytics Panel",
    menuSettings: "ตั้งค่าและข้อมูล",
    menuSettingsSub: "Policy & Schema Settings",

    // GlobalHealthBox
    systemNormal: "System Normal",
    systemNormalSub: "เชื่อมต่อปลอดภัย · ไม่มีพฤติกรรมผิดเกณฑ์",
    legalRole: "บทบาทตามกฎหมาย (Legal Role)",
    dataController: "Data Controller",
    guardStatus: "สถานะเกราะป้องกัน",
    maskingOn: "Masking ON",
    maskingOff: "Masking OFF",
    throttleOn: "Throttle ON",
    throttleOff: "Throttle OFF",
    baselineProven: "BASELINE PROVEN — ระบบบันทึก Log ปกติเป็นหลักฐานความปกติ",

    // Legal Risk States (Specification 4)
    state1aTitle: "Edge Proxy: เชื่อมต่อสำเร็จ",
    state1aSub: "ทำงานปกติ & ปลอดภัย",
    state1aDetail: "CONNECTION SECURE — ช่องทางเชื่อมต่อด่านหน้าทั้งหมดทำงานปกติและปลอดภัย",
    state1bTitle: "Edge Proxy: เชื่อมต่อสำเร็จ",
    state1bSub: "ทำงานปกติ & จำกัดความเร็ว",
    state1bDetail: "SAFE MITIGATION ACTIVE — จำกัดความเร็วเพื่อป้องกัน และลงบันทึกหลักฐานการเข้าถึงแล้ว",
    state2Title: "Edge Proxy: เชื่อมต่อสำเร็จ",
    state2Sub: "ทำงานปกติ & เก็บบันทึกละเอียด",
    state2Detail: "AUDIT TRAIL ACTIVE — ตรวจพบพฤติกรรมผิดปกติ ระบบเปิดการบันทึกประวัติการเชื่อมต่อระดับลึก",
    state3Title: "Edge Proxy: เชื่อมต่อสำเร็จ",
    state3Sub: "ทำงานปกติ & มีความเสี่ยง",
    state3Detail: "UNMITIGATED EXPOSURE — ช่องทางเชื่อมต่อด่านหน้าทำงานโดยไม่มีเกราะป้องกันที่แนะนำ",

    // KPI Cards
    kpiTraffic: "Total Inspected Traffic",
    kpiTrafficSub: "requests สแกนแล้วใน 30 วัน · +9.2% จากเดือนก่อน",
    kpiMasked: "Auto-Masked Count",
    kpiMaskedSub: "คีย์ข้อมูลส่วนบุคคลที่ระบบช่วยบังตาสำเร็จ · 99.97%",
    kpiPending: "Pending Exemption Cases",
    kpiPendingSub: "รายงานคำร้องขอยกเว้น (Form 5) ที่รอกดอนุมัติ",

    // RiskTelemetryChart
    chartTitle: "แนวโน้มความเสี่ยง 24 ชั่วโมง",
    chartSub: "Risk Telemetry Time-Series — คะแนนรวมจาก Pipeline A (Deterministic Scorer)",
    chartTime: "เวลา {label} น.",
    chartScore: "{value} คะแนน",

    // NationalAlertFeed
    alertTitle: "แจ้งเตือนด่วนจาก สคส.",
    alertFeedTitle: "National Threat Intelligence Feed",
    noAlerts: "ไม่มีสัญญาณเตือนภัยจาก สคส. ในขณะนี้",
    alertDetail: "ตรวจพบแคมเปญโจมตีแบบ Distributed Botnet ใช้ Payload เดียวกันเจาะระบบหลายองค์กรพร้อมกันทั่วประเทศ (Cross-Tenant Campaign) — สคส. แนะนำให้เปิดเกราะจำกัดความเร็วทราฟฟิก (Traffic Throttling) ชั่วคราว",
    guardEnabledMsg: "เกราะแนะนำเปิดใช้งานแล้ว",
    enableGuardBtn: "กดเปิดเกราะแนะนำทันที",

    // ExemptionQueue
    queueTitle: "การประเมินข้อยกเว้น",
    queueSub: "คิวประเมินความเสี่ยงเพื่อพิจารณาข้อยกเว้นการแจ้งเหตุละเมิดตามประกาศ สคส. ข้อ 9 วรรคสอง",
    bulkApprove: "บันทึกข้อยกเว้นแบบกลุ่ม",
    selectedItems: "เลือกอยู่ {count} เคส",
    queueCleared: "ประเมินข้อยกเว้นครบถ้วนแล้ว",
    queueClearedSub: "ข้อมูลทุกเคสได้รับการบันทึกเป็นเอกสารหลักฐาน Form 5 ลง WORM Log ถาวร",
    tableCaseId: "Case ID",
    tableDetectedAt: "เวลาที่พบเหตุ",
    tableFields: "ประเภทข้อมูลส่วนบุคคล (PII)",
    tableMitigation: "มาตรการความปลอดภัย",
    tableSelectAll: "เลือกทุกรายการ",
    tableSelectCase: "เลือกเคส",

    // Exemption Detail Modal
    detailTitle: "รายละเอียดการประเมินทางกฎหมาย",
    detailSub: "Explainable Glass-Box UI — ตรวจสอบเพื่อรับรองมาตรการความปลอดภัยตามมาตรา 37(1)",
    rawSample: "ตัวอย่างข้อมูลส่วนบุคคล (พรางตาอัตโนมัติ)",
    scoreBreakdown: "ปัจจัยประเมินความเสี่ยงทางกฎหมาย",
    evaluationResult: "ผลวินิจฉัยทางกฎหมาย",
    evaluationValue: "เข้าเงื่อนไขข้อยกเว้น (ยื่น Form 5) — มีมาตรการคุ้มครองที่เหมาะสม",
    approveSingleBtn: "อนุมัติข้อยกเว้น",
    rejectSingleBtn: "ปฏิเสธ & แจ้ง สคส.",
    deepAnalyseLink: "ดำเนินการตรวจสอบนิติวิทยาศาสตร์ดิจิทัล",

    // Bulk Approve Modal
    bulkConfirmTitle: "ยืนยันปิดคดีแบบกลุ่ม — {count} รายการ",
    bulkConfirmSub: "Friction Gate — บังคับระบุเหตุผลทางกฎหมายก่อนยืนยัน เพื่อบันทึกลง WORM Log",
    legalReasonLabel: "เหตุผลเชิงกฎหมาย (Required)",
    legalReasonPlaceholder: "— เลือกเหตุผลสำเร็จรูป —",
    additionalNoteLabel: "เหตุผลประกอบเพิ่มเติม (Required)",
    additionalNotePlaceholder: "พิมพ์เหตุผลประกอบสั้นๆ เพื่อเป็นหลักฐานทางกฎหมาย…",
    bulkConfirmCheckbox: "ฉันได้ตรวจสอบแล้วว่าทุกรายการเข้าเงื่อนไขยกเว้นตามประกาศ สคส. ข้อ 9 วรรคสอง และรับทราบว่าบันทึกนี้จะถูกจัดเก็บเป็นหลักฐานถาวรแบบแก้ไขไม่ได้ (Read-only)",
    bulkConfirmSubmit: "ยืนยันปิดคดีแบบกลุ่มถาวร",

    // PolicyCenter
    policyTitle: "ศูนย์ควบคุมเกราะป้องกันภัย",
    policySub: "Client-Controlled Policy Center — Optional Opt-in Guard (การตัดสินใจสุดท้ายเป็นขององค์กรเสมอ)",
    policyFooter: "ทุกการเปลี่ยนสถานะเกราะป้องกันจะถูกบันทึกลง Zero-Trust Governance Log เพื่อเป็นหลักฐานแสดงเจตนาของผู้ควบคุมข้อมูล (Data Controller)",
    switchLabel: "สวิตช์",

    // Policy Guards
    guardMaskingTitle: "ระบบบังตาข้อมูล",
    guardMaskingSub: "Data Masking",
    guardMaskingWarning: "การเปิดระบบบังตาข้อมูล จะทำให้ฟิลด์ PII ที่ไหลออกจากระบบถูกแทนที่ด้วยอักขระพราง (XXX) ทันที แอปพลิเคชันปลายทางบางตัวที่ต้องใช้ข้อมูลจริงอาจทำงานผิดพลาดชั่วคราว คุณยืนยันที่จะเปิดเกราะป้องกันนี้หรือไม่",
    
    // Traffic Throttling
    guardThrottleTitle: "จำกัดความเร็วทราฟฟิก",
    guardThrottleSub: "Traffic Throttling",
    guardThrottleWarning: "การเปิดระบบจำกัดความเร็วทราฟฟิก อาจทำให้ผู้ใช้งานทั่วไปเข้าใช้งานหน้าเว็บหลักของบริษัทได้ช้าลงชั่วคราว คุณยืนยันที่จะเปิดเกราะป้องกันนี้หรือไม่",

    // Safety Gate Dialog
    safetyGateTitle: "ยืนยันความเสี่ยงก่อนเปิดเกราะป้องกัน",
    safetyGateSub: "The Safety Gate — Intentional UX Friction",
    safetyGateCheckbox: "ฉันเข้าใจผลกระทบต่อระบบไอทีขององค์กร และยอมรับข้อตกลงการเปิดใช้งานเกราะป้องกันนี้",
    safetyGateConfirmBtn: "ฉันยอมรับความเสี่ยงและยืนยันเปิดใช้งาน",

    /* ── ห้องจัดการเหตุวิกฤต ── */
    crisisPageTitle: "ห้องจัดการเหตุวิกฤต",
    crisisPageSub: "Active Incident Room — ยืนยันเหตุละเมิดแล้ว อยู่ในกรอบเวลากฎหมาย ม.37(4)",
    crisisCaseId: "เลขที่คดี",
    crisisDetectedAt: "ตรวจพบเมื่อ",
    crisisSectionContext: "ผลกระทบและบริบท",
    crisisSectionDrivers: "สาเหตุและที่มา",
    crisisSectionActions: "การดำเนินการ",

    // 1.1 นาฬิกานับถอยหลัง
    countdownTitle: "นาฬิกานับถอยหลังกรอบเวลากฎหมาย 72 ชั่วโมง",
    countdownLabel: "เวลาที่เหลือในการรายงานเหตุต่อ สคส. ตามกฎหมาย",
    countdownLegalBasis: "มาตรา 37(4) · พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล",
    countdownGraceTitle: "อยู่ระหว่างรอ สคส. พิจารณาขยายเวลาฉุกเฉิน (+24 ชม.)",
    countdownGraceSub: "ส่งคำร้องขอสิทธิ์ฉุกเฉินแล้ว — หยุดนับถอยหลังชั่วคราวระหว่างรอผลพิจารณา",

    // 1.2 ขอบเขตความเสียหาย
    blastTitle: "กล่องสรุปผลกระทบและจุดรั่วไหล",
    blastSub: "Incident Blast Radius — แสดงเฉพาะ Metadata ไม่มีข้อมูล PII ดิบ",
    blastAffectedRows: "ปริมาณแถวข้อมูลที่ได้รับผลกระทบ",
    blastRowsUnit: "แถว",
    blastCompromisedFields: "รายการฟิลด์ข้อมูล PII ความเสี่ยงสูงที่ถูกเจาะ",
    blastClickHint: "คลิกที่ป้ายเพื่อดูโครงสร้าง Schema ที่ได้รับผลกระทบ",

    // ป้าย PII
    piiCitizenId: "บัตรประชาชน",
    piiHealthAllergy: "ข้อมูลสุขภาพ: กลุ่มอาการแพ้ยา",
    piiFullName: "ชื่อ-นามสกุล",
    sensitivitySection26: "ข้อมูลอ่อนไหวตาม ม.26 (×5.0)",
    sensitivityGeneralId: "เลขบัตรประชาชน (×2.0)",
    sensitivityGeneral: "ข้อมูลส่วนบุคคลทั่วไป (×1.0)",

    // Flow A — Schema modal
    schemaModalTitle: "รายละเอียด Schema ที่ได้รับผลกระทบ",
    schemaModalSub: "โครงสร้างฐานข้อมูลแบบ Read-only — ชี้เป้าฟิลด์ที่เกิดการรั่วไหลจริง",
    schemaColumn: "ชื่อฟิลด์ (Column)",
    schemaTable: "ตาราง (Table)",
    schemaDataType: "ชนิดข้อมูล",
    schemaSensitivity: "ค่าน้ำหนักความอ่อนไหวทางกฎหมาย",
    schemaAffected: "จำนวนแถวที่กระทบ",
    schemaLeakStatus: "สถานะการรั่วไหล",
    schemaLeaked: "ยืนยันการรั่วไหลแล้ว",
    schemaAuditLink: "เปิดดู Immutable Auditing Log ของช่วงเวลานี้",

    // 2.1 ไทม์ไลน์
    timelineTitle: "เส้นเวลาความสืบเนื่องของเหตุการณ์",
    timelineSub: "Attack Timeline Log — ลำดับเหตุการณ์จริงที่บันทึกจากด่านหน้า",
    timeline1: "ตรวจพบทราฟฟิกผิดปกติที่ Edge Proxy",
    timeline2: "ระบบ Masking ล้มเหลว เนื่องจาก Token หมดอายุกลางคัน",
    timeline3: "ยืนยันข้อมูลรั่วไหล (15,200 แถว)",
    timeline4: "Edge Proxy สลับเข้าโหมด Fail-Secure ใช้ Local Rules",

    // 2.2 กราฟการโจมตี
    vectorTitle: "ศูนย์วิเคราะห์พฤติกรรมภัยคุกคามโดย AI",
    vectorSub: "Pipeline B (Probabilistic) — Behavioral Campaign Clustering ภายใต้การแฮช IP",
    nodeAttacker: "ต้นทางไม่ทราบชื่อ (Hashed IP)",
    nodeGateway: "องค์กรของคุณ — API Gateway",
    nodeDatabase: "ฐานข้อมูลลูกค้า (BigQuery)",
    edgeExploit: "เจาะระบบ",
    edgeExfil: "ดึงข้อมูลออก",
    vectorAiSummary:
      "ลายนิ้วมือการโจมตี (Metadata Pattern) ตรงกับกลุ่มแฮกเกอร์ที่ สคส. เพิ่ง Broadcast เตือนภัยเมื่อวานซืน",
    vectorAiLabel: "AI Advisory (Internal Use Only)",
    btnRequestGrace: "ยื่นคำร้องขอขยายเวลารายงาน (Grace Period)",
    btnDraftReport: "จัดทำร่างรายงานยื่น สคส. (Draft Report)",
    btnFileNotice: "แจ้งเตือนประชาชนที่ได้รับผลกระทบ (Form 2)",
    noticeAlreadySent: "แจ้งเตือนประชาชนที่ได้รับผลกระทบแล้ว",
    blastHeaderTitle: "ขอบเขตผลกระทบและสรุปข้อมูลคดี",

    // 3.1 Grace Period
    graceTitle: "แผงควบคุมสิทธิ์ฉุกเฉิน",
    graceSub: "CEO Emergency Grace Period Activator — ส่งคำร้องขอขยายเวลาชี้แจงไปยัง สคส.",
    graceReasonLabel: "เหตุผลความจำเป็น (Required)",
    graceReasonPlaceholder: "— เลือกเหตุผลความจำเป็น —",
    graceReason1: "ระบบเน็ตเวิร์กหลักถูกสั่งชัตดาวน์เพื่อความปลอดภัย ไม่สามารถดึง Log ได้ทัน",
    graceReason2: "Ransomware เข้ารหัสคลังหลักฐาน อยู่ระหว่างกู้คืนเชิงนิติวิทยาศาสตร์",
    graceReason3: "ผู้ประมวลผลข้อมูลภายนอกยังไม่ส่ง Access Log ที่จำเป็นกลับมา",
    graceReason4: "ขอบเขตเจ้าของข้อมูลที่ได้รับผลกระทบยังอยู่ระหว่างการตรวจสอบโดยทีมไอที",
    graceCheckbox:
      "ฉันขอรับรองว่าเหตุผลข้างต้นเป็นความจริง และรับทราบว่าคำร้องนี้จะถูกบันทึกลง WORM Log เป็นหลักฐานแสดงเจตนาของผู้ควบคุมข้อมูล",
    graceSubmitBtn: "อนุมัติส่งคำร้องขอสิทธิ์ฉุกเฉิน",
    graceSentTitle: "ส่งคำร้องขอสิทธิ์ฉุกเฉินสำเร็จ",
    graceSentBody:
      "ระบบส่งคำร้องขอขยายเวลาไปยัง สคส. เรียบร้อยแล้ว นาฬิกานับถอยหลังหยุดชั่วคราวระหว่างรอผลพิจารณา ทีมงานสามารถกู้ระบบต่อได้อย่างมีสมาธิ",
    graceSentClose: "ปิดหน้าต่าง",
    graceAlreadySent: "ส่งคำร้องแล้ว — รอผลพิจารณาจาก สคส.",

    // 3.2 ร่างรายงาน
    reportTitle: "ระบบร่างรายงานอุบัติการณ์อัตโนมัติ",
    reportSub: "AI-Generated Initial Assessment (Internal Use Only) — ไม่ถือเป็นความเห็นทางกฎหมาย",
    reportDisclaimer:
      "เอกสารนี้เป็นเพียงตัวช่วยดึงข้อมูลมาเติมในฟอร์ม DPO ต้องเปิดอ่าน ตรวจทาน แก้ไขฟิลด์มาตรการเยียวยาด้วยตนเอง และกดยืนยันทุกขั้นตอนก่อนส่งจริงต่อ สคส. ระบบไม่มีปุ่ม One-Click Send โดยเจตนา",
    reportFieldOrg: "องค์กรผู้รายงาน",
    reportFieldCategory: "ประเภทข้อมูลที่ได้รับผลกระทบ",
    reportFieldVolume: "ปริมาณข้อมูลโดยประมาณ",
    reportFieldAwareness: "เวลาที่ทราบเหตุ (Time of Awareness)",
    reportCategoryValue: "ข้อมูลอ่อนไหว (ม.26) + เลขบัตรประชาชน",
    reportDownloadBtn: "ดาวน์โหลดแบบฟอร์มร่างเอกสาร (PDF)",
    reportReviewBtn: "ตรวจทานและเตรียมยื่นเอกสาร",
    reportStatusDraft: "ฉบับร่าง",

    // ปุ่มย้อนกลับ
    crisisBackToOverview: "กลับไปหน้า ภาพรวมระบบ",

    /* ── คิวเหตุวิกฤต (หน้ารายการ) ── */
    incidentListTitle: "คิวเหตุวิกฤตที่กำลังดำเนินการ",
    incidentListSub:
      "เหตุทั้งหมดที่อยู่ในกรอบเวลากฎหมาย 72 ชั่วโมง — เรียงตามเวลาที่เหลือ เคสที่ใกล้เส้นตายที่สุดอยู่บนสุด",
    incidentListEmpty: "ไม่มีเหตุวิกฤตที่ค้างอยู่",
    incidentListEmptySub: "ทุกเคสถูกปิดและจัดเก็บลง WORM Log เรียบร้อยแล้ว",
    incidentColCase: "เคส",
    incidentColSeverity: "สถานะทางกฎหมาย",
    incidentColImpact: "ผลกระทบ",
    incidentColDetected: "ตรวจพบเมื่อ",
    incidentColRemaining: "เวลาที่เหลือ",
    incidentColStatus: "ความคืบหน้า",
    incidentOpenAction: "เปิดเคส",
    incidentUrgentBanner: "มี {count} เคสที่ต้องดำเนินการภายในกรอบเวลากฎหมาย",
    incidentSortNote: "ลำดับ Triage — เร่งด่วนที่สุดก่อน",

    // ป้ายสถานะทางกฎหมาย
    severityHighRisk: "ความเสี่ยงสูง",
    severityRiskPresent: "มีความเสี่ยง",
    severityHighRiskNote: "ต้องแจ้ง สคส. + เจ้าของข้อมูล",
    severityRiskPresentNote: "ต้องแจ้ง สคส. เท่านั้น",

    // ป้ายความคืบหน้า
    statusAwaitingReview: "รอ DPO ตรวจสอบ",
    statusInProgress: "DPO รับทราบ — กำลังตรวจสอบภายใน",
    statusGraceRequested: "ขอขยายเวลาแล้ว",

    // ชื่อเหตุการณ์
    incidentTitle1: "ข้อมูลสุขภาพและข้อมูลระบุตัวตนถูกดึงออกจำนวนมาก",
    incidentTitle2: "ข้อมูลบัตรชำระเงินรั่วไหลผ่าน endpoint ระบบเรียกเก็บเงิน",
    incidentTitle3: "รายชื่ออีเมลผู้รับข่าวสารถูกส่งออกโดยสคริปต์ที่ตั้งค่าผิด",

    // ป้าย PII เพิ่มเติม
    piiCreditCard: "เลขบัตรเครดิต",
    piiEmail: "ที่อยู่อีเมล",
    sensitivityFinancial: "ข้อมูลทางการเงิน (×3.0)",

    // โหนดเพิ่มเติม
    nodeBillingDb: "ฐานข้อมูลเรียกเก็บเงิน (PostgreSQL)",
    nodeMarketingDb: "ฐานข้อมูลการตลาด (BigQuery)",
    nodeInternalScript: "สคริปต์ Batch ภายใน (ตั้งค่าผิด)",
    edgeMisconfig: "ตั้งค่าผิดพลาด",
    edgeExport: "ส่งออกจำนวนมาก",

    // ไทม์ไลน์เพิ่มเติม
    timeline2a: "พบปริมาณการอ่านข้อมูลบัตรผิดปกติที่ endpoint เรียกเก็บเงิน",
    timeline2b: "ระบบส่งคืนเลขบัตรแบบไม่พรางค่า (890 รายการ)",
    timeline2c: "จำกัดอัตราการเรียก endpoint และหมุนเวียน Token ใหม่",
    timeline3a: "งานส่งออกตามกำหนดเวลาทำงานด้วยขอบเขตที่กว้างเกินไป",
    timeline3b: "อีเมลผู้รับข่าวสารถูกเขียนลง Bucket ภายนอก",
    timeline3c: "เพิกถอนสิทธิ์เข้าถึง Bucket และปิดงานส่งออก",

    crisisBackToList: "กลับไปคิวเหตุวิกฤต",
    aiSummary1: "ลายนิ้วมือการโจมตี (Metadata Pattern) ตรงกับกลุ่มแฮกเกอร์ที่ สคส. เพิ่ง Broadcast เตือนภัยเมื่อวานซืน",
    aiSummary2: "รูปแบบคำขอสอดคล้องกับพฤติกรรมสุ่มทดสอบบัตรแบบอัตโนมัติ ยังไม่พบความเชื่อมโยงข้ามองค์กรในฐานข้อมูลแคมเปญระดับชาติ",
    aiSummary3: "ไม่พบผู้โจมตีจากภายนอก ต้นเหตุคืองาน Batch ภายในองค์กรที่ตั้งขอบเขตการส่งออกข้อมูลกว้างเกินไป",
    incidentNotFound: "ไม่พบเคสนี้",
    incidentNotFoundSub: "เลขที่คดีนี้ไม่มีอยู่ในระบบ หรือถูกจัดเก็บเข้าคลังถาวรแล้ว",

    /* ── บันทึกพยานหลักฐานดิจิทัล (WORM) ── */
    auditActorSystem: "ระบบ (Edge Proxy)",
    auditActionDetected: "ตรวจพบทราฟฟิกผิดปกติที่ Edge Proxy",
    auditActionExfiltration: "ยืนยันข้อมูลรั่วไหล",

    /* ── หน้าบันทึกพยานหลักฐานดิจิทัล ── */
    evidencePageTitle: "บันทึกพยานหลักฐานดิจิทัล",
    evidencePageSub: "Immutable Auditing Log (WORM) — บันทึกที่เขียนแล้วแก้ไม่ได้ ใช้พิสูจน์การปฏิบัติหน้าที่ตาม ม.75–76",
    evidenceColTime: "เวลา",
    evidenceColActor: "ผู้กระทำ",
    evidenceColAction: "การกระทำ",
    evidenceColRationale: "เหตุผลทางกฎหมาย",
    evidenceColCategory: "หมวดหมู่",
    evidenceColCase: "เคส",
    evidenceEmpty: "ยังไม่มีบันทึกหลักฐาน",
    evidenceEmptySub: "ทุกการกระทำในระบบจะถูกผนึกลงที่นี่โดยอัตโนมัติ",
    evidenceExport: "ส่งออกหลักฐานพร้อมลายเซ็นดิจิทัล",
    evidenceSealed: "ผนึกแล้ว — อ่านได้อย่างเดียว",
    evidenceEntryCount: "บันทึกที่ผนึกแล้ว {count} รายการ",
    evidenceFilterAll: "ทุกรายการ",
    evidenceFilteredByCase: "กรองเฉพาะเคส {case}",
    evidenceClearFilter: "แสดงทุกรายการ",
    evidenceCatDetection: "ตรวจจับ",
    evidenceCatEnforcement: "บังคับใช้",
    evidenceCatDpoAction: "DPO ดำเนินการ",
    evidenceCatPolicy: "นโยบาย",
    evidenceCatReport: "รายงาน",
    evidenceNoRationale: "—",

    /* ── แผงวิเคราะห์ภัยคุกคาม ── */
    threatPageTitle: "วิเคราะห์ภาพรวมภัยคุกคาม",
    threatPageSub: "Pipeline B (Probabilistic) — Isolation Forest จัดกลุ่มแคมเปญจาก Metadata ที่ปิดบังตัวตนแล้ว",
    threatActiveCampaign: "แคมเปญระดับชาติที่เชื่อมโยง",
    threatCampaignId: "รหัสแคมเปญ",
    threatCampaignName: "Distributed Botnet — สุ่มเจาะข้อมูลยืนยันตัวตนข้ามองค์กร",
    threatMatchConfidence: "ความเชื่อมั่นในการจับคู่",
    threatPeerOrgs: "องค์กรอื่นที่ได้รับผลกระทบ",
    threatPeerOrgsValue: "6 องค์กร (ระบุเป็นกลุ่มอุตสาหกรรมเท่านั้น)",
    threatFirstSeen: "พบครั้งแรกในระดับประเทศ",
    threatTelemetryTitle: "แนวโน้มความเสี่ยง 24 ชั่วโมงล่าสุด",
    threatTelemetrySub: "คะแนนจาก Pipeline A เทียบกับเวลาที่ตรวจพบ",
    threatIoaTitle: "ร่องรอยพฤติกรรมการโจมตี (IoA)",
    threatIoaSub: "ลายนิ้วมือพฤติกรรมที่พบร่วมกันข้ามองค์กร — ไม่มี PII ดิบ ใช้ค่าที่แฮชแล้วเท่านั้น",
    threatIoaEndpoint: "เรียก endpoint ส่งออกข้อมูลเดิมซ้ำผิดปกติ",
    threatIoaVelocity: "ความเร็วคำขอ 312/นาที สูงกว่าค่าปกติขององค์กรมาก",
    threatIoaPayload: "พบ Payload ลายเซ็นเดียวกันที่องค์กรอื่น",
    threatIoaHours: "กิจกรรมกระจุกตัวนอกเวลาทำการ",
    threatNoIncident: "ไม่มีแคมเปญที่เชื่อมโยงกับองค์กรของคุณ",
    threatNoIncidentSub: "Pipeline B ยังเฝ้าระวัง Metadata แบบไม่ระบุตัวตนเพื่อหารูปแบบข้ามองค์กรอย่างต่อเนื่อง",
    threatViewIncident: "เปิดเคสที่เชื่อมโยง",
    threatPrivacyNote: "การวิเคราะห์ข้ามองค์กรทำบนค่าที่ผ่าน HMAC-SHA256 แล้ว องค์กรอื่นถูกแสดงเป็นกลุ่มอุตสาหกรรมเท่านั้น",
    auditActorDpo: "DPO (ณัฐกานต์)",
    auditActionGraceRequested: "ส่งคำร้องขอสิทธิ์ฉุกเฉินสำเร็จ",
    auditActionMaskingOn: "เปิดใช้งานการพรางข้อมูล (Masking ON)",
    auditActionMaskingOff: "ปิดการพรางข้อมูล (Masking OFF)",
    auditActionThrottleOn: "เปิดการจำกัดความเร็ว (Throttle ON)",
    auditActionThrottleOff: "ปิดการจำกัดความเร็ว (Throttle OFF)",
    auditActionExemptionApproved: "อนุมัติข้อยกเว้นและลงบันทึก Form 5 สำเร็จ",
    auditActionCaseResolved: "ยุติอุบัติการณ์วิกฤตและจัดเก็บคดีสำเร็จ",
    auditActionExemptionRejected: "ตีกลับข้อยกเว้น — ยกระดับเป็นเหตุที่ต้องรายงาน",
    auditActionReportFiled: "ยื่นรายงานอุบัติการณ์ต่อ สคส. แล้ว",
    auditActionNoticeIssued: "ออกจดหมายแจ้งเจ้าของข้อมูลแล้ว",
    incidentEscalatedTitle: "ยกระดับจากการประเมินข้อยกเว้น — DPO ตีกลับคำขอยกเว้น",
    piiEscalatedField: "ฟิลด์ข้อมูลที่ถูกยกระดับ",
    timelineEscalated: "DPO ตีกลับข้อยกเว้น — ยกระดับเคสเพื่อรายงาน",
    aiSummaryEscalated: "ยกระดับด้วยดุลพินิจของ DPO ไม่ใช่จากคะแนนอัตโนมัติ Pipeline B ไม่พบความเชื่อมโยงกับแคมเปญข้ามองค์กรสำหรับเคสนี้",
    actionRequiredTitle: "ต้องดำเนินการ — มีเหตุที่ต้องรายงานค้างอยู่",
    actionRequiredOne: "มี 1 เคสที่ต้องรายงาน สคส. ภายในกรอบเวลากฎหมาย",
    actionRequiredMany: "มี {count} เคสที่ต้องรายงาน สคส. ภายในกรอบเวลากฎหมาย",
    actionRequiredOpen: "เปิดเคส",
    actionRequiredRemaining: "เวลาที่เหลือ",
    actionRequiredNotifyBoth: "ต้องแจ้ง สคส. + เจ้าของข้อมูล",
    actionRequiredNotifyPdpc: "ต้องแจ้ง สคส.",
    actionRequiredGraceHeld: "ขอขยายเวลาแล้ว — รอ สคส. พิจารณา",
    escalatedViewIncident: "ดูเคสที่ถูกยกระดับ",
    caseNewBadge: "ใหม่",
    caseNewAria: "เคสใหม่ — DPO ยังไม่เคยเปิดดู",
    caseNewCount: "ใหม่ {count}",
    auditActionAwarenessConfirmed: "บันทึกเวลาที่ทราบเหตุ — เริ่มนับ 72 ชั่วโมง",
    auditActionExemptionDetected: "ตรวจพบความผิดปกติความเสี่ยงต่ำ — เปิดการประเมินข้อยกเว้น",
    auditRationaleMitigated: "มาตรการป้องกันลดความเสี่ยงคงเหลือจนเข้าเงื่อนไขยกเว้น (ข้อ 9 วรรคสอง)",
    evidenceCatExemption: "ข้อยกเว้น",
    evidenceViewForCase: "ดูบันทึกหลักฐานของเคสนี้",
    evidenceMitigationFactor: "ค่ามาตรการป้องกัน M={value}",
    countdownNotStarted: "ยังไม่เริ่มนับกรอบเวลากฎหมาย",
    countdownNotStartedSub: "กรอบ 72 ชั่วโมงเริ่มนับจากเวลาที่ DPO ทราบเหตุจริง ไม่ใช่เวลาที่ระบบตรวจพบ กรุณาตรวจสอบเหตุแล้วบันทึกเวลาที่ทราบเหตุเพื่อเริ่มนับ",
    countdownConfirmBtn: "บันทึกเวลาที่ทราบเหตุ & เริ่มนับถอยหลัง",
    countdownAwaitingShort: "ยังไม่เริ่มนับ",
    countdownDetectedAtLabel: "ระบบตรวจพบเมื่อ",
  },
};

const arrays = {
  en: {
    bulkReasonOptions: [
      "Verified as internal test traffic (Internal Load Test)",
      "Data is fully encrypted/masked — no risk to data subjects",
      "Authorized access under regular scheduled batch jobs",
      "Traffic from the organization's own monitoring system",
    ],
  },
  th: {
    bulkReasonOptions: [
      "ตรวจสอบแล้วเป็นทราฟฟิกทดสอบภายใน (Internal Load Test)",
      "ข้อมูลผ่านการเข้ารหัส/พรางค่าครบถ้วน — ไม่มีความเสี่ยงต่อเจ้าของข้อมูล",
      "เป็นการเข้าถึงตามรอบงาน Batch ปกติที่ได้รับอนุญาต",
      "ทราฟฟิกจากระบบ Monitoring ของบริษัทเอง",
    ],
  },
};

export type TranslationKey = keyof typeof translations.en;
export type TranslationArrayKey = keyof typeof arrays.en;

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("pdpa-language") as Language;
    if (saved === "en" || saved === "th") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("pdpa-language", lang);
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] as Record<string, string>;
    const defaultDict = translations["en"] as Record<string, string>;
    return dict[key] || defaultDict[key] || "";
  };

  const tArray = (key: TranslationArrayKey): string[] => {
    const dict = arrays[language] as Record<string, string[]>;
    const defaultDict = arrays["en"] as Record<string, string[]>;
    return dict[key] || defaultDict[key] || [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
