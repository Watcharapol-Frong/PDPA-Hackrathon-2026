"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, X, SendHorizonal, RotateCcw, Clipboard, Check,
  ChevronRight, Bot, User, Lightbulb, Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/LanguageContext";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AiAssistMode = "breach-report" | "grace-period";

interface QuickAction {
  id: string;
  labelEn: string;
  labelTh: string;
  icon: React.ReactNode;
  /** key of the target field this action fills */
  targetField?: string;
  promptEn: string;
  promptTh: string;
}

interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  targetField?: string;
  /** Has the user already inserted this response? */
  inserted?: boolean;
}

interface AiDocumentAssistantProps {
  mode: AiAssistMode;
  /** Incident details for contextual generation */
  incidentTitle?: string;
  affectedCount?: string;
  detectedAt?: string;
  /** Callback so the assistant can push generated text into form fields */
  onInsert?: (field: string, value: string) => void;
}

// ─── Mock AI Response Generator ─────────────────────────────────────────────

function generateResponse(
  promptId: string,
  mode: AiAssistMode,
  language: string,
  context: { title?: string; count?: string; detectedAt?: string }
): string {
  const isEn = language !== "th";
  const count = context.count ?? "15,200";
  const detected = context.detectedAt ?? "2026-07-18 02:05:31";

  const responses: Record<string, Record<string, string>> = {
    // ─── Breach Report Mode ───────────────────────────────────────────
    "containment-draft": {
      en: `Upon detection of unauthorized access at ${detected}, the following immediate containment measures were executed:\n\n1. Traffic Throttling was activated on all front-end API gateways to restrict inbound request volume.\n2. Malicious IP ranges identified via Edge Proxy telemetry were immediately blocklisted.\n3. All database access credentials were rotated and session tokens invalidated.\n4. Granular Deep-Audit logging was enabled to capture every subsequent data access event.\n5. Affected API endpoints were rate-limited to 10 req/min pending forensic review.\n\nForensic containment is confirmed. No further exfiltration detected post-mitigation.`,
      th: `เมื่อตรวจพบการเข้าถึงโดยไม่ได้รับอนุญาตเมื่อวันที่ ${detected} ได้ดำเนินมาตรการควบคุมความเสียหายทันทีดังนี้:\n\n1. เปิดใช้งานระบบ Traffic Throttling บน API Gateway ด่านหน้าทั้งหมดเพื่อจำกัดปริมาณคำขอขาเข้า\n2. บล็อกช่วง IP ที่เป็นอันตรายซึ่งตรวจพบจากระบบ Edge Proxy Telemetry ทันที\n3. หมุนเวียนรหัสเข้าถึงฐานข้อมูลและยกเลิก Session Token ที่ใช้งานอยู่ทั้งหมด\n4. เปิดการบันทึกเหตุการณ์แบบ Deep-Audit เพื่อบันทึกการเข้าถึงข้อมูลทุกรายการต่อจากนี้\n5. จำกัดอัตราการเรียก API Endpoint ที่ได้รับผลกระทบเหลือ 10 req/min ระหว่างการตรวจสอบเชิงนิติ\n\nยืนยันการควบคุมได้ผล ไม่พบการรั่วไหลข้อมูลเพิ่มเติมหลังดำเนินมาตรการ`,
    },
    "report-polish": {
      en: `Reviewed and refined. Here is the polished executive summary suitable for the official PDPC filing:\n\n"On ${detected}, our automated Edge Proxy detection system identified a mass exfiltration attempt targeting customer records across ${count} accounts. The attack exploited a cross-tenant API gateway vulnerability, bypassing standard authentication controls. Immediate containment protocols were activated within 15 minutes of detection. All affected endpoints have been secured and forensic evidence has been preserved in compliance with evidence integrity standards under the Personal Data Protection Act B.E. 2562."`,
      th: `ตรวจสอบและปรับปรุงแล้ว นี่คือบทสรุปสำหรับผู้บริหารที่เหมาะสำหรับการยื่นต่อ สคส.:\n\n"เมื่อวันที่ ${detected} ระบบตรวจจับอัตโนมัติของ Edge Proxy ตรวจพบความพยายามสกัดข้อมูลจำนวนมากที่กำหนดเป้าหมายบันทึกลูกค้ากว่า ${count} รายการ การโจมตีใช้ประโยชน์จากช่องโหว่ API Gateway แบบ Cross-Tenant เพื่อหลีกเลี่ยงการควบคุมการตรวจสอบสิทธิ์มาตรฐาน โปรโตคอลควบคุมความเสียหายทันทีถูกเปิดใช้งานภายใน 15 นาทีหลังตรวจพบ Endpoint ที่ได้รับผลกระทบทั้งหมดได้รับการรักษาความปลอดภัยและหลักฐานทางนิติวิทยาศาสตร์ถูกเก็บรักษาไว้ตามมาตรฐานความสมบูรณ์ของหลักฐานภายใต้ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562"`,
    },
    "risk-note": {
      en: `Risk Assessment Note for Regulators:\n\nBased on automated risk scoring under PDPA Section 37(4), the following subject categories were exposed:\n\n• National ID numbers — Legal sensitivity weight ×2.0 (Section 26 adjacent)\n• Health/allergy records — Legal sensitivity weight ×5.0 (Section 26 strict)\n• Full names — General data weight ×1.0\n\nAggregate risk score: CRITICAL (4.2/5.0)\nEstimated harm potential: High — data subjects may face identity theft, insurance fraud, or healthcare discrimination.\n\nRecommended immediate notification to affected data subjects is advised within the same 72-hour window.`,
      th: `บันทึกการประเมินความเสี่ยงสำหรับผู้กำกับดูแล:\n\nจากการให้คะแนนความเสี่ยงอัตโนมัติภายใต้มาตรา 37(4) ของ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล หมวดหมู่ข้อมูลที่ได้รับผลกระทบ:\n\n• เลขบัตรประชาชน — น้ำหนักทางกฎหมาย ×2.0 (ใกล้เคียงมาตรา 26)\n• ข้อมูลสุขภาพ/ประวัติการแพ้ยา — น้ำหนักทางกฎหมาย ×5.0 (มาตรา 26 เข้มงวด)\n• ชื่อ-นามสกุล — ข้อมูลทั่วไป ×1.0\n\nคะแนนความเสี่ยงรวม: วิกฤต (4.2/5.0)\nศักยภาพความเสียหายโดยประมาณ: สูง — เจ้าของข้อมูลอาจเผชิญกับการโจรกรรมข้อมูลส่วนตัว การฉ้อโกงประกัน หรือการเลือกปฏิบัติด้านสุขภาพ\n\nแนะนำให้แจ้งเตือนเจ้าของข้อมูลที่ได้รับผลกระทบทันทีภายในกรอบเวลา 72 ชั่วโมงเดียวกัน`,
    },

    // ─── Grace Period Mode ────────────────────────────────────────────
    "circumstance-draft": {
      en: `Core network infrastructure supporting the central database cluster was placed under emergency isolation at ${detected} to prevent further unauthorized data exfiltration. This action was taken under the authority of the Chief Information Security Officer (CISO) following confirmation of the active breach.\n\nAs a direct consequence of this necessary isolation:\n• Forensic log collection from the affected systems requires additional time to complete safely without risking evidence contamination.\n• Third-party cloud infrastructure partners have not yet transmitted the required cross-tenant access logs.\n• The full scope of affected data subjects is still being quantified through forensic reconstruction.\n\nThe IT Security and Legal teams are working in parallel. Estimated completion of evidence compilation: within 24 hours of this submission.`,
      th: `โครงสร้างพื้นฐานเครือข่ายหลักที่รองรับคลัสเตอร์ฐานข้อมูลกลางถูกแยกออกฉุกเฉินเมื่อวันที่ ${detected} เพื่อป้องกันการสกัดข้อมูลโดยไม่ได้รับอนุญาตเพิ่มเติม การดำเนินการนี้อยู่ภายใต้อำนาจของประธานเจ้าหน้าที่รักษาความปลอดภัยสารสนเทศ (CISO) หลังจากยืนยันว่ามีการละเมิดที่ยังคงดำเนินอยู่\n\nผลจากการแยกระบบที่จำเป็นนี้:\n• การรวบรวม Log ทางนิติวิทยาศาสตร์จากระบบที่ได้รับผลกระทบต้องใช้เวลาเพิ่มเติมเพื่อดำเนินการอย่างปลอดภัยโดยไม่เสี่ยงต่อการปนเปื้อนหลักฐาน\n• พันธมิตรโครงสร้างพื้นฐานคลาวด์บุคคลที่สามยังไม่ส่ง Access Log แบบ Cross-Tenant ที่จำเป็น\n• ขอบเขตเต็มรูปแบบของเจ้าของข้อมูลที่ได้รับผลกระทบยังอยู่ระหว่างการระบุปริมาณผ่านการสร้างใหม่ทางนิติวิทยาศาสตร์\n\nทีมรักษาความปลอดภัยไอทีและกฎหมายทำงานคู่ขนานกัน คาดว่าการรวบรวมหลักฐานจะเสร็จสมบูรณ์ภายใน 24 ชั่วโมงหลังการส่งนี้`,
    },
    "legal-justification": {
      en: `Legal Justification for Grace Period:\n\nPursuant to the Office of the Personal Data Protection Commission's guidelines on emergency reporting extensions, this application relies on the following legal grounds:\n\n1. Objective Impossibility: The immediate shutdown of affected network segments, while necessary to limit harm under Section 37(4) duty of care, has created a temporary technical impediment to full log retrieval.\n\n2. Good Faith Compliance: This organisation has proactively activated all available technical safeguards (Traffic Throttling, Data Masking, Deep Audit Logging) and has not delayed notification — this application is filed at the earliest possible opportunity.\n\n3. No Prejudice to Data Subjects: Continued active monitoring and the absence of further detected exfiltration confirm no additional harm will occur during the requested extension period.\n\nWe respectfully request a 24-hour extension to ensure the accuracy and completeness of our final report.`,
      th: `เหตุผลทางกฎหมายสำหรับการร้องขอขยายเวลา:\n\nตามแนวทางของสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลเกี่ยวกับการขยายเวลาการรายงานฉุกเฉิน คำร้องนี้อ้างอิงเหตุผลทางกฎหมายดังต่อไปนี้:\n\n1. ความเป็นไปไม่ได้โดยวัตถุประสงค์: การปิดเครือข่ายที่ได้รับผลกระทบทันที แม้จะจำเป็นเพื่อจำกัดความเสียหายภายใต้หน้าที่ดูแลตามมาตรา 37(4) ได้สร้างอุปสรรคทางเทคนิคชั่วคราวในการดึงข้อมูล Log ทั้งหมด\n\n2. การปฏิบัติตามด้วยความสุจริตใจ: องค์กรนี้ได้เปิดใช้งานมาตรการป้องกันทางเทคนิคที่มีอยู่ทั้งหมด (Traffic Throttling, Data Masking, Deep Audit Logging) เชิงรุก และไม่ได้ล่าช้าในการแจ้งเตือน — คำร้องนี้ถูกยื่นโดยเร็วที่สุดเท่าที่เป็นไปได้\n\n3. ไม่กระทบต่อเจ้าของข้อมูล: การติดตามอย่างต่อเนื่องและการไม่มีการสกัดข้อมูลเพิ่มเติมที่ตรวจพบยืนยันว่าจะไม่มีอันตรายเพิ่มเติมเกิดขึ้นในระหว่างช่วงเวลาขยายที่ร้องขอ\n\nขอยื่นคำร้องขอขยายเวลา 24 ชั่วโมงเพื่อให้มั่นใจถึงความถูกต้องและครบถ้วนของรายงานขั้นสุดท้ายของเรา`,
    },
    "timeline-summary": {
      en: `Chronological Summary for PDPC Submission:\n\n▸ T+00:00 — Abnormal traffic pattern detected at Edge Proxy (2,400% spike in API calls)\n▸ T+00:04 — Automated masking failure logged; auth token expired mid-request\n▸ T+00:09 — Data exfiltration confirmed: ${count} records accessed without authorisation\n▸ T+00:15 — CISO notified; network isolation initiated\n▸ T+00:22 — Traffic Throttling activated; malicious IPs blocklisted\n▸ T+00:31 — All credentials rotated; session tokens invalidated\n▸ T+01:00 — Deep-Audit logging enabled; forensic team engaged\n▸ T+02:45 — This grace period application filed\n\nAll timestamps are recorded in UTC+7 (Bangkok) and are sourced from immutable WORM telemetry logs.`,
      th: `สรุปลำดับเหตุการณ์สำหรับการยื่น สคส.:\n\n▸ T+00:00 — ตรวจพบรูปแบบการเข้าชมผิดปกติที่ Edge Proxy (เพิ่มขึ้น 2,400% ในการเรียก API)\n▸ T+00:04 — บันทึกความล้มเหลวการพราง Token ตรวจสอบหมดอายุระหว่างคำขอ\n▸ T+00:09 — ยืนยันการสกัดข้อมูล: ${count} รายการถูกเข้าถึงโดยไม่ได้รับอนุญาต\n▸ T+00:15 — แจ้ง CISO เริ่มการแยกเครือข่าย\n▸ T+00:22 — เปิดใช้งาน Traffic Throttling บล็อก IP ที่เป็นอันตราย\n▸ T+00:31 — หมุนเวียนข้อมูลรับรองทั้งหมด ยกเลิก Session Token\n▸ T+01:00 — เปิดใช้งานการบันทึก Deep-Audit ทีมนิติวิทยาศาสตร์เข้าร่วม\n▸ T+02:45 — ยื่นคำร้องขอขยายเวลาครั้งนี้\n\nการประทับเวลาทั้งหมดบันทึกใน UTC+7 (กรุงเทพฯ) และมาจาก WORM Telemetry Log ที่ย้อนกลับไม่ได้`,
    },
  };

  // free-form chat fallback
  const fallbackEn = `Based on the incident context (${count} records affected, detected ${detected}), I recommend:\n\n• Ensure all containment timestamps are traceable to immutable WORM log entries.\n• Cross-reference compromised field categories against Section 26 sensitivity weights before submission.\n• Include a declaration of no further exfiltration post-mitigation.\n\nWould you like me to draft any specific section of the document?`;
  const fallbackTh = `จากบริบทของอุบัติการณ์ (${count} รายการได้รับผลกระทบ ตรวจพบ ${detected}) ฉันแนะนำ:\n\n• ตรวจสอบให้แน่ใจว่าการประทับเวลาการควบคุมทั้งหมดสามารถติดตามไปยัง WORM Log ที่ย้อนกลับไม่ได้\n• อ้างอิงหมวดหมู่ฟิลด์ที่ถูกละเมิดกับน้ำหนักความอ่อนไหวมาตรา 26 ก่อนยื่น\n• รวมการประกาศว่าไม่มีการสกัดข้อมูลเพิ่มเติมหลังมาตรการ\n\nต้องการให้ฉันร่างส่วนใดของเอกสารโดยเฉพาะหรือไม่?`;

  const found = responses[promptId];
  if (found) return isEn ? found.en : found.th;
  return isEn ? fallbackEn : fallbackTh;
}

