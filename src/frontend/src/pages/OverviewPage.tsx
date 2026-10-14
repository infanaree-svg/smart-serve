import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { AiHelpCard } from "@/components/overview/AiHelpCard";
import { QueueDeliverySummary } from "@/components/overview/QueueDeliverySummary";
import { WelcomeBanner } from "@/components/overview/WelcomeBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKpiSummary, useSettings } from "@/hooks/use-backend";
import { Clock, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DEFAULT_RESTAURANT_NAME = "ครัวคุณอ้วย";
const KPI_SKELETON_IDS = Array.from(
  { length: 4 },
  (_, i) => `kpi-skeleton-${i}`,
);

interface KpiSlot {
  key: string;
  icon: LucideIcon;
  invertTrend?: boolean;
}

const KPI_SLOTS: KpiSlot[] = [
  { key: "todaySales", icon: Receipt },
  { key: "estimatedProfit", icon: TrendingUp },
  { key: "orders", icon: ShoppingBag },
  { key: "averageWait", icon: Clock, invertTrend: true },
];

export default function OverviewPage() {
  const { data: settings } = useSettings();
  const { data: kpi, isLoading } = useKpiSummary();

  const restaurantName = settings?.restaurantName || DEFAULT_RESTAURANT_NAME;

  return (
    <div className="space-y-6" data-ocid="overview.page">
      <PageHeader
        title="ภาพรวม"
        description="สรุปยอดขาย คิว และสถานะร้านแบบเรียลไทม์"
      />

      <WelcomeBanner restaurantName={restaurantName} />

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        data-ocid="overview.kpi_section"
      >
        {isLoading || !kpi
          ? KPI_SKELETON_IDS.map((id) => (
              <Card key={id} className="shadow-card border-border/70">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="size-9 rounded-lg" />
                  </div>
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : KPI_SLOTS.map((slot, index) => {
              const item = kpi[slot.key as keyof typeof kpi];
              return (
                <KpiCard
                  key={slot.key}
                  label={item.timeLabel}
                  value={item.value}
                  changePercent={item.changePercent}
                  changeLabel={item.changeLabel}
                  icon={slot.icon}
                  invertTrend={slot.invertTrend}
                  data-ocid={`overview.kpi_card.${index + 1}`}
                />
              );
            })}
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QueueDeliverySummary />
        </div>
        <AiHelpCard />
      </div>
    </div>
  );
}
