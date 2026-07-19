"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import type { AuditCategory, AuditEntry } from "@/lib/AppStateContext";
import { cn } from "@/lib/utils";

const categoryMeta: Record<AuditCategory, { labelKey: TranslationKey; className: string }> = {
  detection: { labelKey: "evidenceCatDetection", className: "bg-destructive/10 text-destructive" },
  enforcement: { labelKey: "evidenceCatEnforcement", className: "bg-brand-warning/10 text-brand-warning" },
  dpo_action: { labelKey: "evidenceCatDpoAction", className: "bg-primary/10 text-primary" },
  policy: { labelKey: "evidenceCatPolicy", className: "bg-blue-100 text-blue-800" },
  report: { labelKey: "evidenceCatReport", className: "bg-muted text-muted-foreground" },
  exemption: { labelKey: "evidenceCatExemption", className: "bg-brand-success/10 text-brand-success" },
};

export function EvidenceTable({ entries }: { entries: AuditEntry[] }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent">
            {(
              [
                "evidenceColTime",
                "evidenceColActor",
                "evidenceColAction",
                "evidenceColRationale",
                "evidenceColCategory",
                "evidenceColCase",
              ] as const
            ).map((key, i) => (
              <TableHead
                key={key}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80",
                  i === 0 && "pl-4",
                )}
              >
                {t(key)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {entries.map((e) => {
            const cat = categoryMeta[e.category];
            return (
              <TableRow key={e.id} className="align-top">
                <TableCell className="pl-4 py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {e.timestamp}
                </TableCell>
                <TableCell className="py-3 text-xs whitespace-nowrap">{t(e.actorKey)}</TableCell>
                <TableCell className="py-3 text-xs font-semibold">
                  <div className="max-w-[260px] whitespace-normal break-words">
                    {t(e.actionKey)}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-[11px] text-muted-foreground">
                  <div className="max-w-[280px] whitespace-normal break-words">
                  {e.rationaleKey ? t(e.rationaleKey) : null}
                  {e.rationaleText ? (
                    <span className={cn("block", e.rationaleKey && "mt-0.5 italic")}>
                      {e.rationaleText}
                    </span>
                  ) : null}
                  {!e.rationaleKey && !e.rationaleText ? t("evidenceNoRationale") : null}
                  </div>
                </TableCell>
                <TableCell className="py-3 whitespace-nowrap">
                  <span
                    className={cn(
                      "inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                      cat.className,
                    )}
                  >
                    {t(cat.labelKey)}
                  </span>
                </TableCell>
                <TableCell className="py-3 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                  {e.caseId ?? "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export { categoryMeta };

export function SealedBadge() {
  const { t } = useTranslation();
  return (
    <Badge variant="secondary" className="text-[9px] font-mono font-bold uppercase h-4.5 py-0 px-1.5">
      {t("evidenceSealed")}
    </Badge>
  );
}
