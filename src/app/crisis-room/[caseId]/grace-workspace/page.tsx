"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Clock, Send, CheckCircle2, ShieldAlert, PenTool,
  FileWarning, Download, AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getIncidentById, gracePeriodReasonKeys } from "@/lib/mockData";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import { useAppState } from "@/lib/AppStateContext";
import { cn } from "@/lib/utils";
import type * as React from "react";

const Input = ({ className, ...props }: React.ComponentProps<"input">) => (
  <input
    className={cn(
      "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30",
      className
    )}
    {...props}
  />
);

export default function GraceWorkspacePage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { gracePending, requestGracePeriod } = useAppState();
  const incident = getIncidentById(decodeURIComponent(params.caseId));

  // Form state
  const [dpoName, setDpoName] = useState("Watcharapol Charoensuk");
  const [dpoLicense, setDpoLicense] = useState("PDPA-DPO-2026-9812");
  const [selectedReason, setSelectedReason] = useState<TranslationKey | "">("");
  const [circumstance, setCircumstance] = useState(
    language === "th"
      ? "ระบบเครือข่ายหลักถูกสั่งหยุดการทำงานเป็นการชั่วคราวเพื่อป้องกันการรั่วไหลเพิ่มเติม ทีมไอทีกำลังดำเนินการกู้คืนและรวบรวมหลักฐานทางนิติวิทยาศาสตร์ดิจิทัล คาดว่าจะแล้วเสร็จภายใน 24 ชั่วโมง"
      : "Core network infrastructure was temporarily shut down to prevent further exfiltration. The IT forensics team is actively recovering digital evidence and compiling a comprehensive incident timeline. Estimated completion within 24 hours."
  );
  const [additionalContext, setAdditionalContext] = useState("");
  const [certified, setCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const canSubmit = selectedReason !== "" && certified && !gracePending && !submitSuccess;
  const locale = language === "th" ? "th-TH" : "en-US";

  const nowFormatted = new Date().toLocaleString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      requestGracePeriod(selectedReason as TranslationKey, circumstance);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  if (!incident) {
    return (
      <AppShell alertActive guardEnabled={false}>
        <main className="flex-1 p-4 max-w-[1400px] w-full mx-auto flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8">
            <ShieldAlert className="size-10 text-destructive mx-auto mb-3" />
            <p className="font-bold">{t("incidentNotFound")}</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/crisis-room">Back</Link>
            </Button>
          </Card>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell alertActive guardEnabled={false}>
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Workspace Toolbar Header */}
        <div className="border-b bg-card px-4 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="size-8 p-0 rounded-lg cursor-pointer">
              <Link href={`/crisis-room/${encodeURIComponent(incident.caseId)}`}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">{incident.caseId}</span>
                <Badge variant="secondary" className="text-[9px] uppercase tracking-wide px-1.5 h-4.5 border-amber-400/50 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30">
                  {language === "th" ? "คำร้องขอขยายเวลา" : "Grace Period Request"}
                </Badge>
              </div>
              <h1 className="text-sm font-bold text-foreground mt-0.5">
                {language === "th" ? "ร่างคำร้องขอสิทธิ์ขยายเวลาชี้แจงฉุกเฉิน" : "Draft Emergency Reporting Extension Request"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs h-8 px-3 gap-1.5 cursor-pointer font-semibold"
            >
              <Download className="size-3.5" />
              <span>{isDownloaded ? (language === "th" ? "ดาวน์โหลดแล้ว" : "Downloaded") : (language === "th" ? "ดาวน์โหลด PDF" : "Download PDF")}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="text-xs h-8 px-3 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer font-bold disabled:bg-muted disabled:text-muted-foreground"
            >
              <Send className="size-3.5" />
              <span>
                {isSubmitting
                  ? (language === "th" ? "กำลังส่ง..." : "Submitting...")
                  : gracePending || submitSuccess
                    ? (language === "th" ? "ส่งคำร้องแล้ว" : "Request Submitted")
                    : (language === "th" ? "ลงชื่อ & ยื่นส่ง สคส." : "Sign & Submit to PDPC")}
              </span>
            </Button>
          </div>
        </div>

        {/* Workspace Body Split Pane */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-muted/20">
          {/* Left Pane: Editable Form Fields */}
          <div className="w-full lg:w-[450px] border-r bg-card flex flex-col overflow-y-auto shrink-0 border-b lg:border-b-0">
            <div className="p-4 border-b bg-muted/10">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="size-3.5 text-amber-500" />
                {language === "th" ? "แบบฟอร์มคำร้องขอสิทธิ์ฉุกเฉิน" : "Grace Period Application Form"}
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {language === "th"
                  ? "กรอกข้อมูลเพื่อจัดทำหนังสือร้องขอขยายเวลายื่นรายงานต่อ สคส. ตามมาตรา 37(4)"
                  : "Fill details to compose the formal Section 37(4) extension request letter to PDPC."}
              </p>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {/* DPO Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "ชื่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" : "Data Protection Officer (DPO)"}
                </Label>
                <Input
                  value={dpoName}
                  onChange={(e) => setDpoName(e.target.value)}
                  placeholder="DPO Name"
                  disabled={gracePending || submitSuccess}
                />
              </div>

              {/* DPO License */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "เลขทะเบียนใบวิชาชีพ/ใบรับรอง DPO" : "DPO License / Certification ID"}
                </Label>
                <Input
                  value={dpoLicense}
                  onChange={(e) => setDpoLicense(e.target.value)}
                  placeholder="DPO ID"
                  className="font-mono"
                  disabled={gracePending || submitSuccess}
                />
              </div>

              {/* Reason Select */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {t("graceReasonLabel")} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedReason}
                  onValueChange={(v) => setSelectedReason(v as TranslationKey)}
                  disabled={gracePending || submitSuccess}
                >
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder={t("graceReasonPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {gracePeriodReasonKeys.map((key) => (
                      <SelectItem key={key} value={key} className="text-xs">
                        {t(key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Circumstance */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "รายละเอียดสถานการณ์ (ประกอบคำร้อง)" : "Circumstance Details (Supporting Narrative)"}
                </Label>
                <Textarea
                  value={circumstance}
                  onChange={(e) => setCircumstance(e.target.value)}
                  rows={5}
                  className="text-xs rounded-lg resize-none leading-relaxed"
                  placeholder={language === "th" ? "อธิบายสาเหตุที่ทำให้ไม่สามารถรายงานได้ภายในกำหนด..." : "Describe why reporting within 72h is not feasible..."}
                  disabled={gracePending || submitSuccess}
                />
                <p className="text-[9px] text-muted-foreground leading-snug">
                  {language === "th"
                    ? "* สคส. จะใช้ข้อมูลนี้ในการพิจารณาคำร้องขอขยายเวลา"
                    : "* PDPC will use this narrative to evaluate the extension request."}
                </p>
              </div>

              {/* Additional Context */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "บริบทเพิ่มเติม (ระบุหรือไม่ก็ได้)" : "Additional Context (Optional)"}
                </Label>
                <Textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={3}
                  className="text-xs rounded-lg resize-none leading-relaxed"
                  placeholder={language === "th" ? "เอกสารแนบ, ผู้ที่ติดต่อได้, หมายเหตุเพิ่มเติม..." : "Attachments, contact persons, additional remarks..."}
                  disabled={gracePending || submitSuccess}
                />
              </div>

              {/* Certification Checkbox */}
              {!gracePending && !submitSuccess && (
                <Label className="flex items-start gap-2.5 cursor-pointer font-normal bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg p-3">
                  <Checkbox
                    checked={certified}
                    onCheckedChange={(v) => setCertified(v === true)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] leading-relaxed">
                    {t("graceCheckbox")}
                  </span>
                </Label>
              )}
            </div>
          </div>

          {/* Right Pane: Interactive Document Preview */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <div className="w-full max-w-[760px] bg-white text-zinc-950 p-6 sm:p-8 border shadow-lg rounded-sm relative min-h-[960px] flex flex-col font-sans select-none border-zinc-200">
              {/* Submission watermark */}
              {(submitSuccess || gracePending) && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 border-8 border-amber-500 bg-white/90 text-amber-700 font-extrabold text-2xl sm:text-4xl py-3 px-8 rounded-2xl shadow-xl z-20 flex flex-col items-center gap-2 tracking-widest border-double">
                  <CheckCircle2 className="size-8 sm:size-12 text-amber-600" />
                  <span>{language === "th" ? "ยื่นเรื่องสำเร็จ" : "SUBMITTED"}</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-600/70 tracking-normal mt-1">PDPC-GR-EXT-7741-2026</span>
                </div>
              )}

              {/* Document Header */}
              <div className="border-b-2 border-zinc-950 pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      {language === "th"
                        ? "สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)"
                        : "OFFICE OF THE PERSONAL DATA PROTECTION COMMISSION"}
                    </h3>
                    <h2 className="text-sm font-bold text-zinc-800">
                      {language === "th"
                        ? "หนังสือร้องขอขยายเวลายื่นรายงานแจ้งเหตุการละเมิดข้อมูลส่วนบุคคล"
                        : "Application for Extension of Breach Notification Deadline"}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {language === "th"
                        ? "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มาตรา 37(4) — ร้องขอขยายเวลาตามสถานการณ์ฉุกเฉิน"
                        : "Pursuant to Section 37(4) of the Personal Data Protection Act B.E. 2562 — Emergency Extension Application"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block border border-amber-800 px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-50 text-amber-800">
                      {language === "th" ? "คำร้องฉุกเฉิน" : "EMERGENCY REQUEST"}
                    </span>
                    <div className="text-[9px] font-mono text-zinc-400 mt-1">Ref: {incident.caseId}</div>
                    <div className="text-[8px] font-mono text-zinc-400 mt-0.5">{nowFormatted}</div>
                  </div>
                </div>
              </div>

              {/* Document Body */}
              <div className="space-y-6 flex-1 text-xs">
                {/* Part 1: Applicant Info */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "1. ข้อมูลผู้ยื่นคำร้อง (Applicant Details)" : "1. Applicant Details"}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ชื่อองค์กร (Data Controller):" : "Organization (Data Controller):"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{language === "th" ? "บริษัท โกลบอล โพรเทคชั่น กรุ๊ป จำกัด" : "Global Protection Group Co., Ltd."}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "เจ้าหน้าที่คุ้มครองข้อมูล (DPO):" : "Data Protection Officer (DPO):"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{dpoName || "—"}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "เลขทะเบียน DPO:" : "DPO Registration ID:"}</span>
                      <p className="font-bold font-mono text-zinc-950 mt-0.5">{dpoLicense || "—"}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "รหัสคดีอ้างอิง:" : "Case Reference ID:"}</span>
                      <p className="font-bold font-mono text-zinc-950 mt-0.5">{incident.caseId}</p>
                    </div>
                  </div>
                </div>

                {/* Part 2: Incident Reference */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "2. ข้อมูลอุบัติการณ์ที่เกี่ยวข้อง (Incident Reference)" : "2. Incident Reference"}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "วันเวลาที่ตรวจพบ:" : "Detected At:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{incident.detectedAt}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "จำนวนเจ้าของข้อมูลโดยประมาณ:" : "Estimated Affected Records:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{incident.affectedRows.toLocaleString(locale)} {language === "th" ? "รายการ" : "records"}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-500">{language === "th" ? "ลักษณะอุบัติการณ์โดยสังเขป:" : "Incident Type Summary:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{t(incident.titleKey)}</p>
                    </div>
                  </div>
                </div>

                {/* Part 3: Ground for Extension */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "3. เหตุผลความจำเป็นในการร้องขอขยายเวลา (Legal Grounds)" : "3. Grounds for Extension"}
                  </h4>
                  <div className="text-[11px] space-y-2">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "เหตุผลหลัก (Main Ground):" : "Primary Ground:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5 p-2 bg-amber-50 border border-amber-200 rounded-sm">
                        {selectedReason ? t(selectedReason as TranslationKey) : (language === "th" ? "— ยังไม่ได้เลือกเหตุผล —" : "— No reason selected —")}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "รายละเอียดสถานการณ์ประกอบคำร้อง:" : "Supporting Circumstance Narrative:"}</span>
                      <p className="p-2.5 bg-zinc-50 border rounded-sm text-[10px] font-mono leading-relaxed text-zinc-800 min-h-[60px] whitespace-pre-wrap mt-1">
                        {circumstance || (language === "th" ? "— ยังไม่มีการระบุข้อมูล —" : "— No details provided —")}
                      </p>
                    </div>
                    {additionalContext && (
                      <div>
                        <span className="text-zinc-500">{language === "th" ? "บริบทเพิ่มเติม:" : "Additional Context:"}</span>
                        <p className="p-2 bg-zinc-50 border rounded-sm text-[10px] text-zinc-800 leading-relaxed mt-1">{additionalContext}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Part 4: Duration Requested */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "4. ระยะเวลาที่ร้องขอขยาย (Extension Duration)" : "4. Requested Extension Duration"}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ระยะเวลาที่ร้องขอเพิ่ม:" : "Additional Time Requested:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5 text-base">+24 <span className="text-[10px] font-normal text-zinc-500">{language === "th" ? "ชั่วโมง (กำหนดมาตรฐาน)" : "hours (standard grace)"}</span></p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "วันที่ยื่นคำร้อง:" : "Application Filed:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{nowFormatted}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-sm text-[10px] text-amber-800">
                    <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      {language === "th"
                        ? "คำร้องนี้ถูกส่งภายใต้สถานการณ์วิกฤตที่จำเป็นต้องใช้เวลาเพิ่มเติมในการตรวจสอบและรวบรวมหลักฐาน ผู้ยื่นคำร้องยืนยันว่าดำเนินการด้วยเจตนาที่โปร่งใสตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562"
                        : "This application is filed under emergency circumstances requiring additional time for evidence collection and forensic analysis. The applicant confirms good-faith compliance intent under the PDPA B.E. 2562."}
                    </span>
                  </div>
                </div>

                {/* Part 5: Signature */}
                <div className="pt-6 mt-6 flex justify-end">
                  <div className="w-[220px] border-t border-zinc-400 pt-2 text-center text-[10px] space-y-1">
                    <span className="text-zinc-400 font-mono tracking-wider italic block">{language === "th" ? "(ลายมือชื่อดิจิทัล)" : "(Digital Signature ID)"}</span>
                    <p className="font-bold text-zinc-950 mt-0.5 underline">{dpoName || "_________________________"}</p>
                    <p className="text-zinc-500 text-[9px]">{language === "th" ? "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" : "Data Protection Officer"}</p>
                    <p className="text-zinc-400 text-[8px] font-mono mt-0.5">{dpoLicense || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="border-t border-zinc-300 pt-3 mt-6 text-[8px] text-zinc-400 font-mono flex justify-between items-center shrink-0">
                <span>{language === "th" ? "ระบบตรวจจับเกราะป้องกัน PDPA — คำร้องขอสิทธิ์ฉุกเฉิน" : "PDPA Sentinel Defense System — Emergency Grace Period Application"}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Success Dialog */}
        <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
          <DialogContent className="border-t-4 border-t-amber-500 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-amber-600 shrink-0" />
                {language === "th" ? "ส่งคำร้องขอสิทธิ์ฉุกเฉินสำเร็จ!" : "Emergency Grace Period Request Submitted!"}
              </DialogTitle>
              <DialogDescription className="leading-relaxed pt-1 text-xs">
                {language === "th"
                  ? "คำร้องของท่านได้รับการลงชื่อและส่งไปยังระบบกลางของสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) เรียบร้อยแล้ว นาฬิกานับถอยหลัง 72 ชั่วโมงได้หยุดพักชั่วคราวจนกว่า สคส. จะมีคำตัดสิน"
                  : "Your request has been digitally signed and submitted to the PDPC (สคส.) central registry. The 72-hour legal countdown is now paused pending their review decision."}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted p-2 rounded-xl text-[10px] font-mono text-muted-foreground select-text border w-full text-center">
              Ticket ID: PDPC-GR-EXT-7741-2026
            </div>
            <Button
              onClick={() => {
                setSubmitSuccess(false);
                router.push(`/crisis-room/${encodeURIComponent(incident.caseId)}`);
              }}
              className="w-full font-bold h-9 text-xs bg-amber-600 hover:bg-amber-700 text-white"
            >
              {language === "th" ? "กลับไปหน้าห้องจัดการวิกฤต" : "Back to Crisis Room"}
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </AppShell>
  );
}
