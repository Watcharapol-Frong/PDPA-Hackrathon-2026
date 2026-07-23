"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, CheckCircle2, PenTool, ShieldAlert, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppState } from "@/lib/AppStateContext";
import { useTranslation } from "@/lib/LanguageContext";
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

/**
 * Form 2 — Customer Warning & Remedy Letter
 * บังคับเฉพาะเคส State 3 (high_risk): ต้องแจ้งทั้ง สคส. (Form 1) และเจ้าของข้อมูล (Form 2)
 * ก่อนจะปิดคดีได้ — ดู canCloseCase ใน AppStateContext.tsx
 */
export default function NoticeWorkspacePage() {
  const params = useParams<{ caseId: string }>();
  const router = useRouter();
  const { language } = useTranslation();
  const { getIncident, fileDocument, documentsFor, canCloseCase, resolveIncident } = useAppState();
  const caseId = decodeURIComponent(params.caseId);
  const incident = getIncident(caseId);
  const alreadySent = documentsFor(caseId).dataSubjectNotice;

  const [remedyMeasures, setRemedyMeasures] = useState(
    language === "th"
      ? "ทางบริษัทจะดำเนินการเปลี่ยนรหัสผ่านให้ท่านโดยอัตโนมัติ เปิดบริการเฝ้าระวังการใช้ข้อมูลส่วนบุคคลผิดปกติฟรีเป็นเวลา 12 เดือน และจัดตั้งศูนย์ให้คำปรึกษาเฉพาะกิจสำหรับผู้ได้รับผลกระทบ"
      : "We are resetting affected account credentials automatically, providing 12 months of complimentary identity-monitoring service, and opening a dedicated support hotline for affected individuals."
  );
  const [hotlineContact, setHotlineContact] = useState("1800-XXX-XXX (24 ชม.) · privacy@company.co.th");
  const [certified, setCertified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!incident) {
    return (
      <AppShell alertActive guardEnabled={false}>
        <main className="flex-1 p-4 max-w-[1400px] w-full mx-auto flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8">
            <ShieldAlert className="size-10 text-destructive mx-auto mb-3" />
            <p className="font-bold">{language === "th" ? "ไม่พบเคสนี้" : "Incident not found"}</p>
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
  const canSubmit = certified && !alreadySent && !submitSuccess;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      fileDocument(caseId, "dataSubjectNotice");
    }, 1500);
  };

  // ปิดคดีได้เฉพาะเมื่อเอกสารครบทั้ง 2 ฉบับ (Form 1 + Form 2) — ไม่งั้นกลับไปหน้าเคสเพื่อทำต่อ
  const acknowledgeAndClose = () => {
    setSubmitSuccess(false);
    if (canCloseCase(caseId)) {
      resolveIncident(caseId);
      router.push("/crisis-room");
    } else {
      router.push(`/crisis-room/${encodeURIComponent(caseId)}`);
    }
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
                  {language === "th" ? "ห้องประกอบจดหมาย" : "Workspace Draft"}
                </Badge>
              </div>
              <h1 className="text-sm font-bold text-foreground mt-0.5">
                {language === "th" ? "จัดทำจดหมายแจ้งเตือนและเยียวยาประชาชน (Form 2)" : "Compose Customer Warning & Remedy Letter"}
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
              className="text-xs h-8 px-3 gap-1.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer font-bold disabled:bg-muted disabled:text-muted-foreground"
            >
              <Send className="size-3.5" />
              <span>
                {alreadySent
                  ? (language === "th" ? "ส่งแล้ว" : "Already sent")
                  : isSubmitting
                    ? (language === "th" ? "กำลังส่ง..." : "Submitting...")
                    : (language === "th" ? "ลงชื่อ & ส่งจดหมาย" : "Sign & Send Notice")}
              </span>
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
                {language === "th" ? "แบบฟอร์มมาตรการเยียวยา" : "Remedy Parameters"}
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {language === "th"
                  ? "บังคับตามมาตรา 37(4) เนื่องจากข้อมูลอ่อนไหวหลุดสู่สาธารณะ ต้องแจ้งเจ้าของข้อมูลควบคู่กับ สคส."
                  : "Required under Section 37(4) — sensitive data exposure means data subjects must be notified alongside PDPC."}
              </p>
            </div>

            <div className="p-4 space-y-4 flex-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "มาตรการเยียวยาที่เสนอให้ผู้ได้รับผลกระทบ" : "Remedy measures offered"}
                </Label>
                <Textarea
                  value={remedyMeasures}
                  onChange={(e) => setRemedyMeasures(e.target.value)}
                  rows={6}
                  className="text-xs rounded-lg resize-none leading-relaxed"
                  placeholder="Remedy measures..."
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  {language === "th" ? "ช่องทางติดต่อ/สายด่วนสำหรับสอบถาม" : "Support hotline / contact channel"}
                </Label>
                <Input
                  value={hotlineContact}
                  onChange={(e) => setHotlineContact(e.target.value)}
                  placeholder="Hotline"
                  className="text-xs h-9 rounded-lg"
                />
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="notice-certify"
                    checked={certified}
                    onCheckedChange={(v) => setCertified(v === true)}
                    disabled={alreadySent}
                    className="mt-0.5"
                  />
                  <Label htmlFor="notice-certify" className="text-[11px] leading-snug font-normal text-muted-foreground">
                    {language === "th"
                      ? "ฉันตรวจทานเนื้อหาจดหมายฉบับนี้แล้วและยืนยันว่าน้ำเสียงเหมาะสม ไม่ก่อความตื่นตระหนกเกินจำเป็น พร้อมส่งถึงผู้ได้รับผลกระทบ"
                      : "I have reviewed this letter, confirm the tone is appropriate and non-alarmist, and am ready to send it to affected individuals."}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Pane: Letter Preview */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center items-start">
            <div className="w-full max-w-[760px] bg-white text-zinc-950 p-6 sm:p-8 border shadow-lg rounded-sm relative min-h-[720px] flex flex-col font-sans select-none border-zinc-200">
              {submitSuccess && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 border-8 border-green-600 bg-white/90 text-green-700 font-extrabold text-2xl sm:text-4xl py-3 px-8 rounded-2xl shadow-xl z-20 flex flex-col items-center gap-2 tracking-widest border-double">
                  <CheckCircle2 className="size-8 sm:size-12 text-green-600" />
                  <span>{language === "th" ? "ส่งแล้ว" : "SENT"}</span>
                </div>
              )}

              <div className="border-b-2 border-zinc-950 pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      {language === "th" ? "แจ้งเตือนเหตุการละเมิดข้อมูลส่วนบุคคล" : "PERSONAL DATA BREACH NOTICE"}
                    </h3>
                    <h2 className="text-sm font-bold text-zinc-800">
                      {language === "th" ? "จดหมายแจ้งเตือนและมาตรการเยียวยาถึงท่านผู้ใช้บริการ" : "Customer Warning & Remedy Letter"}
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {language === "th" ? "ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 มาตรา 37(4)" : "In compliance with Section 37(4) of the Personal Data Protection Act B.E. 2562"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block border border-zinc-900 px-2 py-0.5 text-[9px] font-mono font-bold bg-zinc-50">
                      {language === "th" ? "ร่างเอกสาร" : "DRAFT"}
                    </span>
                    <div className="text-[9px] font-mono text-zinc-400 mt-1">Ref: {incident.caseId}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex-1 text-xs">
                <p className="text-[11px] leading-relaxed text-zinc-800">
                  {language === "th"
                    ? "เรียน ท่านผู้ใช้บริการที่ได้รับผลกระทบ,"
                    : "Dear Affected Customer,"}
                </p>

                <div className="space-y-2">
                  <p className="text-[11px] leading-relaxed text-zinc-800">
                    {language === "th"
                      ? `บริษัทขอแจ้งให้ทราบว่าตรวจพบเหตุการณ์ข้อมูลส่วนบุคคลรั่วไหลซึ่งอาจกระทบข้อมูลของท่าน จำนวนผู้ได้รับผลกระทบโดยประมาณ ${affectedCount} ราย เมื่อวันที่ ${incident.detectedAt} บริษัทให้ความสำคัญกับความปลอดภัยของข้อมูลท่านอย่างสูงสุด และขอเรียนแจ้งมาตรการเยียวยาดังนี้`
                      : `We are writing to inform you of a data security incident that may have affected your personal information. Approximately ${affectedCount} individuals were impacted, detected on ${incident.detectedAt}. We take the protection of your data extremely seriously and are taking the following remedial steps:`}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wide">
                    {language === "th" ? "มาตรการเยียวยา" : "Remedy measures"}
                  </span>
                  <p className="p-2.5 bg-zinc-50 border rounded-sm text-[10px] leading-relaxed text-zinc-800 whitespace-pre-wrap min-h-[80px]">
                    {remedyMeasures || (language === "th" ? "— ยังไม่มีการระบุข้อมูล —" : "— No details provided —")}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wide">
                    {language === "th" ? "ช่องทางติดต่อสอบถาม" : "Contact channel"}
                  </span>
                  <p className="p-2.5 bg-zinc-50 border rounded-sm text-[10px] leading-relaxed text-zinc-800">
                    {hotlineContact || "-"}
                  </p>
                </div>

                <p className="text-[11px] leading-relaxed text-zinc-800">
                  {language === "th"
                    ? "บริษัทขออภัยในความไม่สะดวกที่เกิดขึ้น และยืนยันเจตนารมณ์ในการดูแลข้อมูลส่วนบุคคลของท่านอย่างเต็มความสามารถ"
                    : "We sincerely apologize for any inconvenience and remain committed to protecting your personal data to the fullest extent possible."}
                </p>

                <div className="pt-6 mt-6 flex justify-end">
                  <div className="w-[200px] border-t border-zinc-400 pt-2 text-center text-[10px] space-y-1">
                    <span className="text-zinc-400 font-mono tracking-wider italic block">{language === "th" ? "(ลายมือชื่อดิจิทัล)" : "(Digital Signature ID)"}</span>
                    <p className="text-zinc-500 text-[9px]">{language === "th" ? "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)" : "Data Protection Officer"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-300 pt-3 mt-6 text-[8px] text-zinc-400 font-mono flex justify-between items-center shrink-0">
                <span>{language === "th" ? "ระบบตรวจจับเกราะป้องกัน PDPA — บันทึกความปลอดภัยแจ้งเตือนประชาชน" : "PDPA Sentinel Defense System — Customer Notice Registry"}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Success Overlay Dialog */}
        <Dialog open={submitSuccess} onOpenChange={(open) => !open && acknowledgeAndClose()}>
          <DialogContent className="border-t-4 border-t-green-600 sm:max-w-md">
            <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
              <Users className="size-12 text-green-600" />
              <h2 className="text-base font-bold text-zinc-900">
                {language === "th" ? "ส่งจดหมายแจ้งเตือนประชาชนสำเร็จ!" : "Notice Sent to Affected Individuals!"}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                {language === "th"
                  ? "จดหมายแจ้งเตือนและมาตรการเยียวยาถูกบันทึกลงคลังพยานหลักฐานแบบย้อนกลับไม่ได้ (Immutable Log) แล้ว"
                  : "The customer notice has been recorded in the immutable WORM evidence log."}
              </p>
              <Button
                onClick={acknowledgeAndClose}
                className="w-full mt-2 font-bold h-9 text-xs"
              >
                {language === "th" ? "กลับไปหน้าห้องจัดการวิกฤต" : "Back to Crisis Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </AppShell>
  );
}
