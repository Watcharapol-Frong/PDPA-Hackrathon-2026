"use client";

import Link from "next/link";
import { ArrowRight, Fingerprint, Info, Radar, ShieldCheck, Megaphone, ShieldAlert, Cpu } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AttackVectorGraph } from "@/components/crisis/attack-vector-graph";
import { RiskTelemetryChart } from "@/components/dashboard/risk-telemetry-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppState } from "@/lib/AppStateContext";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

const ioaKeys: TranslationKey[] = [
  "threatIoaEndpoint",
  "threatIoaVelocity",
  "threatIoaPayload",
  "threatIoaHours",
];

export default function ThreatAnalyticsPage() {
  const { incident, policy } = useAppState();
  const { t, language } = useTranslation();
  const isEn = language === "en";

  return (
    <AppShell alertActive guardEnabled={false}>
      <main className="flex-1 p-6 space-y-6 max-w-[1280px] w-full mx-auto animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between border-b pb-4">
          <div>
            <h1 className="text-base font-extrabold tracking-tight flex items-center gap-2">
              <Radar className="size-4 text-primary shrink-0" />
              <span>{t("threatPageTitle")}</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t("threatPageSub")}</p>
          </div>
          {incident && (
            <Button asChild variant="ghost" size="sm" className="self-start md:self-center text-xs h-8 text-primary hover:text-primary hover:bg-primary/5 px-2">
              <Link href={`/crisis-room/${encodeURIComponent(incident.caseId)}`} className="gap-1">
                <span>{t("threatViewIncident")}</span>
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          )}
        </div>

        {!incident ? (
          <div className="rounded-xl border border-dashed p-16 text-center bg-card">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto gap-3">
              <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center border border-emerald-200/50">
                <ShieldCheck className="size-5 text-emerald-600" />
              </div>
              <p className="font-semibold text-xs text-foreground mt-1">{t("threatNoIncident")}</p>
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{t("threatNoIncidentSub")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Threat Intelligence Row */}
            <div className="bg-card border rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Fingerprint className="size-4 text-red-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block leading-tight">{t("threatActiveCampaign")}</span>
                  <span className="text-[10px] text-muted-foreground">{t("threatCampaignName")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem label={t("threatCampaignId")} value="CMP-TH-2026-0714" mono />
                <StatItem label={t("threatMatchConfidence")} value="92.4%" danger />
                <StatItem label={t("threatPeerOrgs")} value={t("threatPeerOrgsValue")} />
                <StatItem label={t("threatFirstSeen")} value="2026-07-16 21:08" mono />
              </div>
            </div>

            {/* Content Split: Risk Telemetry & Sector Peer defense */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Telemetry Chart */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="border bg-card rounded-2xl p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-foreground">{isEn ? "Risk Level Telemetry" : "ข้อมูลบันทึกความถี่การเกิดความเสี่ยง"}</span>
                    <p className="text-[10px] text-muted-foreground">{isEn ? "Real-time threat traffic density mapping" : "อัตราส่วนการสแกนและการตรวจพบกิจกรรมที่น่าสงสัยสะสม"}</p>
                  </div>
                  <div className="flex-1 min-h-[220px]">
                    <RiskTelemetryChart />
                  </div>
                </div>
              </div>

              {/* Sector Peer Impact Status */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="border bg-card rounded-2xl p-4 flex-1 flex flex-col justify-between">
                  <div className="border-b pb-2 mb-3">
                    <span className="text-xs font-bold text-foreground">{isEn ? "Sector Peer Impact Status" : "ความเคลื่อนไหวในกลุ่มธุรกิจเดียวกัน"}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{isEn ? "Anonymized real-time peer telemetry" : "สถานะการรับมือขององค์กรพันธมิตรในกลุ่มการเงิน"}</p>
                  </div>
                  
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    {[
                      { name: isEn ? "Fintech Provider A" : "ผู้ให้บริการฟินเทค A", status: "Mitigated", badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
                      { name: isEn ? "Commercial Bank B" : "ธนาคารพาณิชย์ B", status: "Protected", badge: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
                      { name: isEn ? "Digital Wallet C" : "บริการกระเป๋าเงินดิจิทัล C", status: "Under Attack", badge: "bg-red-500/10 text-red-700 border-red-500/20" },
                      { name: isEn ? "Brokerage Portal D" : "พอร์ทัลโบรกเกอร์ D", status: "Investigating", badge: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
                    ].map((peer, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs">
                        <span className="text-muted-foreground font-semibold">{peer.name}</span>
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", peer.badge)}>{peer.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Split: Attack Vector & PDPC CERT Broadcast */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Attack Vector Graph representation */}
              <div className="lg:col-span-8 bg-card border rounded-2xl p-4 flex flex-col">
                <div className="border-b pb-2 mb-3">
                  <span className="text-xs font-bold text-foreground">{isEn ? "API Exfiltration Vector" : "เส้นทางโจมตีและการดึงข้อมูล"}</span>
                  <p className="text-[10px] text-muted-foreground">{isEn ? "Visual mapping of suspicious entrypoints and databases" : "ผังแสดงจุดที่ผู้โจมตีเข้าถึงและการเชื่อมโยงข้อมูลภายใน"}</p>
                </div>
                <div className="flex-1">
                  <AttackVectorGraph
                    nodes={incident.nodes}
                    edges={incident.edges}
                    summaryKey={incident.aiSummaryKey}
                  />
                </div>
              </div>

              {/* PDPC-CERT Official Feed & WAF active rules */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Official Broadcast */}
                <div className="border bg-card rounded-2xl p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-500 border-b pb-2">
                    <Megaphone className="size-4 animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-wider">{isEn ? "PDPC-CERT Alert Feed" : "ประกาศเตือนภัยจาก สคส."}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-red-50/50 dark:bg-red-950/10 p-2.5 rounded-xl border border-red-200/50 text-[10px] leading-relaxed">
                      <span className="font-bold text-red-800 dark:text-red-400 block mb-0.5">Alert ID: PDPC-IOC-2026-041</span>
                      {isEn 
                        ? "Warning: Multi-tenant API scraping campaign targeting financial databases. Attackers utilize cross-tenant parameters to access unmasked fields."
                        : "คำเตือน: เฝ้าระวังแคมเปญสแกนช่องโหว่ API เจาะข้อมูลข้ามบัญชีลูกค้าในกลุ่มฟินเทค แนะนำควบคุมปริมาณทราฟฟิกขาเข้าด่วน"}
                    </div>
                  </div>
                </div>

                {/* Gateway Rules Checklist */}
                <div className="border bg-card rounded-2xl p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-1.5 text-foreground border-b pb-2">
                    <Cpu className="size-4 text-primary" />
                    <span className="text-xs font-bold">{isEn ? "Active Countermeasures" : "ความพร้อมนโยบายเกราะป้องกัน"}</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    {[
                      { name: isEn ? "Data Masking (PII Shield)" : "ระบบซ่อนฟิลด์สิทธิการจำยอม (Masking)", active: policy.dataMasking },
                      { name: isEn ? "API Rate Limiting (Throttling)" : "ระบบควบคุมความเร็วการดึงข้อมูล (Throttling)", active: policy.trafficThrottling },
                      { name: isEn ? "WORM Lock (Immutable Ledger)" : "บันทึกความสมบูรณ์ไฟล์ถาวร (WORM Ledger)", active: true },
                    ].map((rule, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground">{rule.name}</span>
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.2 rounded-md font-mono border",
                          rule.active 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        )}>
                          {rule.active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Information Panel */}
            <div className="flex gap-2.5 rounded-xl border border-muted bg-muted/20 px-3.5 py-2.5">
              <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {t("threatPrivacyNote")}
              </p>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}

function StatItem({
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
    <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/80 p-3 bg-muted/10">
      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className={cn(
        "text-[13px] font-bold mt-1 tracking-tight text-foreground",
        mono && "font-mono",
        danger && "text-red-600 dark:text-red-500"
      )}>
        {value}
      </div>
    </div>
  );
}
