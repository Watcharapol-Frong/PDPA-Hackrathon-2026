"use client";

import { useState } from "react";
import { ArrowRight, CheckSquare, FileCheck2, ShieldCheck, AlertCircle } from "lucide-react";
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

export function ExemptionQueue({ queue, onApprove, onReject }: ExemptionQueueProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [detailCase, setDetailCase] = useState<ExemptionCase | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkReason, setBulkReason] = useState("");
  const [bulkNote, setBulkNote] = useState("");
  const [bulkConfirmed, setBulkConfirmed] = useState(false);
  const { t, tArray, language } = useTranslation();

  const bulkReasonOptions = tArray("bulkReasonOptions");
  const pendingCases = queue.filter((c) => c.status === "Pending");
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
    const isEn = language === "en";
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

  return (
    <Card className="h-full flex flex-col" size="sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight">{t("queueTitle")}</CardTitle>
            <CardDescription className="text-[11px] text-muted-foreground mt-0.5">
              {t("queueSub")}
            </CardDescription>
          </div>
          <Button
            onClick={() => setBulkOpen(true)}
            disabled={selected.length === 0}
            size="sm"
            className={cn(
              "shrink-0 font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-none",
              selected.length > 0
                ? "bg-brand-warning hover:bg-brand-warning/90 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            <CheckSquare className="size-3.5" />
            <span>{t("bulkApprove")}</span>
            {selected.length > 0 && (
              <span className="font-mono text-[10px] bg-white/20 px-1 rounded-sm ml-0.5">
                {selected.length}
              </span>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-0 pt-0">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <ShieldCheck className="size-8 text-brand-success" />
            <p className="font-semibold text-sm">{t("queueCleared")}</p>
            <p className="text-xs text-muted-foreground">
              {t("queueClearedSub")}
            </p>
          </div>
        ) : (
          <div className="max-h-[385px] overflow-y-auto relative border-b">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="w-12 px-4 sticky top-0 bg-card z-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleAll}
                      aria-label={t("tableSelectAll")}
                    />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableCaseId")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableDetectedAt")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableFields")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{t("tableMitigation")}</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 sticky top-0 bg-card z-10">{language === "en" ? "Status" : "สถานะ"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((c) => {
                  const isSelected = selected.includes(c.id);
                  const isPending = c.status === "Pending";
                  const isRejected = c.status === "Rejected";
                  return (
                    <TableRow
                      key={c.id}
                      onClick={() => setDetailCase(c)}
                      tabIndex={0}
                      aria-label={`Open details for case ${c.id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDetailCase(c);
                        }
                      }}
                      className={cn(
                        "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary transition-all duration-200",
                        isRejected && "bg-red-50/45 dark:bg-red-950/10 hover:bg-red-50/60 dark:hover:bg-red-950/20 border-l-[3px] border-l-red-500",
                        isSelected && "bg-primary/5 hover:bg-primary/10",
                      )}
                    >
                      <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          disabled={!isPending}
                          onCheckedChange={() => toggleOne(c.id)}
                          aria-label={`${t("tableSelectCase")} ${c.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{c.id}</TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {c.detectedAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.fieldsInvolved.map((f) => (
                            <Badge key={f} variant="secondary" className="font-mono text-[9px] h-4.5 py-0 px-1 font-normal">
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {c.mitigation}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getStatusBadge(c.status)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Action Flow A — รายละเอียดเคสรายตัว (Progressive Disclosure Level 2) */}
      <Dialog open={detailCase !== null} onOpenChange={(open) => !open && setDetailCase(null)}>
        <DialogContent className="sm:max-w-2xl border-none max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg">
          {detailCase && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm font-semibold tracking-tight">{t("detailTitle")} {detailCase.id}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {t("detailSub")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t("rawSample")}
                  </div>
                  <code className="block bg-muted rounded-xl px-3 py-2.5 text-xs font-mono break-all leading-normal">
                    {detailCase.maskedSample}
                  </code>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t("scoreBreakdown")}
                  </div>
                  <div className="border rounded-xl divide-y overflow-hidden">
                    {detailCase.scoreFactors.map((f) => (
                      <div
                        key={f.label}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-2 gap-1 sm:gap-4 text-xs"
                      >
                        <span className="text-muted-foreground">{f.label}</span>
                        <span className="font-semibold sm:text-right">{f.value}</span>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-2 gap-1 sm:gap-4 bg-brand-success/5 text-xs">
                      <span className="font-semibold text-brand-success">{t("evaluationResult")}</span>
                      <span className="font-semibold text-brand-success sm:text-right">
                        {t("evaluationValue")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => approveSingle(detailCase)}
                    className="bg-brand-success hover:bg-brand-success/90 text-white font-semibold h-10 text-xs rounded-xl cursor-pointer w-full"
                  >
                    <FileCheck2 className="size-4" />
                    <span>{t("approveSingleBtn")}</span>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => rejectSingle(detailCase)}
                    className="h-10 text-xs rounded-xl cursor-pointer w-full"
                  >
                    <AlertCircle className="size-4" />
                    <span>{t("rejectSingleBtn")}</span>
                  </Button>
                </div>

                <div className="text-right">
                  <Button variant="link" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    <span>{t("deepAnalyseLink")}</span>
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Flow B — Friction Gate ยืนยันปิดคดีแบบกลุ่ม */}
      <Dialog open={bulkOpen} onOpenChange={(open) => !open && resetBulk()}>
        <DialogContent className="border-none max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold tracking-tight text-brand-warning">
              {t("bulkConfirmTitle").replace("{count}", selected.length.toString())}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("bulkConfirmSub")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {t("legalReasonLabel")} <span className="text-destructive">*</span>
              </Label>
              <Select value={bulkReason} onValueChange={setBulkReason}>
                <SelectTrigger className="w-full h-9 text-xs rounded-xl">
                  <SelectValue placeholder={t("legalReasonPlaceholder")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {bulkReasonOptions.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bulk-note" className="text-xs font-semibold">
                {t("additionalNoteLabel")} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="bulk-note"
                value={bulkNote}
                onChange={(e) => setBulkNote(e.target.value)}
                rows={2}
                placeholder={t("additionalNotePlaceholder")}
                className="resize-none rounded-xl text-xs"
              />
            </div>

            <Label className="flex items-start gap-3 cursor-pointer bg-muted/40 border rounded-xl p-3 font-normal">
              <Checkbox
                checked={bulkConfirmed}
                onCheckedChange={(v) => setBulkConfirmed(v === true)}
                className="mt-0.5 shrink-0"
              />
              <span className="text-[11px] text-muted-foreground leading-relaxed">
                {t("bulkConfirmCheckbox")}
              </span>
            </Label>

            <Button
              onClick={submitBulk}
              disabled={!canBulkSubmit}
              className="w-full bg-brand-warning hover:bg-brand-warning/90 text-white font-semibold h-10 text-xs rounded-xl cursor-pointer"
            >
              <span>{t("bulkConfirmSubmit")}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
