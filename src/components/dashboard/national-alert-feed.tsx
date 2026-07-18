import { CheckCircle2, Megaphone, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/LanguageContext";

interface NationalAlertFeedProps {
  alertActive: boolean;
  guardEnabled: boolean;
  onQuickAction: () => void;
}

export function NationalAlertFeed({ alertActive, guardEnabled, onQuickAction }: NationalAlertFeedProps) {
  const { t } = useTranslation();

  if (!alertActive) return null;

  return (
    <div className="w-full bg-blue-50/80 border border-blue-200 rounded-xl px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 shadow-sm">
      <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
        <span className="relative flex shrink-0 mt-0.5 md:mt-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-30 animate-ping" />
          <Megaphone className="relative size-4.5 text-blue-700" />
        </span>
        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-extrabold text-blue-900 text-xs uppercase tracking-wide">
              {t("alertTitle")}
            </span>
            <Badge className="bg-blue-700 text-white hover:bg-blue-700 font-mono text-[9px] h-4.5 py-0 px-1 font-semibold leading-none">
              BROADCAST
            </Badge>
          </div>
          <p className="text-xs text-blue-900/85 leading-normal">
            {t("alertDetail")}
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center md:justify-end">
        {guardEnabled ? (
          <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-blue-200">
            <CheckCircle2 className="size-3.5" />
            <span>{t("guardEnabledMsg")}</span>
          </div>
        ) : (
          <Button
            onClick={onQuickAction}
            size="sm"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold h-8 text-[11px] px-3 shadow-sm hover:shadow transition"
          >
            <Zap className="size-3" />
            <span>{t("enableGuardBtn")}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
