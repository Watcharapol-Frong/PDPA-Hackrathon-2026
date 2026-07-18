"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gracePeriodReasonKeys } from "@/lib/mockData";
import { useTranslation } from "@/lib/LanguageContext";

interface GracePeriodActivatorProps {
  sent: boolean;
  onSent: () => void;
}

export function GracePeriodActivator({ sent, onSent }: GracePeriodActivatorProps) {
  const [reason, setReason] = useState("");
  const [certified, setCertified] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { t } = useTranslation();

  // Intentional UX Friction — ปุ่มปลดล็อกเมื่อเลือกเหตุผล + ติ๊กรับรองครบเท่านั้น
  const canSubmit = reason !== "" && certified && !sent;

  const submit = () => {
    onSent();
    setSuccessOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 py-1">
        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-4">
            <CheckCircle2 className="size-7 text-blue-600" />
            <p className="text-xs font-semibold text-blue-900">{t("graceAlreadySent")}</p>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold">
                {t("graceReasonLabel")} <span className="text-destructive">*</span>
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder={t("graceReasonPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {gracePeriodReasonKeys.map((key) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {t(key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Label className="flex items-start gap-2.5 cursor-pointer font-normal bg-muted/50 rounded-lg p-2.5">
              <Checkbox
                checked={certified}
                onCheckedChange={(v) => setCertified(v === true)}
                className="mt-0.5 shrink-0"
              />
              <span className="text-[11px] leading-relaxed">{t("graceCheckbox")}</span>
            </Label>

            <Button
              onClick={submit}
              disabled={!canSubmit}
              size="sm"
              className="w-full mt-auto font-bold text-xs h-9 bg-brand-warning hover:bg-brand-warning/90 text-white disabled:bg-muted disabled:text-muted-foreground"
            >
              {t("graceSubmitBtn")}
            </Button>
          </>
        )}

      {/* Action Flow B — Visual Feedback หลังส่งคำร้องสำเร็จ */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="border-t-4 border-t-blue-500 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-blue-600 shrink-0" />
              {t("graceSentTitle")}
            </DialogTitle>
            <DialogDescription className="leading-relaxed pt-1">
              {t("graceSentBody")}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setSuccessOpen(false)} size="lg" className="w-full font-bold">
            {t("graceSentClose")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
