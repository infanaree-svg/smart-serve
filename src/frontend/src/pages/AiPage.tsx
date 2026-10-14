import type { Kpi } from "@/backend";
import {
  RecommendationList,
  RecommendationListSkeleton,
} from "@/components/ai/RecommendationList";
import { SalesInsightChart } from "@/components/ai/SalesInsightChart";
import { KpiCard } from "@/components/common/KpiCard";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useKpiSummary,
  useRecommendation,
  useRefreshRecommendation,
  useSalesReport,
} from "@/hooks/use-backend";
import { formatBaht, formatCount, formatDateTime } from "@/lib/format";
import {
  AlertTriangle,
  Clock,
  Coins,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const PERIOD = "7d";
const PERIOD_LABEL = "7 วันล่าสุด";

export default function AiPage() {
  const [showPlan, setShowPlan] = useState(false);

  const recommendation = useRecommendation();
  const refresh = useRefreshRecommendation();
  const salesReport = useSalesReport(PERIOD);
  const kpi = useKpiSummary();

  const items = recommendation.data?.items ?? [];
  const generatedAt = recommendation.data?.generatedAt;
  const isGenerating = recommendation.isLoading || refresh.isPending;
  const hasError = recommendation.isError || refresh.isError;

  const handleRefresh = () => {
    refresh.mutate();
  };

  const kpiTiles: Array<{
    key: string;
    label: string;
    value: string;
    changePercent: number;
    changeLabel: string;
    icon: typeof TrendingUp;
    invertTrend?: boolean;
  }> = kpi.data
    ? [
        {
          key: "todaySales",
          label: "ยอดขายวันนี้",
          value: kpi.data.todaySales.value,
          changePercent: kpi.data.todaySales.changePercent,
          changeLabel: kpi.data.todaySales.changeLabel,
          icon: TrendingUp,
        },
        {
          key: "estimatedProfit",
          label: "กำไรโดยประมาณ",
          value: kpi.data.estimatedProfit.value,
          changePercent: kpi.data.estimatedProfit.changePercent,
          changeLabel: kpi.data.estimatedProfit.changeLabel,
          icon: Wallet,
        },
        {
          key: "orders",
          label: "ออเดอร์",
          value: kpi.data.orders.value,
          changePercent: kpi.data.orders.changePercent,
          changeLabel: kpi.data.orders.changeLabel,
          icon: ShoppingBag,
        },
        {
          key: "averageWait",
          label: "เวลารอเฉลี่ย",
          value: kpi.data.averageWait.value,
          changePercent: kpi.data.averageWait.changePercent,
          changeLabel: kpi.data.averageWait.changeLabel,
          icon: Clock,
          invertTrend: true,
        },
      ]
    : [];

  return (
    <div className="space-y-6" data-ocid="ai.page">
      <PageHeader
        title="AI วิเคราะห์ยอดขาย"
        description="คำแนะนำจาก AI และภาพรวมยอดขายเพื่อเพิ่มกำไรให้ร้าน"
      />

      {/* AI แนะนำวันนี้ */}
      <Card
        className="overflow-hidden border-violet/30 bg-violet-soft/60 shadow-card"
        data-ocid="ai.recommendation.card"
      >
        <CardHeader className="gap-3 pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet text-violet-foreground">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <CardTitle className="font-display text-lg font-bold text-foreground">
                  AI แนะนำวันนี้
                </CardTitle>
                <CardDescription className="text-violet">
                  {generatedAt
                    ? `วิเคราะห์ล่าสุดเมื่อ ${formatDateTime(generatedAt)}`
                    : "สร้างคำแนะนำจากยอดขายและพฤติกรรมลูกค้าด้วย AI ของแพลตฟอร์ม"}
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isGenerating}
              className="border-violet/40 bg-card text-violet hover:bg-violet-soft hover:text-violet"
              data-ocid="ai.recommendation.refresh_button"
            >
              <RefreshCw
                className={isGenerating ? "animate-spin" : undefined}
                aria-hidden="true"
              />
              รีเฟรชคำแนะนำ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating ? (
            <RecommendationListSkeleton />
          ) : hasError ? (
            <div
              className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive-soft/60 p-4"
              data-ocid="ai.recommendation.error_state"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertTriangle className="size-4" aria-hidden="true" />
                ไม่สามารถสร้างคำแนะนำได้ในขณะนี้
              </div>
              <p className="text-sm text-muted-foreground">
                เกิดข้อผิดพลาดระหว่างให้ AI วิเคราะห์ยอดขาย กรุณาลองใหม่อีกครั้ง
              </p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRefresh}
                data-ocid="ai.recommendation.retry_button"
              >
                <RefreshCw aria-hidden="true" />
                ลองอีกครั้ง
              </Button>
            </div>
          ) : (
            <RecommendationList items={items} />
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-violet/20 pt-4">
            <Button
              type="button"
              onClick={() => setShowPlan((current) => !current)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="ai.recommendation.plan_button"
            >
              <TrendingUp aria-hidden="true" />
              ดูแผนเพิ่มยอดขาย
            </Button>
          </div>

          {showPlan ? (
            <div
              className="space-y-2 rounded-xl border border-violet/20 bg-card/70 p-4"
              data-ocid="ai.recommendation.plan_panel"
            >
              <p className="font-display text-sm font-semibold text-foreground">
                แผนเพิ่มยอดขายที่แนะนำ
              </p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                <li>
                  จัดเซ็ตข้าว + เครื่องดื่มจากเมนูขายดีใน 7 วันนี้ คาดว่าจะเพิ่มยอดขายได้อีก 25%
                </li>
                <li>
                  เร่งระบายวัตถุดิบใกล้หมดอายุ เช่น ผัดกะเพราและไข่ไก่ ควรใช้ภายใน 2 วัน
                </li>
                <li>ผลักดันเมนูที่กำไรสูงในช่วงเวลาที่ลูกค้าสั่งหนาแน่นเพื่อเพิ่มกำไรต่อออเดอร์</li>
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Sales insight */}
      <section className="space-y-4" data-ocid="ai.sales_section">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-foreground">
              ภาพรวมยอดขาย
            </h2>
            <p className="text-sm text-muted-foreground">
              ข้อมูลยอดขายและตัวชี้วัดสำคัญสำหรับวางแผนเพิ่มยอดขาย
            </p>
          </div>
          {salesReport.data ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                ยอดขายรวม{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatBaht(salesReport.data.totalSales)}
                </span>
              </span>
              <span className="text-muted-foreground">
                ออเดอร์รวม{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatCount(salesReport.data.totalOrders)}
                </span>
              </span>
            </div>
          ) : null}
        </div>

        {kpi.isLoading ? (
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            data-ocid="ai.kpi.loading_state"
          >
            {Array.from({ length: 4 }, (_, i) => `kpi-skeleton-${i}`).map(
              (id) => (
                <Card key={id} className="shadow-card border-border/70">
                  <CardContent className="h-[124px] animate-pulse p-5" />
                </Card>
              ),
            )}
          </div>
        ) : kpi.data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpiTiles.map((tile) => (
              <KpiCard
                key={tile.key}
                label={tile.label}
                value={tile.value}
                changePercent={tile.changePercent}
                changeLabel={tile.changeLabel}
                icon={tile.icon}
                invertTrend={tile.invertTrend}
                data-ocid={`ai.kpi.${tile.key}`}
              />
            ))}
          </div>
        ) : null}

        {salesReport.isLoading ? (
          <Card className="shadow-card border-border/70">
            <CardContent className="h-72 animate-pulse p-6" />
          </Card>
        ) : salesReport.data ? (
          <SalesInsightChart
            series={salesReport.data.series}
            periodLabel={PERIOD_LABEL}
            data-ocid="ai.sales_chart.card"
          />
        ) : (
          <Card className="shadow-card border-border/70">
            <CardContent
              className="flex h-40 flex-col items-center justify-center gap-2 text-center"
              data-ocid="ai.sales.error_state"
            >
              <Coins
                className="size-6 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                ไม่สามารถโหลดข้อมูลยอดขายได้ในขณะนี้
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
