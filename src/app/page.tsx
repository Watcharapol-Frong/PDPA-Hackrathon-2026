"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlobalHealthBox } from "@/components/dashboard/global-health-box";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RiskTelemetryChart } from "@/components/dashboard/risk-telemetry-chart";
import { ExemptionQueue } from "@/components/dashboard/exemption-queue";
import { PolicyCenter } from "@/components/dashboard/policy-center";
import { ActionRequiredBanner } from "@/components/dashboard/action-required-banner";
import { kpiCards } from "@/lib/mockData";
import { useTranslation } from "@/lib/LanguageContext";
import { useAppState } from "@/lib/AppStateContext";

export default function DashboardPage() {
  const { language } = useTranslation();
  const router = useRouter();
  // อ่านจาก store กลาง — ทุกหน้าเห็นสถานะเดียวกัน
  const {
    incident,
    policy,
    legalState,
    updatePolicy,
    exemptionQueue: queue,
    approveExemptions,
    escalateExemption,
  } = useAppState();
  const [pendingGuard, setPendingGuard] = useState<"dataMasking" | "trafficThrottling" | null>(null);
  const policyRef = useRef<HTMLDivElement>(null);

  // Action Flow D — ปุ่มลัดจาก National Alert: เลื่อนจอไปที่ Policy Center แล้วเปิด Safety Gate ให้อัตโนมัติ
  const handleQuickAction = () => {
    policyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // reset ก่อนเสมอ เพื่อให้ setState ไม่ถูก React bail-out เมื่อ pendingGuard ค้างค่าเดิม
    setPendingGuard(null);
    setTimeout(() => setPendingGuard("trafficThrottling"), 450);
  };

  const handleApprove = (ids: string[], reason: string) => approveExemptions(ids, reason);
  // ตีกลับ = ประกาศว่าไม่เข้าเงื่อนไขยกเว้น → ยกระดับเป็นเหตุวิกฤตจริงแล้วพาไปที่เคสนั้น
  const handleReject = (ids: string[]) => {
    const newCaseId = ids
      .map((id) => escalateExemption(id, "DPO rejected the exemption — escalated for reporting"))
      .find(Boolean);
    if (newCaseId) router.push(`/crisis-room/${encodeURIComponent(newCaseId)}`);
  };

  const pendingKpi = {
    ...kpiCards[2],
    value: String(queue.filter((c) => c.status === "Pending").length),
  };
  return (
    <AppShell
      alertActive
      guardEnabled={policy.trafficThrottling}
      onQuickAction={handleQuickAction}
    >
      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px] w-full mx-auto">

          {/* Action Required — เห็นจากหน้าแรกว่ามีคดีค้างและเหลือเวลาเท่าไหร่ (Design Spec 5.2) */}
          <ActionRequiredBanner />

          {/* Section 1 — Status Layer */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-4">
              <GlobalHealthBox
                policy={policy}
                pendingCount={queue.filter((c) => c.status === "Pending").length}
                hasActiveThreat={incident !== null}
              />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <KpiCard kpi={kpiCards[0]} />
              <KpiCard kpi={kpiCards[1]} />
              <KpiCard kpi={pendingKpi} />
            </div>
          </section>

          {/* Section 2 — Exemption Assessment
               ซ่อนทั้ง section เมื่อ legalState = "1a" (ระบบปกติสุด) */}
          {legalState !== "1a" && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              <div className="lg:col-span-12">
                <ExemptionQueue queue={queue} onApprove={handleApprove} onReject={handleReject} />
              </div>
            </section>
          )}

          {/* Section 3 — Main Split Layout (Action Layer) */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
            <div className="xl:col-span-7">
              <RiskTelemetryChart />
            </div>
            <div className="xl:col-span-5">
              <PolicyCenter
                ref={policyRef}
                policy={policy}
                onChange={updatePolicy}
                pendingGuard={pendingGuard}
                onPendingConsumed={() => setPendingGuard(null)}
              />
            </div>
          </section>
        </main>
      </AppShell>
  );
}
