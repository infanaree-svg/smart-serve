import { PageHeader } from "@/components/common/PageHeader";
import {
  SettingsForm,
  SettingsFormSkeleton,
} from "@/components/settings/SettingsForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePackageInfo, useSettings } from "@/hooks/use-backend";
import { formatBaht } from "@/lib/format";
import { Check, Info, LayoutDashboard, Sparkles } from "lucide-react";

const APP_FEATURES = [
  "จัดการคิวออเดอร์และครัวแบบเรียลไทม์",
  "ติดตามไรเดอร์และสถานะการจัดส่ง",
  "ควบคุมสต็อกวัตถุดิบและต้นทุนต่อจาน",
  "โปรโมชัน รายงานยอดขาย และคำแนะนำจาก AI",
];

export default function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useSettings();
  const { data: packageInfo, isLoading: isPackageLoading } = usePackageInfo();

  return (
    <div className="space-y-6" data-ocid="settings.page">
      <PageHeader
        title="ตั้งค่า"
        description="ตั้งค่าข้อมูลร้าน เวลาเปิด-ปิด และเวลาเตรียมอาหารเฉลี่ย"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
        {isLoading ? (
          <SettingsFormSkeleton />
        ) : isError || !settings ? (
          <Card
            className="border-border/70 shadow-card"
            data-ocid="settings.error_state"
          >
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <p className="font-display text-base font-bold text-foreground">
                ไม่สามารถโหลดการตั้งค่าได้
              </p>
              <p className="text-sm text-muted-foreground">
                กรุณาลองใหม่อีกครั้งเพื่อแก้ไขข้อมูลร้าน
              </p>
              <Button
                type="button"
                onClick={() => void refetch()}
                className="rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
                data-ocid="settings.retry_button"
              >
                ลองใหม่อีกครั้ง
              </Button>
            </CardContent>
          </Card>
        ) : (
          <SettingsForm settings={settings} />
        )}

        <Card
          className="border-border/70 shadow-card"
          data-ocid="settings.info_card"
        >
          <CardHeader className="gap-1">
            <div className="flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <LayoutDashboard className="size-4" aria-hidden="true" />
              </span>
              <CardTitle className="font-display text-base font-bold text-foreground">
                เกี่ยวกับแอปพลิเคชัน
              </CardTitle>
            </div>
            <CardDescription>
              Smart Serve+ — แดชบอร์ดบริหารร้านอาหารครบวงจร
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <ul className="space-y-2.5" data-ocid="settings.app_feature_list">
              {APP_FEATURES.map((feature, index) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5"
                  data-ocid={`settings.app_feature.${index + 1}`}
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  แพ็กเกจปัจจุบัน
                </span>
                {packageInfo?.badge ? (
                  <Badge
                    className="border-transparent bg-warning text-warning-foreground"
                    data-ocid="settings.package_badge"
                  >
                    {packageInfo.badge}
                  </Badge>
                ) : null}
              </div>

              {isPackageLoading ? (
                <div
                  className="mt-3 space-y-2"
                  data-ocid="settings.package_loading_state"
                >
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ) : packageInfo ? (
                <div className="mt-3 space-y-1">
                  <p className="font-display text-lg font-bold text-foreground">
                    Smart Serve+ Pro
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="settings.package_price"
                  >
                    {formatBaht(packageInfo.pricePerMonth)} / เดือน
                  </p>
                  {packageInfo.trialLabel ? (
                    <p className="text-xs font-medium text-primary">
                      {packageInfo.trialLabel}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  ไม่สามารถโหลดข้อมูลแพ็กเกจได้
                </p>
              )}
            </div>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              การเปลี่ยนแปลงข้อมูลร้านมีผลทันทีกับทุกหน้าจอในแดชบอร์ด
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
