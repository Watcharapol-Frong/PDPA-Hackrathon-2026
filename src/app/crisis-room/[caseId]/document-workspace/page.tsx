"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, FileText, CheckCircle2, PenTool, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getIncidentById } from "@/lib/mockData";
import { useTranslation } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import type * as React from "react";
import { AiDocumentAssistant } from "@/components/crisis/ai-document-assistant";

const Input = ({ className, ...props }: React.ComponentProps<"input">) => (
  <input
    className={cn(
      "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30",
      className
    )}
    {...props}
  />
);

export default function DocumentWorkspacePage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const { t, language } = useTranslation();
  const incident = getIncidentById(decodeURIComponent(params.caseId));

  // State for form inputs (DPO composition)
  const [dpoName, setDpoName] = useState("Watcharapol Charoensuk");
  const [dpoLicense, setDpoLicense] = useState("PDPA-DPO-2026-9812");
  const [containmentDetails, setContainmentDetails] = useState(
    language === "th"
      ? "เปิดใช้งานระบบจำกัดความเร็วเชื่อมต่อ (Traffic Throttling) ปิดกั้น IP ต้นทางที่ต้องสงสัย หมุนเวียนรหัสเข้าถึงระบบฐานข้อมูลใหม่ทั้งหมด และเปิดระบบเฝ้าระวังระดับลึก (Deep Audit)"
      : "Activated Traffic Throttling on API Gateways, blocked malicious attacker IP ranges, rotated database credentials, and enabled granular telemetry log collection."
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const locale = language === "th" ? "th-TH" : "en-US";
  const affectedCount = incident.affectedRows.toLocaleString(locale);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

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
                <Badge variant="secondary" className="text-[9px] uppercase tracking-wide px-1.5 h-4.5">
                  {language === "th" ? "ห้องประกอบรายงาน" : "Workspace Draft"}
                </Badge>
              </div>
              <h1 className="text-sm font-bold text-foreground mt-0.5">
                {language === "th" ? "จัดการรายงานอุบัติการณ์ยื่น สคส." : "Compose Regulatory Breach Report"}
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
              disabled={isSubmitting || submitSuccess}
              className="text-xs h-8 px-3 gap-1.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer font-bold disabled:bg-muted disabled:text-muted-foreground"
            >
              <Send className="size-3.5" />
              <span>{isSubmitting ? (language === "th" ? "กำลังส่ง..." : "Submitting...") : (language === "th" ? "ลงชื่อ & ยื่นส่ง สคส." : "Sign & Submit to PDPC")}</span>
            </Button>
          </div>
        </div>

        {/* Workspace Body Split Pane */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-muted/20">
          {/* Left Pane: Editable Fields Form */}
          <div className="w-full lg:w-[450px] border-r bg-card flex flex-col overflow-y-auto shrink-0 border-b lg:border-b-0">
            <div className="p-4 border-b bg-muted/10">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="size-3.5 text-primary" />
                {language === "th" ? "แบบฟอร์มรายละเอียดรายงาน" : "Composition Parameters"}
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {language === "th" ? "กรอกข้อมูลเพิ่มเพื่อจัดทำเอกสารความปลอดภัยตาม พ.ร.บ." : "Fill details to finalize the official notification template."}
              </p>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {/* Field 1: DPO Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{language === "th" ? "ชื่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" : "Data Protection Officer (DPO)"}</Label>
                <Input
                  value={dpoName}
                  onChange={(e) => setDpoName(e.target.value)}
                  placeholder="DPO Name"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              {/* Field 2: DPO License */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{language === "th" ? "เลขทะเบียนใบวิชาชีพ/ใบรับรองการขึ้นทะเบียน DPO" : "DPO License/Certification ID"}</Label>
                <Input
                  value={dpoLicense}
                  onChange={(e) => setDpoLicense(e.target.value)}
                  placeholder="DPO ID"
                  className="text-xs h-9 rounded-lg font-mono"
                />
              </div>

              {/* Field 3: Containment details */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "มาตรการแก้ไขและบรรเทาความเสียหายในทันที" : "Immediate Containment & Remediation"}
                </Label>
                <Textarea
                  value={containmentDetails}
                  onChange={(e) => setContainmentDetails(e.target.value)}
                  rows={5}
                  className="text-xs rounded-lg resize-none leading-relaxed"
                  placeholder="Remediation steps taken..."
                />
                <p className="text-[9px] text-muted-foreground leading-snug">
                  {language === "th" ? "* จะระบุมาตรการนี้เพื่อแสดงเจตนาความโปร่งใสต่อ สคส." : "* These steps show safety accountability to regulators."}
                </p>
              </div>

              {/* Field 4: Additional notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">{language === "th" ? "หมายเหตุเหตุการณ์เพิ่มเติม (ระบุหรือไม่ก็ได้)" : "Additional Notes (Optional)"}</Label>
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                  className="text-xs rounded-lg resize-none leading-relaxed"
                  placeholder="Enter any additional observations..."
                />
              </div>
            </div>
          </div>

          {/* Right Pane: Interactive PDF Sheet Preview */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <div className="w-full max-w-[760px] bg-white text-zinc-950 p-6 sm:p-8 border shadow-lg rounded-sm relative min-h-[960px] flex flex-col font-sans select-none border-zinc-200">
              {/* Submission Success Watermark Badge */}
              {submitSuccess && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 border-8 border-green-600 bg-white/90 text-green-700 font-extrabold text-2xl sm:text-4xl py-3 px-8 rounded-2xl shadow-xl z-20 flex flex-col items-center gap-2 tracking-widest border-double">
                  <CheckCircle2 className="size-8 sm:size-12 text-green-600" />
                  <span>{language === "th" ? "ยื่นเรื่องสำเร็จ" : "SUBMITTED"}</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-green-600/70 tracking-normal mt-1">PDPC-ACK-REG-9812</span>
                </div>
              )}

              {/* Document Header */}
              <div className="border-b-2 border-zinc-950 pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      {language === "th" ? "สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)" : "OFFICE OF THE PERSONAL DATA PROTECTION COMMISSION"}
                    </h3>
                    <h2 className="text-sm font-bold text-zinc-800">
                      {language === "th" ? "แบบรายงานแจ้งเหตุการละเมิดข้อมูลส่วนบุคคล (PDPA Breach Notification Form)" : "Personal Data Breach Assessment Report"}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {language === "th" ? "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มาตรา 37(4)" : "In compliance with Section 37(4) of the Personal Data Protection Act B.E. 2562"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block border border-zinc-900 px-2 py-0.5 text-[9px] font-mono font-bold bg-zinc-50">
                      {language === "th" ? "ร่างเอกสาร" : "DRAFT REPORT"}
                    </span>
                    <div className="text-[9px] font-mono text-zinc-400 mt-1">Ref: {incident.caseId}</div>
                  </div>
                </div>
              </div>

              {/* Document Body */}
              <div className="space-y-6 flex-1 text-xs">
                {/* Part 1: Data Controller Info */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "1. ข้อมูลผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller Details)" : "1. Data Controller Details"}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ชื่อองค์กร:" : "Organization:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{language === "th" ? "บริษัท โกลบอล โพรเทคชั่น กรุ๊ป จำกัด" : "Global Protection Group Co., Ltd."}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ผู้ประสานงานหลัก (DPO):" : "Designated DPO:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{dpoName || "-"}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "เลขทะเบียนใบขึ้นทะเบียน DPO:" : "DPO Registration ID:"}</span>
                      <p className="font-bold font-mono text-zinc-950 mt-0.5">{dpoLicense || "-"}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ประเภทธุรกิจ:" : "Industry Sector:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{language === "th" ? "การเงินและบริการไอทีดิจิทัล" : "Fintech & Digital Infrastructure"}</p>
                    </div>
                  </div>
                </div>

                {/* Part 2: Incident Details */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "2. รายละเอียดและพฤติการณ์อุบัติการณ์การละเมิด (Breach Manifestations)" : "2. Breach Manifestations"}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] mb-2">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "วันเวลาที่ตรวจพบเหตุการณ์:" : "Detected At:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{incident.detectedAt}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ช่องทางการรั่วไหล (Vector):" : "Breach Channel:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5">{language === "th" ? "สกัดกั้น API ด่านหน้าเกิดการข้าม Tenant" : "Cross-Tenant API Gate Exploitation"}</p>
                    </div>
                  </div>
                  <div className="text-[11px] space-y-1">
                    <span className="text-zinc-500">{language === "th" ? "คำอธิบายพฤติการณ์ภัยคุกคามโดยสังเขป:" : "Summary Threat Fingerprint Description:"}</span>
                    <p className="p-2.5 bg-zinc-50 border rounded-sm text-[10px] font-mono leading-relaxed text-zinc-800">
                      {language === "th"
                        ? `ตรวจพบแคมเปญโจมตีภายนอกกลุ่มแฮกเกอร์โจมตีสกัดข้อมูลข้ามเครือข่ายองค์กร ผ่าน API ด่านหน้า ดึงข้อมูลประวัติจำนวนรวมกว่า ${affectedCount} แถวบันทึก พฤติกรรมชี้เจาะช่องว่างสิทธิ์การเข้าถึงข้อมูลลูกค้าโดยไม่ผ่านขั้นตอนความปลอดภัย`
                        : `Mass external botnet campaign targets endpoint API gateways, downloading client records totaling ${affectedCount} items. Attack matches signature patterns tracked under national telemetry broadcast warnings.`}
                    </p>
                  </div>
                </div>

                {/* Part 3: Scope of Impact */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "3. ขอบเขตและหมวดหมู่ข้อมูลส่วนบุคคลที่รั่วไหล (Affected Categories & Scale)" : "3. Scope of Impact"}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "ประเภทข้อมูลที่รั่วไหล (PII Categories):" : "Compromised Data Subjects:"}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {incident.compromisedFields.map((f) => (
                          <span key={f.id} className="border border-zinc-400 bg-zinc-50 px-1 py-0.5 text-[9px] font-bold text-zinc-800 rounded-sm">
                            {t(f.labelKey)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-zinc-500">{language === "th" ? "จำนวนเจ้าของข้อมูลที่ประเมินขั้นแรก:" : "Estimated Impact Volume:"}</span>
                      <p className="font-bold text-zinc-950 mt-0.5 text-base">{affectedCount} <span className="text-[10px] text-zinc-500 font-normal">{language === "th" ? "รายชื่อลูกค้า" : "data subject records"}</span></p>
                    </div>
                  </div>
                </div>

                {/* Part 4: Mitigation and Containment */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1">
                    {language === "th" ? "4. มาตรการตอบสนองและป้องกันผลกระทบในทันที (Mitigation & Containment Measures)" : "4. Mitigation & Containment"}
                  </h4>
                  <div className="text-[11px]">
                    <p className="p-2.5 bg-zinc-50 border rounded-sm text-[10px] leading-relaxed text-zinc-800 min-h-[60px] whitespace-pre-wrap">
                      {containmentDetails || (language === "th" ? "— ยังไม่มีการระบุข้อมูล —" : "— No details provided —")}
                    </p>
                  </div>
                  {additionalNotes && (
                    <div className="text-[11px] mt-2 space-y-1">
                      <span className="text-zinc-500">{language === "th" ? "หมายเหตุเพิ่มเติม (DPO Remarks):" : "DPO Additional Remarks:"}</span>
                      <p className="p-2 bg-zinc-50 border rounded-sm text-[10px] text-zinc-800 leading-relaxed">{additionalNotes}</p>
                    </div>
                  )}
                </div>

                {/* Part 5: Signature */}
                <div className="pt-6 mt-6 flex justify-end">
                  <div className="w-[200px] border-t border-zinc-400 pt-2 text-center text-[10px] space-y-1">
                    <span className="text-zinc-400 font-mono tracking-wider italic block">{language === "th" ? "(ลายมือชื่อดิจิทัล)" : "(Digital Signature ID)"}</span>
                    <p className="font-bold text-zinc-950 mt-0.5 underline">{dpoName || "_________________________"}</p>
                    <p className="text-zinc-500 text-[9px]">{language === "th" ? "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" : "Data Protection Officer"}</p>
                    <p className="text-zinc-400 text-[8px] font-mono mt-0.5">{dpoLicense || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="border-t border-zinc-300 pt-3 mt-6 text-[8px] text-zinc-400 font-mono flex justify-between items-center shrink-0">
                <span>{language === "th" ? "ระบบตรวจจับเกราะป้องกัน PDPA — บันทึกความปลอดภัยยื่น สคส. ปลายทาง" : "PDPA Sentinel Defense System — Official Assessment Registry"}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Success Overlay Dialog */}
        <Dialog open={submitSuccess} onOpenChange={setSubmitSuccess}>
          <DialogContent className="border-t-4 border-t-green-600 sm:max-w-md">
            <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
              <CheckCircle2 className="size-12 text-green-600 animate-bounce" />
              <h2 className="text-base font-bold text-zinc-900">
                {language === "th" ? "ยื่นเรื่องรายงานอุบัติการณ์สำเร็จ!" : "Incident Report Successfully Filed!"}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                {language === "th"
                  ? "ร่างเอกสารรายงานได้ยื่นส่งระบบกลางของ สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) สำเร็จแล้ว ข้อมูลการทำรายงานถูกบันทึกลงคลังพยานหลักฐานแบบย้อนกลับไม่ได้ (Immutable Log)"
                  : "The official incident report draft has been digitally signed and submitted to the PDPC (สคส.) central API gateway registry. An immutable log entry has been written to the WORM telemetry system."}
              </p>
              <div className="bg-muted p-2 rounded-xl text-[10px] font-mono text-muted-foreground select-text border w-full">
                Ticket ID: PDPC-ACK-REG-9812-2026
              </div>
              <Button
                onClick={() => {
                  setSubmitSuccess(false);
                  router.push(`/crisis-room/${encodeURIComponent(incident.caseId)}`);
                }}
                className="w-full mt-2 font-bold h-9 text-xs"
              >
                {language === "th" ? "กลับไปหน้าห้องจัดการวิกฤต" : "Back to Crisis Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Document Assistant */}
        <AiDocumentAssistant
          mode="breach-report"
          incidentTitle={incident.titleKey}
          affectedCount={affectedCount}
          detectedAt={incident.detectedAt}
          onInsert={(field, value) => {
            if (field === "containmentDetails") setContainmentDetails(value);
            if (field === "additionalNotes") setAdditionalNotes(value);
          }}
        />
      </main>
    </AppShell>
  );
}
