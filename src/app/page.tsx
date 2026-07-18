"use client";

import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlobalHealthBox } from "@/components/dashboard/global-health-box";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RiskTelemetryChart } from "@/components/dashboard/risk-telemetry-chart";
import { ExemptionQueue } from "@/components/dashboard/exemption-queue";
import { PolicyCenter } from "@/components/dashboard/policy-center";
import { exemptionQueue as initialQueue, kpiCards } from "@/lib/mockData";
import type { ExemptionCase, PolicyState } from "@/lib/types";
import { useTranslation } from "@/lib/LanguageContext";

export default function DashboardPage() {
  const { language } = useTranslation();
  const [policy, setPolicy] = useState<PolicyState>({ dataMasking: false, trafficThrottling: false });
  const [queue, setQueue] = useState<ExemptionCase[]>(initialQueue);
  const [pendingGuard, setPendingGuard] = useState<"dataMasking" | "trafficThrottling" | null>(null);
  const policyRef = useRef<HTMLDivElement>(null);

  // Action Flow D — ปุ่มลัดจาก National Alert: เลื่อนจอไปที่ Policy Center แล้วเปิด Safety Gate ให้อัตโนมัติ
  const handleQuickAction = () => {
    policyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // reset ก่อนเสมอ เพื่อให้ setState ไม่ถูก React bail-out เมื่อ pendingGuard ค้างค่าเดิม
    setPendingGuard(null);
    setTimeout(() => setPendingGuard("trafficThrottling"), 450);
  };

  const handleApprove = (ids: string[]) => {
    setQueue((q) =>
      q.map((c) => (ids.includes(c.id) ? { ...c, status: "Approved" as const } : c))
    );
  };

  const handleReject = (ids: string[]) => {
    setQueue((q) =>
      q.map((c) => (ids.includes(c.id) ? { ...c, status: "Rejected" as const } : c))
    );
  };

  const pendingKpi = {
    ...kpiCards[2],
    value: String(queue.filter((c) => c.status === "Pending").length),
  };

  const hasActiveThreat = !policy.trafficThrottling;

  return (
    <AppShell
      alertActive
      guardEnabled={policy.trafficThrottling}
      onQuickAction={handleQuickAction}
    >
      {hasActiveThreat && (
        <div className="w-full bg-red-600 text-white overflow-hidden py-1.5 text-xs font-bold select-none flex items-center border-b border-red-700 relative z-20 shadow-sm">
          <style>{`
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.33%); }
            }
            .animate-marquee-scroll {
              display: flex;
              width: max-content;
              animation: marquee-scroll 25s linear infinite;
            }
          `}</style>
          <div className="animate-marquee-scroll flex gap-8">
            {[1, 2, 3].map((i) => (
              <span key={i} className="whitespace-nowrap flex items-center gap-2">
                <span>🚨</span>
                <span>
                  {language === "en" 
                    ? "CRITICAL THREAT ALERT: Active cross-tenant Botnet campaign detected by PDPC (สคส.). Enabling Traffic Throttling is highly recommended to mitigate exposure of PII."
                    : "แจ้งเตือนภัยคุกคามความเสี่ยงสูง (Critical Threat Alert): สคส. ตรวจพบแคมเปญโจมตีภายนอกประเทศเจาะระบบหลายองค์กร แนะนำเปิดเกราะจำกัดความเร็วเชื่อมต่อ (Traffic Throttling) ทันทีเพื่อความปลอดภัย"}
                </span>
                <span className="opacity-40">|</span>
              </span>
            ))}
          </div>
        </div>
      )}
      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px] w-full mx-auto">

          {/* Section 1 — Status Layer */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-4">
              <GlobalHealthBox
                policy={policy}
                pendingCount={queue.filter((c) => c.status === "Pending").length}
                hasActiveThreat={hasActiveThreat}
              />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <KpiCard kpi={kpiCards[0]} />
              <KpiCard kpi={kpiCards[1]} />
              <KpiCard kpi={pendingKpi} />
            </div>
          </section>

          {/* Section 2 — Exemption Request Queue */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-12">
              <ExemptionQueue queue={queue} onApprove={handleApprove} onReject={handleReject} />
            </div>
          </section>

          {/* Section 3 — Main Split Layout (Action Layer) */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
            <div className="xl:col-span-7">
              <RiskTelemetryChart />
            </div>
            <div className="xl:col-span-5">
              <PolicyCenter
                ref={policyRef}
                policy={policy}
                onChange={setPolicy}
                pendingGuard={pendingGuard}
                onPendingConsumed={() => setPendingGuard(null)}
              />
            </div>
          </section>
        </main>
      </AppShell>
  );
}
