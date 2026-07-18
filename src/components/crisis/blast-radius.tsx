"use client";

import { useState } from "react";
import { AlertOctagon, ArrowRight, Database, MousePointerClick } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/LanguageContext";
import type { CompromisedField } from "@/lib/types";

interface BlastRadiusProps {
  caseId: string;
  detectedAt: string;
  severity: string;
  affectedRows: number;
  fields: CompromisedField[];
}

export function BlastRadius({ caseId, detectedAt, severity, affectedRows, fields }: BlastRadiusProps) {
  const [selected, setSelected] = useState<CompromisedField | null>(null);
  const { t, language } = useTranslation();
  const isHighRisk = severity === "high_risk";

  return (
    <Card size="sm" className="h-full border border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-1.5 text-foreground">
          <AlertOctagon className="size-4 text-destructive shrink-0" />
          {t("blastHeaderTitle")}
        </CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          {t("blastSub")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Column 1 — Case Metadata */}
          <div className="flex flex-col gap-2 justify-center">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                {t("crisisCaseId")}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-foreground">{caseId}</span>
                <Badge
                  className={
                    isHighRisk
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive font-mono text-[8px] h-4 py-0 px-1"
                      : "bg-brand-warning text-white hover:bg-brand-warning font-mono text-[8px] h-4 py-0 px-1"
                  }
                >
                  {isHighRisk ? "HIGH" : "WARNING"}
                </Badge>
              </div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                {t("crisisDetectedAt")}
              </span>
              <span className="font-mono text-[11px] font-semibold text-foreground">{detectedAt}</span>
            </div>
          </div>

          {/* Column 2 — Impact Volume */}
          <div className="flex flex-col justify-center md:border-l md:pl-6">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("blastAffectedRows")}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                {affectedRows.toLocaleString(language === "th" ? "th-TH" : "en-US")}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {t("blastRowsUnit")}
              </span>
            </div>
          </div>

          {/* Column 3 — Compromised PII Labels */}
          <div className="md:border-l md:pl-6">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("blastCompromisedFields")}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-muted hover:bg-muted/80 border text-foreground/90 px-2 py-0.5 text-[10px] font-semibold transition cursor-pointer min-h-6 focus-visible:outline-2 focus-visible:outline-destructive"
                  aria-label={`${t("schemaModalTitle")} — ${t(f.labelKey)}`}
                >
                  {t(f.labelKey)}
                  <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            <p className="flex items-center gap-1 text-[9px] text-muted-foreground mt-1.5">
              <MousePointerClick className="size-3 shrink-0" />
              {t("blastClickHint")}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Crisis Action Flow A — Progressive Disclosure Level 2: Read-only schema */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg border-t-4 border-t-destructive max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Database className="size-4 text-destructive shrink-0" />
                  {t("schemaModalTitle")}
                </DialogTitle>
                <DialogDescription>{t("schemaModalSub")}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="border rounded-xl divide-y overflow-hidden">
                  <SchemaRow label={t("schemaColumn")} value={selected.column} mono highlight />
                  <SchemaRow label={t("schemaTable")} value={selected.table} mono />
                  <SchemaRow label={t("schemaDataType")} value={selected.dataType} mono />
                  <SchemaRow label={t("schemaSensitivity")} value={t(selected.sensitivity)} />
                  <SchemaRow
                    label={t("schemaAffected")}
                    value={`${selected.affectedRows.toLocaleString(
                      language === "th" ? "th-TH" : "en-US",
                    )} ${t("blastRowsUnit")}`}
                  />
                  <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-destructive/5">
                    <span className="text-xs text-muted-foreground">{t("schemaLeakStatus")}</span>
                    <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive text-[10px] font-bold">
                      {t("schemaLeaked")}
                    </Badge>
                  </div>
                </div>

                {/* Progressive Disclosure Level 3 — ข้ามไปหน้าหลักฐาน */}
                <div className="text-right">
                  <Button variant="link" size="sm" className="text-xs">
                    {t("schemaAuditLink")}
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function SchemaRow({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 px-4 py-2.5">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span
        className={`text-xs font-semibold sm:text-right break-all ${mono ? "font-mono" : ""} ${
          highlight ? "text-destructive" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
