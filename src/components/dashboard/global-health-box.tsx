import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PolicyState } from "@/lib/types";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

export function GlobalHealthBox({ 
  policy, 
  pendingCount, 
  hasActiveThreat 
}: { 
  policy: PolicyState; 
  pendingCount: number; 
  hasActiveThreat: boolean; 
}) {
  const { t } = useTranslation();

  let state: "1a" | "1b" | "2" | "3" = "1a";
  if (hasActiveThreat) {
    state = "3";
  } else if (pendingCount > 0) {
    state = "2";
  } else if (policy.trafficThrottling || policy.dataMasking) {
    state = "1b";
  } else {
    state = "1a";
  }

  // Configurations based on State
  let config: {
    colorClass: string;
    bgClass: string;
    icon: ComponentType<{ className?: string }>;
    titleKey: TranslationKey;
    subKey: TranslationKey;
    detailKey: TranslationKey;
    textColor: string;
    pulseColor: string;
  } = {
    colorClass: "bg-brand-success text-brand-success",
    bgClass: "bg-brand-success/15 border-brand-success",
    icon: Activity,
    titleKey: "state1aTitle",
    subKey: "state1aSub",
    detailKey: "state1aDetail",
    textColor: "text-brand-success",
    pulseColor: "bg-brand-success",
  };

  if (state === "1b") {
    config = {
      colorClass: "bg-muted-foreground text-muted-foreground",
      bgClass: "bg-muted/60 border-border",
      icon: Activity,
      titleKey: "state1bTitle" as const,
      subKey: "state1bSub" as const,
      detailKey: "state1bDetail" as const,
      textColor: "text-muted-foreground",
      pulseColor: "bg-muted-foreground",
    };
  } else if (state === "2") {
    config = {
      colorClass: "bg-amber-500 text-amber-600",
      bgClass: "bg-amber-500/10 border-amber-500/30",
      icon: Activity,
      titleKey: "state2Title" as const,
      subKey: "state2Sub" as const,
      detailKey: "state2Detail" as const,
      textColor: "text-amber-600",
      pulseColor: "bg-amber-500",
    };
  } else if (state === "3") {
    config = {
      colorClass: "bg-destructive text-destructive",
      bgClass: "bg-destructive/10 border-destructive/30",
      icon: Activity,
      titleKey: "state3Title" as const,
      subKey: "state3Sub" as const,
      detailKey: "state3Detail" as const,
      textColor: "text-destructive",
      pulseColor: "bg-destructive",
    };
  }

  const IconComponent = config.icon;

  return (
    <Card size="sm" className="h-full">
      <CardContent className="h-full flex flex-col justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex w-8 h-8 shrink-0">
            {state !== "1b" && (
              <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping", config.pulseColor)} />
            )}
            <span className={cn("relative inline-flex rounded-full w-8 h-8 items-center justify-center border", config.bgClass)}>
              <IconComponent className="size-4" />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm leading-tight">{t(config.titleKey)}</div>
            <div className="text-[11px] text-muted-foreground truncate">
              {t(config.subKey)}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold">
              {t("legalRole")}
            </span>
            <Badge className="bg-foreground text-background hover:bg-foreground text-[10px] py-0 px-1.5 h-5 font-medium">
              {t("dataController")}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold">
              {t("guardStatus")}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground font-semibold">
              {policy.dataMasking ? t("maskingOn") : t("maskingOff")} · {policy.trafficThrottling ? t("throttleOn") : t("throttleOff")}
            </span>
          </div>
        </div>


      </CardContent>
    </Card>
  );
}
