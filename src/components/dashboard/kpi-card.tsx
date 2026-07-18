import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "./sparkline";
import type { KpiSeries } from "@/lib/types";
import { useTranslation } from "@/lib/LanguageContext";

export function KpiCard({ kpi }: { kpi: KpiSeries }) {
  const { t } = useTranslation();

  return (
    <Card size="sm" className="h-full">
      <CardContent className="h-full flex flex-col justify-between gap-2.5">
        <div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {kpi.labelKey ? t(kpi.labelKey as any) : kpi.label}
          </div>
          <div className="text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1">{kpi.value}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
            {kpi.subKey ? t(kpi.subKey as any) : kpi.sub}
          </div>
        </div>
        <Sparkline data={kpi.data} color={kpi.color} height={20} />
      </CardContent>
    </Card>
  );
}
