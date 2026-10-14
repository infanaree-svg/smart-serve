import { PageHeader } from "@/components/common/PageHeader";
import { OrdersTable, ReportSummary } from "@/components/reports/ReportSummary";
import { OrdersChart, SalesChart } from "@/components/reports/SalesChart";
import { useKpiSummary, useSalesReport } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PeriodOption {
  value: string;
  label: string;
}

const PERIODS: PeriodOption[] = [
  { value: "today", label: "วันนี้" },
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<string>("7d");

  const { data: report, isLoading: isReportLoading } = useSalesReport(period);
  const { data: kpi, isLoading: isKpiLoading } = useKpiSummary();

  const periodLabel =
    PERIODS.find((option) => option.value === period)?.label ?? "7 วัน";
  const series = report?.series ?? [];
  const isLoading = isReportLoading || isKpiLoading;

  return (
    <div className="space-y-6" data-ocid="reports.page">
      <PageHeader
        title="รายงาน"
        description="สรุปยอดขายและออเดอร์ย้อนหลังพร้อมกราฟ"
        actions={
          <div
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft"
            data-ocid="reports.period_selector"
          >
            {PERIODS.map((option) => {
              const isActive = option.value === period;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  data-ocid={`reports.period.${option.value}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        }
      />

      <ReportSummary
        totalSales={report?.totalSales ?? 0n}
        totalOrders={report?.totalOrders ?? 0n}
        kpi={kpi}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SalesChart
          series={series}
          isLoading={isReportLoading}
          periodLabel={periodLabel}
        />
        <OrdersChart
          series={series}
          isLoading={isReportLoading}
          periodLabel={periodLabel}
        />
      </div>

      <OrdersTable series={series} isLoading={isReportLoading} />
    </div>
  );
}