// ─── Quick Action Definitions ─────────────────────────────────────────────

const BREACH_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "containment-draft",
    labelEn: "Draft Containment Details",
    labelTh: "ร่างมาตรการควบคุม",
    icon: <Wand2 className="size-3" />,
    targetField: "containmentDetails",
    promptEn: "Draft containment & remediation steps based on incident data",
    promptTh: "ร่างมาตรการควบคุมและแก้ไขจากข้อมูลอุบัติการณ์",
  },
  {
    id: "report-polish",
    labelEn: "Polish Report Language",
    labelTh: "ปรับปรุงภาษาเอกสาร",
    icon: <Sparkles className="size-3" />,
    promptEn: "Refine and polish the executive summary for regulatory submission",
    promptTh: "ปรับปรุงบทสรุปสำหรับผู้บริหารให้เหมาะสมสำหรับการยื่นกำกับดูแล",
  },
  {
    id: "risk-note",
    labelEn: "Generate Risk Note",
    labelTh: "สร้างบันทึกความเสี่ยง",
    icon: <Lightbulb className="size-3" />,
    targetField: "additionalNotes",
    promptEn: "Generate a risk assessment note for the regulators",
    promptTh: "สร้างบันทึกการประเมินความเสี่ยงสำหรับผู้กำกับดูแล",
  },
  {
    id: "timeline-summary",
    labelEn: "Chronological Timeline",
    labelTh: "สรุปลำดับเหตุการณ์",
    icon: <ChevronRight className="size-3" />,
    targetField: "additionalNotes",
    promptEn: "Create a chronological incident timeline for PDPC submission",
    promptTh: "สร้างลำดับเหตุการณ์ตามลำดับเวลาสำหรับ สคส.",
  },
];

