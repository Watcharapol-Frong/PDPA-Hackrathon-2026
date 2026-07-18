import { forwardRef, useEffect, useState } from "react";
import { EyeOff, Gauge, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PolicyState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/LanguageContext";

type GuardKey = keyof PolicyState;

const guardMeta = {
  dataMasking: {
    titleKey: "guardMaskingTitle" as const,
    subKey: "guardMaskingSub" as const,
    icon: EyeOff,
    warningKey: "guardMaskingWarning" as const,
  },
  trafficThrottling: {
    titleKey: "guardThrottleTitle" as const,
    subKey: "guardThrottleSub" as const,
    icon: Gauge,
    warningKey: "guardThrottleWarning" as const,
  },
};

interface PolicyCenterProps {
  policy: PolicyState;
  onChange: (policy: PolicyState) => void;
  /** เมื่อ Flow D (National Alert quick action) สั่งเปิด gate ของ toggle ตัวใดตัวหนึ่ง */
  pendingGuard: GuardKey | null;
  onPendingConsumed: () => void;
}

export const PolicyCenter = forwardRef<HTMLDivElement, PolicyCenterProps>(function PolicyCenter(
  { policy, onChange, pendingGuard, onPendingConsumed },
  ref,
) {
  const [gateFor, setGateFor] = useState<GuardKey | null>(null);
  const [accepted, setAccepted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (pendingGuard && !policy[pendingGuard]) {
      setGateFor(pendingGuard);
      setAccepted(false);
    }
  }, [pendingGuard, policy]);

  const requestToggle = (key: GuardKey) => {
    if (policy[key]) {
      // ปิดเกราะ — ไม่ต้องผ่าน Safety Gate ตาม spec (gate เฉพาะตอนเปิด)
      onChange({ ...policy, [key]: false });
      return;
    }
    setGateFor(key);
    setAccepted(false);
  };

  const closeGate = () => {
    setGateFor(null);
    setAccepted(false);
    onPendingConsumed();
  };

  const confirmGate = () => {
    if (gateFor) onChange({ ...policy, [gateFor]: true });
    closeGate();
  };

  return (
    <Card ref={ref} className="h-full flex flex-col" size="sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-tight">{t("policyTitle")}</CardTitle>
        <CardDescription className="text-[11px] text-muted-foreground">
          {t("policySub")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-0 pt-0">
        {(Object.keys(guardMeta) as GuardKey[]).map((key) => {
          const meta = guardMeta[key];
          const on = policy[key];
          const Icon = meta.icon;
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 border-b border-border/30 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors border",
                    on 
                      ? "bg-brand-success/10 border-brand-success/20 text-brand-success" 
                      : "bg-muted/40 border-border/40 text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                    {t(meta.titleKey)}
                    {on && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    {t(meta.subKey)}
                  </div>
                </div>
              </div>
              <Switch
                checked={on}
                onCheckedChange={() => requestToggle(key)}
                aria-label={`${t("switchLabel")} ${t(meta.titleKey)}`}
                className="data-[state=checked]:bg-brand-success scale-90"
              />
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/10">
        <p className="text-[10px] text-muted-foreground leading-normal">
          {t("policyFooter")}
        </p>
      </CardFooter>

      {/* Action Flow C — Safety Gate Modal */}
      <Dialog open={gateFor !== null} onOpenChange={(open) => !open && closeGate()}>
        <DialogContent className="border-t-4 border-t-brand-warning">
          <DialogHeader>
            <DialogTitle>{t("safetyGateTitle")}</DialogTitle>
            <DialogDescription>{t("safetyGateSub")}</DialogDescription>
          </DialogHeader>

          {gateFor && (
            <div className="space-y-4">
              <div className="flex gap-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl p-4">
                <TriangleAlert className="size-5 text-brand-warning shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{t(guardMeta[gateFor].warningKey)}</p>
              </div>

              <Label className="flex items-start gap-3 cursor-pointer font-normal">
                <Checkbox
                  checked={accepted}
                  onCheckedChange={(v) => setAccepted(v === true)}
                  className="mt-0.5 size-5 shrink-0"
                />
                <span className="text-xs leading-relaxed">
                  {t("safetyGateCheckbox")}
                </span>
              </Label>

              <Button
                onClick={confirmGate}
                disabled={!accepted}
                size="lg"
                className="w-full bg-brand-warning hover:bg-brand-warning/90 text-white font-bold min-h-11"
              >
                {t("safetyGateConfirmBtn")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
});
