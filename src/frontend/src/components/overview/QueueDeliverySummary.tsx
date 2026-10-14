import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeliverySummary } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import { ArrowRight, Bike, Store, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SummaryRow {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: string;
}

const SKELETON_IDS = Array.from({ length: 3 }, (_, i) => `queue-skeleton-${i}`);

/**
 * Queue and delivery summary: dine-in queue, online orders and active
 * deliveries, with a CTA into the full queue page.
 */
export function QueueDeliverySummary() {
  const navigate = useNavigate();
  const { data: delivery, isLoading: deliveryLoading } = useDeliverySummary();

  const isLoading = deliveryLoading;

  const rows: SummaryRow[] = [
    {
      key: "dineIn",
      icon: Store,
      label: "คิวหน้าร้าน",
      value: `${Number(delivery?.dineInQueue ?? 0)} คิว`,
      detail: "รอ 15 นาที",
      tone: "bg-warning-soft text-warning",
    },
    {
      key: "online",
      icon: Bike,
      label: "ออเดอร์ออนไลน์",
      value: `${Number(delivery?.onlineOrders ?? 0)} ออเดอร์`,
      detail: "รอ 20 นาที",
      tone: "bg-info-soft text-info",
    },
    {
      key: "delivering",
      icon: Truck,
      label: "กำลังจัดส่ง",
      value: `${Number(delivery?.delivering ?? 0)} รายการ`,
      detail: "เฉลี่ย 2.8 กม.",
      tone: "bg-success-soft text-success",
    },
  ];

  return (
    <Card className="shadow-card" data-ocid="overview.queue_delivery_card">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="font-display text-base font-bold">
          คิวและการจัดส่ง
        </CardTitle>
        <span className="text-xs font-medium text-muted-foreground">
          อัปเดตเรียลไทม์
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="overview.queue_loading_state">
            {SKELETON_IDS.map((id) => (
              <div key={id} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((row, index) => {
              const Icon = row.icon;
              return (
                <li
                  key={row.key}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3"
                  data-ocid={`overview.queue_item.${index + 1}`}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      row.tone,
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {row.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.detail}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-sm font-bold tabular-nums text-foreground">
                    {row.value}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/queue")}
          className="w-full rounded-full"
          data-ocid="overview.queue_details_button"
        >
          ดูรายละเอียดทั้งหมด
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}
