import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { riskTelemetrySeries } from "@/lib/mockData";
import { useTranslation } from "@/lib/LanguageContext";

export function RiskTelemetryChart() {
  const { t } = useTranslation();

  return (
    <Card className="h-full" size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">{t("chartTitle")}</CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          {t("chartSub")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskTelemetrySeries} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
              <XAxis
                dataKey="t"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontSize: 11,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
                labelFormatter={(label) => t("chartTime").replace("{label}", String(label))}
                formatter={(value) => [t("chartScore").replace("{value}", String(value)), "Risk Score"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
