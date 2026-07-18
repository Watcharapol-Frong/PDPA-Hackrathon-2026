"use client";

import { Database, Server, Skull, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import type { AttackEdge, AttackNode } from "@/lib/types";

const nodeIcon = {
  attacker: Skull,
  gateway: Server,
  database: Database,
} as const;

const nodeStyle = {
  attacker: "border-destructive/40 bg-destructive/10 text-destructive",
  gateway: "border-brand-warning/40 bg-brand-warning/10 text-brand-warning",
  database: "border-border bg-muted text-muted-foreground",
} as const;

interface AttackVectorGraphProps {
  nodes: AttackNode[];
  edges: AttackEdge[];
  summaryKey?: TranslationKey;
}

export function AttackVectorGraph({ nodes, edges, summaryKey = "vectorAiSummary" }: AttackVectorGraphProps) {
  const { t } = useTranslation();

  return (
    <Card size="sm" className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">{t("vectorTitle")}</CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          {t("vectorSub")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col gap-4">
        {/* Node-Link Graph — บนจอเล็กเรียงแนวตั้ง, จอใหญ่เรียงแนวนอน */}
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 py-2">
          {nodes.map((node, i) => {
            const Icon = nodeIcon[node.kind];
            const edge = edges[i];
            return (
              <div
                key={node.id}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-1 min-w-0"
              >
                <div
                  className={`flex sm:flex-col items-center gap-2 sm:gap-1.5 rounded-xl border px-3 py-2.5 w-full sm:w-auto sm:flex-1 min-w-0 ${nodeStyle[node.kind]}`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="text-[11px] font-semibold leading-tight sm:text-center min-w-0 break-words">
                    {t(node.labelKey)}
                  </span>
                </div>

                {/* เส้นเชื่อม + ป้ายกำกับ */}
                {edge && (
                  <div className="flex sm:flex-col items-center gap-1 shrink-0 self-center">
                    <span className="text-[9px] font-mono font-bold uppercase text-destructive/70 tracking-wider whitespace-nowrap">
                      {t(edge.labelKey)}
                    </span>
                    <svg
                      className="rotate-90 sm:rotate-0 shrink-0"
                      width="34"
                      height="10"
                      viewBox="0 0 34 10"
                      aria-hidden
                    >
                      <line
                        x1="0"
                        y1="5"
                        x2="26"
                        y2="5"
                        stroke="var(--destructive)"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <path d="M26 1 L33 5 L26 9 Z" fill="var(--destructive)" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Advisory summary */}
        <div className="mt-auto rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary shrink-0" />
            <Badge
              variant="secondary"
              className="text-[9px] font-mono font-bold uppercase h-4.5 py-0 px-1.5 bg-primary/10 text-primary hover:bg-primary/10"
            >
              {t("vectorAiLabel")}
            </Badge>
          </div>
          <p className="text-[11px] leading-relaxed text-foreground/90">{t(summaryKey)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
