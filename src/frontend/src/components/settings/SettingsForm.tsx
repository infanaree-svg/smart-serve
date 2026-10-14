import type { Settings, SettingsUpdate } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateSettings } from "@/hooks/use-backend";
import { Clock, Loader2, Save, Store, Timer } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const DEFAULT_RESTAURANT_NAME = "ครัวคุณอ้วย";

export interface SettingsFormProps {
  settings: Settings;
  "data-ocid"?: string;
}

/**
 * Restaurant settings form. Owns its editable draft in local state, seeded once
 * from the loaded settings, and saves through useUpdateSettings.
 */
export function SettingsForm({ settings, ...rest }: SettingsFormProps) {
  const updateSettings = useUpdateSettings();

  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [openTime, setOpenTime] = useState(settings.openTime);
  const [closeTime, setCloseTime] = useState(settings.closeTime);
  const [averagePrepMinutes, setAveragePrepMinutes] = useState(
    settings.averagePrepMinutes.toString(),
  );

  // Seed the draft once when the settings record first arrives.
  useEffect(() => {
    setRestaurantName(settings.restaurantName);
    setOpenTime(settings.openTime);
    setCloseTime(settings.closeTime);
    setAveragePrepMinutes(settings.averagePrepMinutes.toString());
  }, [settings]);

  const trimmedName = restaurantName.trim();
  const prepMinutes = Number.parseInt(averagePrepMinutes, 10);
  const isPrepValid = Number.isFinite(prepMinutes) && prepMinutes >= 0;
  const canSubmit =
    trimmedName.length > 0 &&
    openTime.length > 0 &&
    closeTime.length > 0 &&
    isPrepValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateSettings.isPending) return;

    const payload: SettingsUpdate = {
      restaurantName: trimmedName,
      openTime,
      closeTime,
      averagePrepMinutes: BigInt(prepMinutes),
    };

    updateSettings.mutate(payload, {
      onSuccess: () => {
        toast.success("บันทึกการตั้งค่าแล้ว", {
          description: "ข้อมูลร้านและเวลาเปิด-ปิดถูกอัปเดตเรียบร้อย",
        });
      },
      onError: () => {
        toast.error("บันทึกไม่สำเร็จ", {
          description: "กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง",
        });
      },
    });
  };

  return (
    <Card className="border-border/70 shadow-card" {...rest}>
      <CardHeader className="gap-1">
        <CardTitle className="font-display text-base font-bold text-foreground">
          ข้อมูลร้านและการให้บริการ
        </CardTitle>
        <CardDescription>
          ตั้งชื่อร้าน เวลาเปิด-ปิด และเวลาเตรียมอาหารเฉลี่ยที่ใช้คำนวณคิวครัว
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="settings-restaurant-name">ชื่อร้าน</Label>
            <div className="relative">
              <Store
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="settings-restaurant-name"
                value={restaurantName}
                onChange={(event) => setRestaurantName(event.target.value)}
                placeholder={DEFAULT_RESTAURANT_NAME}
                className="pl-9"
                data-ocid="settings.restaurant_name_input"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-open-time">เวลาเปิด</Label>
              <div className="relative">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="settings-open-time"
                  type="time"
                  value={openTime}
                  onChange={(event) => setOpenTime(event.target.value)}
                  className="pl-9 tabular-nums"
                  data-ocid="settings.open_time_input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-close-time">เวลาปิด</Label>
              <div className="relative">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="settings-close-time"
                  type="time"
                  value={closeTime}
                  onChange={(event) => setCloseTime(event.target.value)}
                  className="pl-9 tabular-nums"
                  data-ocid="settings.close_time_input"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-prep-minutes">
              เวลาเตรียมอาหารเฉลี่ย (นาที)
            </Label>
            <div className="relative">
              <Timer
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="settings-prep-minutes"
                type="number"
                min={0}
                inputMode="numeric"
                value={averagePrepMinutes}
                onChange={(event) => setAveragePrepMinutes(event.target.value)}
                className="pl-9 tabular-nums"
                data-ocid="settings.prep_minutes_input"
              />
            </div>
            {!isPrepValid ? (
              <p
                className="text-xs font-medium text-destructive"
                data-ocid="settings.prep_minutes_error"
              >
                กรุณากรอกจำนวนนาทีเป็นตัวเลขตั้งแต่ 0 ขึ้นไป
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                ใช้ประเมินเวลารอของลูกค้าและจัดลำดับคิวในครัว
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
            <Button
              type="submit"
              disabled={!canSubmit || updateSettings.isPending}
              className="rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
              data-ocid="settings.save_button"
            >
              {updateSettings.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              บันทึกการตั้งค่า
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/** Layout-matched skeleton shown while the settings query is pending. */
export function SettingsFormSkeleton() {
  return (
    <Card
      className="border-border/70 shadow-card"
      data-ocid="settings.loading_state"
    >
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex justify-end border-t border-border pt-5">
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
