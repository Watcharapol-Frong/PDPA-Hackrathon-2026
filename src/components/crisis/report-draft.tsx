"use client";

import { Download, FileText, Info, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/LanguageContext";

interface ReportDraftProps {
  affectedRows: number;
  detectedAt: string;
}

export function ReportDraft({ affectedRows, detectedAt }: ReportDraftProps) {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col gap-3 py-1">
      <div className="flex justify-between items-center bg-muted/40 p-2.5 rounded-xl border border-border/80">
        <span className="text-xs text-muted-foreground">{t("reportSub")}</span>
        <Badge
          variant="secondary"
          className="text-[9px] font-mono font-bold uppercase h-5 py-0 px-1.5"
        >
          {t("reportStatusDraft")}
        </Badge>
      </div>
        {/* ฟิลด์ที่ AI ดึงข้อมูลมาเติมให้ (Data Extraction) */}
        <div className="rounded-xl border divide-y overflow-hidden">
          <ReportRow label={t("reportFieldOrg")} value={t("companyName")} />
          <ReportRow label={t("reportFieldCategory")} value={t("reportCategoryValue")} danger />
          <ReportRow
            label={t("reportFieldVolume")}
            value={`${affectedRows.toLocaleString(language === "th" ? "th-TH" : "en-US")} ${t("blastRowsUnit")}`}
          />
          <ReportRow label={t("reportFieldAwareness")} value={detectedAt} mono />
        </div>

        {/* Strict Validation Block — ห้าม One-Click Send */}
        <div className="flex gap-2 rounded-xl bg-muted/60 border p-2.5">
          <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            {t("reportDisclaimer")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button variant="outline" size="sm" className="flex-1 font-semibold text-xs h-9 min-h-9">
            <Download className="size-3.5" />
            {t("reportDownloadBtn")}
          </Button>
          <Button size="sm" className="flex-1 font-bold text-xs h-9 min-h-9">
            <Sparkles className="size-3.5" />
            {t("reportReviewBtn")}
          </Button>
        </div>
    </div>
  );
}

function ReportRow({
  label,
  value,
  mono = false,
  danger = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4 px-3 py-2">
      <span className="text-[11px] text-muted-foreground shrink-0">{label}</span>
      <span
        className={`text-[11px] font-semibold sm:text-right break-words ${mono ? "font-mono" : ""} ${
          danger ? "text-destructive" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
