"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckSquare, FileCheck2, ShieldCheck, AlertCircle,
  Clock, Search, CheckCircle2, XCircle, Siren, ExternalLink,
  ClipboardList, ShieldAlert, FileWarning, BadgeCheck, ListFilter,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { ExemptionCase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/LanguageContext";

interface ExemptionQueueProps {
  queue: ExemptionCase[];
  onApprove: (ids: string[], reason: string) => void;
  onReject?: (ids: string[]) => void;
}

type FilterRisk = "ALL_RISK" | "High" | "Medium" | "Low";

export function ExemptionQueue({ queue, onApprove, onReject }: ExemptionQueueProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [detailCase, setDetailCase] = useState<ExemptionCase | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkReason, setBulkReason] = useState("");
  const [bulkNote, setBulkNote] = useState("");
  const [bulkConfirmed, setBulkConfirmed] = useState(false);
  const [verifiedDoc, setVerifiedDoc] = useState(false);
  const [riskFilter, setRiskFilter] = useState<FilterRisk>("ALL_RISK");
  const { t, tArray, language } = useTranslation();
  const isEn = language === "en";

  const bulkReasonOptions = tArray("bulkReasonOptions");

  /**
   * ป้ายต้องแสดง "ความเสี่ยงคงเหลือ" ซึ่งก็คือ legal state โดยตรง
   *
   * ห้ามเอา Mitigation Factor มาดันป้ายขึ้นเป็น Medium เพราะ State 1b แปลว่า
   * "มาตรการทำงานจนไม่เหลือความเสี่ยงต่อเจ้าของข้อมูลแล้ว" — ติดป้าย Medium
   * จะขัดกับข้อสรุปทางกฎหมายของตัวเอง ค่า M ไปแสดงในคอลัมน์มาตรการแทน
   */
  const getRiskLevel = (c: ExemptionCase): "High" | "Medium" | "Low" => {
    if (c.legalState === "3") return "High";
    if (c.legalState === "2") return "Medium";
    return "Low";
  };

  // Filtering Logic (Risk Level only)
  const filteredQueue = queue.filter((c) => {
    return riskFilter === "ALL_RISK" || getRiskLevel(c) === riskFilter;
  });

  const pendingCases = filteredQueue.filter((c) => c.status === "Pending");
  const allSelected = pendingCases.length > 0 && selected.length === pendingCases.length;
  const canBulkSubmit = bulkReason !== "" && bulkNote.trim() !== "" && bulkConfirmed;

  const toggleAll = () => setSelected(allSelected ? [] : pendingCases.map((c) => c.id));
  const toggleOne = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const resetBulk = () => {
    setBulkOpen(false);
    setBulkReason("");
    setBulkNote("");
    setBulkConfirmed(false);
  };

  const submitBulk = () => {
    onApprove(selected, bulkReason);
    setSelected([]);
    resetBulk();
  };

  const approveSingle = (c: ExemptionCase) => {
    onApprove([c.id], "Approved single case after verifying Score Breakdown");
    setSelected((s) => s.filter((x) => x !== c.id));
    setDetailCase(null);
  };

  const rejectSingle = (c: ExemptionCase) => {
    if (onReject) onReject([c.id]);
    setSelected((s) => s.filter((x) => x !== c.id));
    setDetailCase(null);
  };

  const getStatusBadge = (status: ExemptionCase["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 border border-amber-200/30 font-semibold text-[10px] rounded-lg h-5 py-0 px-2 leading-none shrink-0 shadow-none">
            {isEn ? "Awaiting Assessment" : "รอการประเมินยกเว้น"}
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 border border-emerald-200/30 font-semibold text-[10px] rounded-lg h-5 py-0 px-2 leading-none shrink-0 shadow-none">
            {isEn ? "Exemption Recorded" : "บันทึกข้อยกเว้นแล้ว (Form 5)"}
          </Badge>
        );
      case "Reviewing":
        return (
          <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/10 border border-blue-200/30 font-semibold text-[10px] rounded-lg h-5 py-0 px-2 leading-none shrink-0 shadow-none">
            {isEn ? "Under Investigation" : "กำลังตรวจสอบเชิงลึก"}
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 border border-destructive/20 font-semibold text-[10px] rounded-lg h-5 py-0 px-2 leading-none shrink-0 shadow-none">
            {isEn ? "Breach Escalated (72h)" : "ต้องแจ้ง สคส. ด่วน (72 ชม.)"}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRiskBadge = (risk: "High" | "Medium" | "Low") => {
    switch (risk) {
      case "High":
        return (
          <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/10 border border-red-200/20 font-bold text-[9px] rounded-md h-4.5 px-1.5 leading-none shrink-0 shadow-none">
            {isEn ? "High Risk" : "เสี่ยงสูง"}
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 border border-amber-200/20 font-bold text-[9px] rounded-md h-4.5 px-1.5 leading-none shrink-0 shadow-none">
            {isEn ? "Risk Present" : "มีความเสี่ยง"}
          </Badge>
        );
      case "Low":
        return (
          <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/10 border border-slate-200/20 font-bold text-[9px] rounded-md h-4.5 px-1.5 leading-none shrink-0 shadow-none">
            {isEn ? "Exempt" : "เข้าข่ายยกเว้น"}
          </Badge>
        );
    }
  };

  const ScoreTable = ({ c }: { c: ExemptionCase }) => (
    <div className="border rounded-xl divide-y overflow-hidden">
      {c.scoreFactors.map((f) => (
        <div key={f.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-2 gap-1 text-xs">
          <span className="text-muted-foreground">{f.label}</span>
          <span className="font-semibold sm:text-right">{f.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="h-full flex flex-col" size="sm">
      <CardHeader className="pb-3 border-b bg-muted/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight">{t("queueTitle")}</CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">{t("queueSub")}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Risk Level Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                <AlertTriangle className="size-3 text-amber-500" />
                {isEn ? "Legal State:" : "สถานะกฎหมาย:"}
              </span>
              <Select value={riskFilter} onValueChange={(val) => setRiskFilter(val as FilterRisk)}>
                <SelectTrigger className="w-[125px] h-7 text-[10px] font-bold rounded-lg px-2 shadow-none bg-card">
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="ALL_RISK" className="text-[10px] font-semibold">{isEn ? "All Risks" : "ทุกระดับความเสี่ยง"}</SelectItem>
                  <SelectItem value="High" className="text-[10px] font-semibold text-red-600">🔴 {isEn ? "High Risk" : "เสี่ยงสูง"}</SelectItem>
                  <SelectItem value="Medium" className="text-[10px] font-semibold text-amber-600">🟡 {isEn ? "Medium Risk" : "เสี่ยงปานกลาง"}</SelectItem>
                  <SelectItem value="Low" className="text-[10px] font-semibold text-slate-600">🟢 {isEn ? "Low Risk" : "เสี่ยงต่ำ"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setBulkOpen(true)}
              disabled={selected.length === 0}
              size="sm"
              className={cn(
                "shrink-0 font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-none",
                selected.length > 0 ? "bg-brand-warning hover:bg-brand-warning/90 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              <CheckSquare className="size-3.5" />
              <span>{t("bulkApprove")}</span>
              {selected.length > 0 && (
                <span className="font-mono text-[10px] bg-white/20 px-1 rounded-sm ml-0.5">{selected.length}</span>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-0 pt-0">
        {filteredQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ShieldCheck className="size-8 text-muted-foreground/30" />
            <p className="font-semibold text-xs text-muted-foreground">
              {isEn ? "No records match these criteria" : "ไม่มีเคสที่ตรงตามเงื่อนไขการค้นหา"}
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              {isEn ? "Try adjusting the status or risk level filters above." : "ลองเปลี่ยนตัวกรองสถานะหรือระดับความเสี่ยงด้านบน"}
            </p>
          </div>
        ) : (
          <div className="max-h-[385px] overflow-y-auto relative border-b">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="w-12 px-4 sticky top-0 bg-card z-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label={t("tableSelectAll")} />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableCaseId")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{isEn ? "Legal State" : "สถานะกฎหมาย"}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableDetectedAt")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableFields")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableMitigation")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{isEn ? "Status" : "สถานะ"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueue.map((c) => {
                  const isSelected = selected.includes(c.id);
                  const isPending = c.status === "Pending";
                  const isRejected = c.status === "Rejected";
                  const riskLevel = getRiskLevel(c);
                  return (
                    <TableRow
                      key={c.id}
                      onClick={() => setDetailCase(c)}
                      tabIndex={0}
                      aria-label={`Open details for case ${c.id}`}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDetailCase(c); } }}
                      className={cn(
                        "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200",
                        isRejected && "bg-red-50/45 dark:bg-red-950/10 hover:bg-red-50/60 dark:hover:bg-red-950/20 border-l-[3px] border-l-red-500",
                        isSelected && "bg-primary/5 hover:bg-primary/10",
                      )}
                    >
                      <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} disabled={!isPending} onCheckedChange={() => toggleOne(c.id)} aria-label={`${t("tableSelectCase")} ${c.id}`} />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{c.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{getRiskBadge(riskLevel)}</TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">{c.detectedAt}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.fieldsInvolved.map((f) => (
                            <Badge key={f} variant="secondary" className="font-mono text-[9px] h-4.5 py-0 px-1 font-normal">{f}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {c.mitigation}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{getStatusBadge(c.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* ════════════════════════════════════════════════════════
          DIALOG 1 — PENDING: ประเมินและตัดสิน (Action Required)
          Theme: Amber · DPO ต้องตรวจสอบ Form 5 ด้านข้างและอนุมัติ
          ════════════════════════════════════════════════════════ */}
      <Dialog open={detailCase?.status === "Pending"} onOpenChange={(open) => {
        if (!open) {
          setDetailCase(null);
          setVerifiedDoc(false);
        }
      }}>
        <DialogContent className="sm:max-w-5xl border-t-4 border-t-amber-500 max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg">
          {detailCase && (
            <>
              <DialogHeader className="border-b pb-3 mb-2">
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <ClipboardList className="size-4 text-amber-500 shrink-0" />
                  {isEn ? "Exemption Assessment Required" : "ต้องประเมินและอนุมัติบันทึกข้อยกเว้น"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {isEn
                    ? "Review the draft Form 5 Exemption document before deciding to record this exception."
                    : "กรุณาตรวจทานร่างบันทึกข้อยกเว้น (Form 5) ด้านขวาก่อนพิจารณากดอนุมัติลงทะเบียนข้อยกเว้น"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
                {/* Left side: Metrics & Actions */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isEn ? "Risk Rating" : "ระดับความเสี่ยง"}</span>
                    {getRiskBadge(getRiskLevel(detailCase))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{t("rawSample")}</p>
                    <code className="block bg-muted rounded-xl px-3 py-2.5 text-[11px] font-mono break-all leading-normal">{detailCase.maskedSample}</code>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{t("scoreBreakdown")}</p>
                    <ScoreTable c={detailCase} />
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                    <Clock className="size-4 shrink-0 mt-0.5 text-amber-600" />
                    <span><span className="font-bold">{isEn ? "Mitigation: " : "มาตรการ: "}</span>{detailCase.mitigation}</span>
                  </div>

                  {/* Verification Checkbox */}
                  <Label className="flex items-start gap-2.5 cursor-pointer font-normal bg-muted/30 border rounded-xl p-3">
                    <Checkbox
                      checked={verifiedDoc}
                      onCheckedChange={(v) => setVerifiedDoc(v === true)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-[11px] leading-relaxed">
                      {isEn
                        ? "I have thoroughly reviewed the draft Form 5 document and confirmed that the risk levels justify notification exemption."
                        : "ข้าพเจ้าได้ตรวจสอบร่างเอกสาร Form 5 ด้านข้างครบถ้วนแล้ว และขอยืนยันว่าความเสี่ยงอยู่ในระดับต่ำที่สามารถยกเว้นการแจ้งเหตุได้ตามกฎหมาย"}
                    </span>
                  </Label>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Button
                      onClick={() => {
                        approveSingle(detailCase);
                        setVerifiedDoc(false);
                      }}
                      disabled={!verifiedDoc}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-auto py-2.5 px-3 text-[11px] leading-snug rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-normal text-center break-words"
                    >
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>{t("approveSingleBtn")}</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        rejectSingle(detailCase);
                        setVerifiedDoc(false);
                      }}
                      className="h-auto py-2.5 px-3 text-[11px] leading-snug rounded-xl cursor-pointer font-bold flex items-center justify-center gap-1.5 whitespace-normal text-center break-words"
                    >
                      <XCircle className="size-4 shrink-0" />
                      <span>{t("rejectSingleBtn")}</span>
                    </Button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground">
                    {isEn ? "Approving records Form 5 exemption. Rejecting escalates as a 72-hour breach notification obligation." : "การอนุมัติบันทึก Form 5 · การปฏิเสธเพิ่มภาระแจ้ง สคส. ภายใน 72 ชม."}
                  </p>
                </div>

                {/* Right side: Draft Form 5 Document Preview */}
                <div className="lg:col-span-7 bg-muted/30 dark:bg-muted/10 p-4 rounded-2xl flex justify-center items-start overflow-y-auto max-h-[500px] border border-dashed">
                  <div className="w-full bg-white text-zinc-950 p-6 border shadow-sm rounded-sm relative font-sans select-none border-zinc-200 text-[10px]">
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-dashed border-zinc-300 bg-white/95 text-zinc-400 font-extrabold text-2xl py-2 px-6 rounded-lg z-10 tracking-widest opacity-30">
                      {isEn ? "DRAFT EXEMPTION" : "ร่างข้อยกเว้น"}
                    </div>

                    {/* Logo/Header */}
                    <div className="border-b border-zinc-900 pb-2 mb-4">
                      <h3 className="font-extrabold text-[9px] uppercase tracking-wider text-zinc-900">
                        {isEn ? "FORM 5 — DATA BREACH EXEMPTION ASSESSMENT RECORD" : "แบบบันทึกผลการประเมินเพื่อข้อยกเว้นการแจ้งเหตุละเมิดข้อมูลส่วนบุคคล (FORM 5)"}
                      </h3>
                      <p className="text-[8px] text-zinc-500 mt-0.5">
                        {isEn ? "Under Section 37(4) of the Personal Data Protection Act B.E. 2562" : "ตามหลักเกณฑ์ มาตรา 37(4) แห่งพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Sect 1 */}
                      <div>
                        <h4 className="font-bold text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1.5 uppercase">
                          {isEn ? "1. Data Controller Info" : "1. ข้อมูลผู้ควบคุมข้อมูลส่วนบุคคล"}
                        </h4>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                          <div><span className="text-zinc-500">{isEn ? "Company Name:" : "ชื่อองค์กร:"}</span> <span className="font-semibold text-zinc-900">{isEn ? "Global Protection Group Co., Ltd." : "บริษัท โกลบอล โพรเทคชั่น กรุ๊ป จำกัด"}</span></div>
                          <div><span className="text-zinc-500">{isEn ? "Exemption ID:" : "รหัสอ้างอิงข้อยกเว้น:"}</span> <span className="font-mono font-semibold text-zinc-900">{detailCase.id}</span></div>
                          <div><span className="text-zinc-500">{isEn ? "Assess Date:" : "วันที่ตรวจพบประเมิน:"}</span> <span className="font-mono text-zinc-900">{detailCase.detectedAt}</span></div>
                        </div>
                      </div>

                      {/* Sect 2 */}
                      <div>
                        <h4 className="font-bold text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1.5 uppercase">
                          {isEn ? "2. Exposed Data & Mitigations" : "2. รายละเอียดทราฟฟิกข้อมูลและมาตรการควบคุม"}
                        </h4>
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-zinc-500">{isEn ? "Exposed Fields:" : "ฟิลด์ข้อมูลที่เกี่ยวข้อง:"}</span>{" "}
                            <span className="font-mono font-semibold text-zinc-900 bg-zinc-100 px-1 rounded-sm">{detailCase.fieldsInvolved.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">{isEn ? "Volume (Requests):" : "ปริมาณการเข้าถึง (รายการ):"}</span>{" "}
                            <span className="font-semibold text-zinc-900">{detailCase.requestVolume.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">{isEn ? "Technical Safeguards Active:" : "มาตรการรักษาความปลอดภัยที่ทำงานอยู่:"}</span>
                            <p className="font-semibold text-emerald-800 dark:text-emerald-700 bg-emerald-50 p-1.5 border border-emerald-100 rounded-sm mt-0.5 leading-relaxed">{detailCase.mitigation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Sect 3 */}
                      <div>
                        <h4 className="font-bold text-zinc-950 border-b border-zinc-200 pb-0.5 mb-1.5 uppercase">
                          {isEn ? "3. Exemption Qualification Analysis" : "3. ผลวิเคราะห์ความเข้าเกณฑ์ข้อยกเว้นการแจ้งเหตุ"}
                        </h4>
                        <div className="space-y-1.5 leading-relaxed">
                          <p>
                            {isEn
                              ? "The automated risk classifier evaluates that the security controls prevent likelihood of adverse impact. Exemption qualification is determined based on the following weights:"
                              : "จากการประเมินทางกฎหมายและเทคนิค พบว่ามาตรการป้องกันความปลอดภัยสามารถลดโอกาสที่จะเกิดผลกระทบเชิงลบได้อย่างมีนัยสำคัญ ข้อมูลสรุปตัวคูณความเสี่ยง:"}
                          </p>
                          <div className="bg-zinc-50 p-2 rounded border space-y-1">
                            {detailCase.scoreFactors.map((f, i) => (
                              <div key={i} className="flex justify-between font-mono text-[9px] text-zinc-700">
                                <span>- {f.label}:</span>
                                <span className="font-bold">{f.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Signature draft */}
                      <div className="pt-4 flex justify-end">
                        <div className="w-[180px] border-t border-dashed border-zinc-400 pt-1.5 text-center text-[9px] text-zinc-400">
                          <p className="italic">{isEn ? "(Unsigned Draft)" : "(ร่างแบบบันทึก ยังไม่ได้ลงนาม)"}</p>
                          <p className="font-bold text-zinc-800 mt-1">{isEn ? "Data Protection Officer" : "เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════
          DIALOG 2 — REVIEWING: กำลังตรวจสอบเชิงนิติ
          Theme: Blue · Forensic checklist + progress status
          ════════════════════════════════════════════════════════ */}
      <Dialog open={detailCase?.status === "Reviewing"} onOpenChange={(open) => !open && setDetailCase(null)}>
        <DialogContent className="sm:max-w-xl border-t-4 border-t-blue-500 max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg">
          {detailCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <Search className="size-4 text-blue-500 shrink-0" />
                  {isEn ? "Forensic Investigation In Progress" : "กำลังดำเนินการตรวจสอบเชิงนิติ"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {isEn
                    ? `Case ${detailCase.id} is under active digital forensic review. Pending final analyst sign-off before exemption can be assessed.`
                    : `เคส ${detailCase.id} อยู่ระหว่างการตรวจสอบเชิงนิติดิจิทัล รอผู้วิเคราะห์ลงนามรับรองก่อนประเมินข้อยกเว้น`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isEn ? "Risk Rating" : "ระดับความเสี่ยง"}</span>
                  {getRiskBadge(getRiskLevel(detailCase))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {isEn ? "Forensic Investigation Checklist" : "รายการตรวจสอบเชิงนิติ"}
                  </p>
                  <div className="space-y-2">
                    {[
                      { done: true,  en: "WORM log integrity verified",           th: "ตรวจสอบความสมบูรณ์ WORM Log แล้ว" },
                      { done: true,  en: "Exfiltration vector confirmed",          th: "ยืนยันเส้นทางการรั่วไหลข้อมูลแล้ว" },
                      { done: true,  en: "Affected field mapping completed",       th: "จัดทำ Mapping ฟิลด์ที่ได้รับผลกระทบแล้ว" },
                      { done: false, en: "Third-party access logs retrieved",      th: "ดึง Log การเข้าถึงจากบุคคลที่สามแล้ว" },
                      { done: false, en: "Analyst final sign-off",                 th: "ผู้วิเคราะห์ลงนามรับรองขั้นสุดท้าย" },
                    ].map((item, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs",
                        item.done ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                      )}>
                        {item.done ? <CheckCircle2 className="size-4 shrink-0 text-emerald-600" /> : <Clock className="size-4 shrink-0 text-muted-foreground" />}
                        <span className={item.done ? "font-semibold" : ""}>{isEn ? item.en : item.th}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{t("scoreBreakdown")}</p>
                  <ScoreTable c={detailCase} />
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                  <Search className="size-4 shrink-0 mt-0.5 text-blue-600" />
                  <span>{isEn ? "This case will move to Pending Assessment once the forensic analyst completes all checklist items and signs off." : "เคสนี้จะย้ายไปยัง 'รอการประเมิน' เมื่อผู้วิเคราะห์ดำเนินการครบและลงนาม"}</span>
                </div>
                <Button onClick={() => setDetailCase(null)} variant="outline" className="w-full h-9 text-xs rounded-xl font-semibold cursor-pointer">
                  {isEn ? "Close" : "ปิด"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════
          DIALOG 3 — APPROVED: ใบรับรองการยกเว้น (Form 5)
          Theme: Green · Certificate view + download
          ════════════════════════════════════════════════════════ */}
      <Dialog open={detailCase?.status === "Approved"} onOpenChange={(open) => !open && setDetailCase(null)}>
        <DialogContent className="sm:max-w-xl border-t-4 border-t-emerald-500 max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg">
          {detailCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="size-4 text-emerald-600 shrink-0" />
                  {isEn ? "Exemption Certificate — Form 5 Recorded" : "ใบรับรองการยกเว้น — บันทึก Form 5 แล้ว"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {isEn
                    ? `Case ${detailCase.id} has been granted a formal data breach notification exemption under PDPA Section 37(4).`
                    : `เคส ${detailCase.id} ได้รับการยกเว้นอย่างเป็นทางการภายใต้ พ.ร.บ. ม.37(4)`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isEn ? "Risk Rating" : "ระดับความเสี่ยง"}</span>
                  {getRiskBadge(getRiskLevel(detailCase))}
                </div>
                <div className="border border-emerald-200 dark:border-emerald-800/40 rounded-xl overflow-hidden">
                  <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-white text-xs font-extrabold uppercase tracking-widest">
                      {isEn ? "Form 5 — Official Exemption Record" : "Form 5 — บันทึกการยกเว้นอย่างเป็นทางการ"}
                    </span>
                    <CheckCircle2 className="size-4 text-white" />
                  </div>
                  <div className="divide-y text-xs">
                    {[
                      { label: isEn ? "Exemption Case ID" : "รหัสเคสยกเว้น",           value: detailCase.id,                                            mono: true },
                      { label: isEn ? "Legal Basis"       : "ฐานทางกฎหมาย",            value: isEn ? "PDPA §37(4)" : "พ.ร.บ. ม.37(4)",               mono: false },
                      { label: isEn ? "Detected At"       : "ตรวจพบเมื่อ",              value: detailCase.detectedAt,                                    mono: true },
                      { label: isEn ? "Affected Records"  : "จำนวนรายการ",              value: detailCase.requestVolume.toLocaleString(),               mono: false },
                      { label: isEn ? "Risk Classification": "ระดับความเสี่ยง",         value: isEn ? "Low — Exemption Justified" : "ต่ำ — ยกเว้นได้", mono: false },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center px-4 py-2">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className={cn("font-bold", row.mono && "font-mono")}>{row.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20">
                      <span className="text-muted-foreground text-xs">{isEn ? "PDPC Reference No." : "เลขอ้างอิง สคส."}</span>
                      <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400 text-xs">EX-PDPC-{detailCase.id.slice(-4)}-2026</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{t("scoreBreakdown")}</p>
                  <ScoreTable c={detailCase} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setDetailCase(null)} variant="outline" className="flex-1 h-9 text-xs rounded-xl font-semibold cursor-pointer">
                    {isEn ? "Close" : "ปิด"}
                  </Button>
                  <Button onClick={() => setDetailCase(null)} className="flex-1 h-9 text-xs rounded-xl font-bold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white">
                    <FileCheck2 className="size-3.5" />{isEn ? "Download Form 5 PDF" : "ดาวน์โหลด Form 5"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════
          DIALOG 4 — REJECTED: ภาระแจ้งเหตุ สคส. ภายใน 72 ชม.
          Theme: Red · Escalation alert + link to Crisis Room
          ════════════════════════════════════════════════════════ */}
      <Dialog open={detailCase?.status === "Rejected"} onOpenChange={(open) => !open && setDetailCase(null)}>
        <DialogContent className="sm:max-w-xl border-t-4 border-t-red-600 max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg">
          {detailCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="size-4 text-red-600 shrink-0" />
                  <span className="text-red-700 dark:text-red-400">
                    {isEn ? "Breach Escalation — Notification Required" : "ยกระดับเป็นการละเมิด — ต้องแจ้ง สคส."}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {isEn
                    ? `Case ${detailCase.id} did not qualify for exemption. This breach must be formally reported to PDPC (สคส.) within the 72-hour legal window.`
                    : `เคส ${detailCase.id} ไม่ผ่านเกณฑ์ข้อยกเว้น ต้องแจ้งต่อ สคส. ภายใน 72 ชั่วโมง`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{isEn ? "Risk Rating" : "ระดับความเสี่ยง"}</span>
                  {getRiskBadge(getRiskLevel(detailCase))}
                </div>
                {/* Urgency banner */}
                <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                  <Siren className="size-5 shrink-0 mt-0.5 text-red-600 animate-pulse" />
                  <div className="text-xs text-red-800 dark:text-red-300 space-y-1">
                    <p className="font-extrabold uppercase tracking-wide">
                      {isEn ? "72-Hour Notification Obligation Active" : "กรอบเวลาแจ้งเหตุ 72 ชั่วโมงกำลังนับถอยหลัง"}
                    </p>
                    <p>
                      {isEn
                        ? "Under PDPA Section 37(4), the data controller must file a formal breach notification with PDPC within 72 hours of detection. Failure may result in administrative fines."
                        : "ตาม พ.ร.บ. ม.37(4) ผู้ควบคุมข้อมูลต้องยื่นแจ้งเหตุต่อ สคส. ภายใน 72 ชั่วโมงหลังตรวจพบ การไม่แจ้งอาจถูกปรับทางปกครอง"}
                    </p>
                  </div>
                </div>

                {/* Why rejected */}
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {isEn ? "Reason Exemption Was Denied" : "เหตุผลที่ไม่ผ่านเกณฑ์ข้อยกเว้น"}
                  </p>
                  <ScoreTable c={detailCase} />
                </div>

                {/* Exposure summary */}
                <div className="border rounded-xl divide-y overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {isEn ? "Data Exposure Summary" : "สรุปขอบเขตข้อมูลที่ถูกเปิดเผย"}
                  </div>
                  <div className="flex justify-between px-4 py-2 text-xs">
                    <span className="text-muted-foreground">{isEn ? "Affected Fields" : "ฟิลด์ที่ได้รับผลกระทบ"}</span>
                    <span className="font-mono font-bold">{detailCase.fieldsInvolved.join(", ")}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-xs">
                    <span className="text-muted-foreground">{isEn ? "Records Exposed" : "จำนวนรายการ"}</span>
                    <span className="font-bold text-red-700 dark:text-red-400">{detailCase.requestVolume.toLocaleString()} records</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 text-xs">
                    <span className="text-muted-foreground">{isEn ? "Sample (Masked)" : "ตัวอย่าง (Masked)"}</span>
                    <code className="font-mono text-[10px]">{detailCase.maskedSample}</code>
                  </div>
                </div>

                {/* Required next actions */}
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {isEn ? "Required Next Actions" : "ขั้นตอนที่ต้องดำเนินการทันที"}
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { en: "Open Crisis Management Room for this incident",                   th: "เปิดห้องจัดการวิกฤตสำหรับเหตุการณ์นี้" },
                      { en: "Draft and file the breach notification report (สคส.)",           th: "ร่างและยื่นรายงานแจ้งเหตุละเมิดต่อ สคส." },
                      { en: "Notify affected data subjects if high-risk",                      th: "แจ้งเจ้าของข้อมูลที่ได้รับผลกระทบหากเสี่ยงสูง" },
                      { en: "Consider Emergency Grace Period Request if 72h is infeasible",   th: "พิจารณาคำร้องขอขยายเวลาฉุกเฉินหาก 72 ชม. ไม่เพียงพอ" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <FileWarning className="size-3.5 shrink-0 mt-0.5 text-red-500" />
                        <span>{isEn ? item.en : item.th}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button onClick={() => setDetailCase(null)} variant="outline" className="flex-1 h-9 text-xs rounded-xl font-semibold cursor-pointer">
                    {isEn ? "Close" : "ปิด"}
                  </Button>
                  <Button asChild className="flex-1 h-9 text-xs rounded-xl font-bold cursor-pointer bg-red-600 hover:bg-red-700 text-white">
                    <Link href="/crisis-room" onClick={() => setDetailCase(null)}>
                      <ExternalLink className="size-3.5" />
                      {isEn ? "Go to Crisis Room" : "ไปห้องจัดการวิกฤต"}
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════
          Bulk Approve Dialog (Action Flow B)
          ════════════════════════════════════════════════════════ */}
      <Dialog open={bulkOpen} onOpenChange={(open) => !open && resetBulk()}>
        <DialogContent className="border-none max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold tracking-tight text-brand-warning">
              {t("bulkConfirmTitle").replace("{count}", selected.length.toString())}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">{t("bulkConfirmSub")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t("legalReasonLabel")} <span className="text-destructive">*</span></Label>
              <Select value={bulkReason} onValueChange={setBulkReason}>
                <SelectTrigger className="w-full h-9 text-xs rounded-xl"><SelectValue placeholder={t("legalReasonPlaceholder")} /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  {bulkReasonOptions.map((r) => (<SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bulk-note" className="text-xs font-semibold">{t("additionalNoteLabel")} <span className="text-destructive">*</span></Label>
              <Textarea id="bulk-note" value={bulkNote} onChange={(e) => setBulkNote(e.target.value)} rows={2} placeholder={t("additionalNotePlaceholder")} className="resize-none rounded-xl text-xs" />
            </div>
            <Label className="flex items-start gap-3 cursor-pointer bg-muted/40 border rounded-xl p-3 font-normal">
              <Checkbox checked={bulkConfirmed} onCheckedChange={(v) => setBulkConfirmed(v === true)} className="mt-0.5 shrink-0" />
              <span className="text-[11px] text-muted-foreground leading-relaxed">{t("bulkConfirmCheckbox")}</span>
            </Label>
            <Button onClick={submitBulk} disabled={!canBulkSubmit} className="w-full bg-brand-warning hover:bg-brand-warning/90 text-white font-semibold h-10 text-xs rounded-xl cursor-pointer">
              {t("bulkConfirmSubmit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
