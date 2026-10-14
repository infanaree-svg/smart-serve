import { PageHeader } from "@/components/common/PageHeader";
import { CostCalculator } from "@/components/cost/CostCalculator";
import { MenuMarginTable } from "@/components/cost/MenuMarginTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useKpiSummary,
  useMenuItems,
  useSalesReport,
} from "@/hooks/use-backend";
import { formatBaht, formatBahtNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Coins, Receipt, TrendingUp } from "lucide-react";
import { useMemo } from "react";

/** Default ingredient cost ratio used when a menu has no entered cost yet. */
const DEFAULT_COST_RATIO = 0.6;

export default function CostPage() {
  const menuQuery = useMenuItems();
  const kpiQuery = useKpiSummary();
  const salesQuery = useSalesReport("today");

  const menuItems = menuQuery.data ?? [];

  // Seed the table with a default cost ratio so it renders meaningfully before
  // the user enters per-menu costs.
  const effectiveCosts = useMemo(() => {
    const seeded: Record<string, number> = {};
    for (const item of menuItems) {
      const id = item.id.toString();
      const price = Number(item.price) / 100;
      seeded[id] = price * DEFAULT_COST_RATIO;
    }
    return seeded;
  }, [menuItems]);

  const estimatedProfit = kpiQuery.data?.estimatedProfit;
  const totalSales = salesQuery.data?.totalSales ?? 0n;
  const totalOrders = salesQuery.data?.totalOrders ?? 0n;

  const profitValue = estimatedProfit
    ? Number.parseFloat(estimatedProfit.value.replace(/[^\d.-]/g, ""))
    : 0;
  const salesValue = Number(totalSales) / 100;
  const profitShare = salesValue > 0 ? (profitValue / salesValue) * 100 : 0;

  const summaryLoading = kpiQuery.isLoading || salesQuery.isLoading;

  return (
    <div className="space-y-6" data-ocid="cost.page">
      <PageHeader
        title="คำนวณต้นทุน"
        description="วิเคราะห์ต้นทุนวัตถุดิบและกำไรต่อเมนู พร้อมสรุปกำไรโดยประมาณของวัน"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CostCalculator
            menuItems={menuItems}
            isLoading={menuQuery.isLoading}
            data-ocid="cost.calculator_card"
          />
        </div>

        <div className="lg:col-span-2">
          <Card
            className="shadow-card border-border/70 h-full"
            data-ocid="cost.summary_card"
          >
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Coins className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <CardTitle className="font-display text-base font-bold">
                  สรุปกำไรโดยประมาณของวัน
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  เทียบกำไรกับยอดขายจากรายงานยอดขาย
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {summaryLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-border/70 bg-secondary/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <TrendingUp className="size-3.5" aria-hidden="true" />
                      กำไรโดยประมาณ
                    </div>
                    <p
                      className="mt-1 font-display text-2xl font-bold tabular-nums text-success"
                      data-ocid="cost.summary_profit"
                    >
                      {estimatedProfit ? estimatedProfit.value : formatBaht(0n)}
                    </p>
                    {estimatedProfit ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {estimatedProfit.changeLabel}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-lg border border-border/70 bg-secondary/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Receipt className="size-3.5" aria-hidden="true" />
                      ยอดขายรวมวันนี้
                    </div>
                    <p
                      className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground"
                      data-ocid="cost.summary_sales"
                    >
                      {formatBaht(totalSales)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      จาก {Number(totalOrders).toLocaleString("th-TH")} ออเดอร์
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-primary-soft px-4 py-3">
                    <span className="text-sm font-medium text-primary">
                      สัดส่วนกำไรต่อยอดขาย
                    </span>
                    <span
                      className={cn(
                        "font-display text-lg font-bold tabular-nums",
                        profitShare >= 30 ? "text-success" : "text-warning",
                      )}
                      data-ocid="cost.summary_profit_share"
                    >
                      {profitShare.toFixed(1)}%
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    กำไรโดยประมาณคำนวณจากยอดขายวันนี้ หักต้นทุนวัตถุดิบโดยประมาณ
                    {profitValue > 0
                      ? ` (${formatBahtNumber(profitValue)} จาก ${formatBahtNumber(salesValue)})`
                      : ""}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <MenuMarginTable
        menuItems={menuItems}
        isLoading={menuQuery.isLoading}
        costByMenuId={effectiveCosts}
        data-ocid="cost.margin_table_card"
      />
    </div>
  );
}