const GRACE_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "circumstance-draft",
    labelEn: "Draft Circumstances",
    labelTh: "ร่างรายละเอียดสถานการณ์",
    icon: <Wand2 className="size-3" />,
    targetField: "circumstance",
    promptEn: "Draft the supporting circumstance narrative for the grace period application",
    promptTh: "ร่างรายละเอียดสถานการณ์ประกอบคำร้องขอขยายเวลา",
  },
  {
    id: "legal-justification",
    labelEn: "Legal Justification",
    labelTh: "เหตุผลทางกฎหมาย",
    icon: <Lightbulb className="size-3" />,
    targetField: "additionalContext",
    promptEn: "Generate formal legal justification for the grace period request",
    promptTh: "สร้างเหตุผลทางกฎหมายอย่างเป็นทางการสำหรับคำร้องขอขยายเวลา",
  },
  {
    id: "timeline-summary",
    labelEn: "Incident Timeline",
    labelTh: "ลำดับเหตุการณ์",
    icon: <ChevronRight className="size-3" />,
    targetField: "additionalContext",
    promptEn: "Produce a chronological incident timeline to support the grace period application",
    promptTh: "สร้างลำดับเหตุการณ์ตามลำดับเวลาเพื่อสนับสนุนคำร้องขอขยายเวลา",
  },
  {
    id: "report-polish",
    labelEn: "Improve Language",
    labelTh: "ปรับปรุงภาษา",
    icon: <Sparkles className="size-3" />,
    promptEn: "Polish and refine the language for formal PDPC submission",
    promptTh: "ปรับปรุงภาษาให้เหมาะสมสำหรับการยื่นต่อ สคส. อย่างเป็นทางการ",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AiDocumentAssistant({
  mode,
  incidentTitle,
  affectedCount,
  detectedAt,
  onInsert,
}: AiDocumentAssistantProps) {
  const { language } = useTranslation();
  const isEn = language !== "th";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const quickActions = mode === "breach-report" ? BREACH_QUICK_ACTIONS : GRACE_QUICK_ACTIONS;
  const context = { title: incidentTitle, count: affectedCount, detectedAt };

  // auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Simulate streaming by appending chars progressively
  const streamResponse = (fullText: string, messageId: string, targetField?: string) => {
    const chars = fullText.split("");
    let current = "";
    let i = 0;

    const tick = () => {
      const chunkSize = Math.floor(Math.random() * 6) + 3;
      for (let j = 0; j < chunkSize && i < chars.length; j++, i++) {
        current += chars[i];
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: current } : m
        )
      );
      if (i < chars.length) {
        setTimeout(tick, 18);
      } else {
        setIsTyping(false);
        // If there's a target field and an insert handler, mark insertable
        if (targetField && onInsert) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, targetField } : m
            )
          );
        }
      }
    };

    setTimeout(tick, 300);
  };

  const sendMessage = (promptId: string, userText: string, targetField?: string) => {
    if (isTyping) return;

    const userMsgId = `u-${Date.now()}`;
    const asMsgId = `a-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", content: userText },
      { id: asMsgId, role: "assistant", content: "", targetField },
    ]);
    setIsTyping(true);

    const response = generateResponse(promptId, mode, language, context);
    streamResponse(response, asMsgId, targetField);
  };

  const handleQuickAction = (action: QuickAction) => {
    const userText = isEn ? action.promptEn : action.promptTh;
    sendMessage(action.id, userText, action.targetField);
  };

  const handleSendFreeform = () => {
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue.trim();
    setInputValue("");
    sendMessage("freeform", text, undefined);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (msg: AiMessage) => {
    if (!msg.targetField || !onInsert) return;
    onInsert(msg.targetField, msg.content);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, inserted: true } : m))
    );
  };

  const handleClear = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 px-4 rounded-2xl shadow-xl gap-2 bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs cursor-pointer border-0 ring-2 ring-violet-400/30 hover:ring-violet-400/60 transition-all"
      >
        <Sparkles className="size-4" />
        <span>{isEn ? "AI Assist" : "ผู้ช่วย AI"}</span>
      </Button>

      {/* Side panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[440px] p-0 flex flex-col gap-0 border-l"
          showCloseButton={false}
        >
          {/* Header */}
          <SheetHeader className="px-4 py-3 border-b bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-none gap-1">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-white flex items-center gap-2 text-sm font-bold">
                <Sparkles className="size-4 shrink-0" />
                {isEn ? "AI Document Assistant" : "ผู้ช่วย AI ร่างเอกสาร"}
              </SheetTitle>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-white/70 hover:text-white hover:bg-white/10 h-7 px-2 text-xs gap-1 cursor-pointer"
                  >
                    <RotateCcw className="size-3" />
                    {isEn ? "Clear" : "ล้าง"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 size-7 p-0 cursor-pointer"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
            <SheetDescription className="text-white/70 text-[10px]">
              {isEn
                ? `Context: ${mode === "breach-report" ? "Breach Notification Report" : "Grace Period Application"} · ${affectedCount ?? "—"} records affected`
                : `บริบท: ${mode === "breach-report" ? "รายงานแจ้งเหตุการละเมิด" : "คำร้องขอขยายเวลา"} · ${affectedCount ?? "—"} รายการได้รับผลกระทบ`}
            </SheetDescription>
          </SheetHeader>

          {/* Quick actions */}
          {messages.length === 0 && (
            <div className="px-4 py-3 border-b bg-muted/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {isEn ? "Quick Actions" : "คำสั่งด่วน"}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    disabled={isTyping}
                    className="flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold rounded-lg border border-border bg-card hover:bg-accent hover:border-violet-400/40 text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="text-violet-600 shrink-0 group-hover:scale-110 transition-transform">
                      {action.icon}
                    </span>
                    <span className="leading-tight">
                      {isEn ? action.labelEn : action.labelTh}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8 text-muted-foreground">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center">
                  <Bot className="size-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {isEn ? "How can I help?" : "ฉันช่วยอะไรได้บ้าง?"}
                  </p>
                  <p className="text-[10px] mt-0.5 max-w-[240px] leading-relaxed">
                    {isEn
                      ? "Use Quick Actions above or type a message to get AI-generated content for your document."
                      : "ใช้คำสั่งด่วนด้านบนหรือพิมพ์ข้อความเพื่อรับเนื้อหาที่สร้างโดย AI สำหรับเอกสารของคุณ"}
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                  }`}
                >
                  {msg.role === "user"
                    ? <User className="size-3" />
                    : <Bot className="size-3" />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted border text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                    {isTyping && msg.role === "assistant" && msg.content.length < 3 && (
                      <span className="inline-flex gap-0.5 ml-1">
                        <span className="size-1 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="size-1 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="size-1 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>

                  {/* Action buttons on assistant messages */}
                  {msg.role === "assistant" && msg.content.length > 10 && !isTyping && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground rounded border border-transparent hover:border-border hover:bg-muted transition-all cursor-pointer"
                      >
                        {copiedId === msg.id
                          ? <><Check className="size-3 text-green-600" />{isEn ? "Copied" : "คัดลอกแล้ว"}</>
                          : <><Clipboard className="size-3" />{isEn ? "Copy" : "คัดลอก"}</>}
                      </button>

                      {msg.targetField && onInsert && (
                        <button
                          onClick={() => handleInsert(msg)}
                          disabled={msg.inserted}
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded border transition-all cursor-pointer disabled:cursor-default ${
                            msg.inserted
                              ? "border-green-400/50 text-green-600 bg-green-50 dark:bg-green-950/20"
                              : "border-violet-400/50 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-400"
                          }`}
                        >
                          {msg.inserted
                            ? <><Check className="size-3" />{isEn ? "Inserted" : "แทรกแล้ว"}</>
                            : <><ChevronRight className="size-3" />{isEn ? "Insert into form" : "แทรกลงในฟอร์ม"}</>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick actions after first exchange */}
            {messages.length > 0 && !isTyping && (
              <div className="pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {isEn ? "Suggested Actions" : "คำสั่งแนะนำ"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickActions.slice(0, 3).map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      disabled={isTyping}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg border border-violet-400/30 bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-950/40 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {action.icon}
                      {isEn ? action.labelEn : action.labelTh}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-3 bg-card">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendFreeform();
                  }
                }}
                placeholder={
                  isEn
                    ? "Ask anything about this document... (Enter to send)"
                    : "ถามเกี่ยวกับเอกสารนี้... (Enter เพื่อส่ง)"
                }
                className="text-xs resize-none min-h-[40px] max-h-[120px] rounded-xl flex-1 field-sizing-content"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendFreeform}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shrink-0 cursor-pointer disabled:bg-muted disabled:text-muted-foreground border-0"
              >
                <SendHorizonal className="size-3.5" />
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1.5 text-center">
              {isEn
                ? "AI responses are generated for demonstration purposes. Always verify before filing."
                : "การตอบกลับของ AI สร้างขึ้นเพื่อการสาธิต โปรดตรวจสอบก่อนยื่นเสมอ"}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
