import type { KpiSummary, SalesPoint } from "@/backend";
import { KpiCard } from "@/components/common/KpiCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBaht, formatCount } from "@/lib/format";
import { Clock, Receipt, ShoppingBag, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ReportSummaryProps {
  totalSales: bigint;
  totalOrders: bigint;
  kpi: KpiSummary | null | undefined;
  isLoading: boolean;
}

const KPI_SKELETON_IDS = Array.from({ length: 4 }, (_, i) => `report-kpi-${i}`);

interface KpiSlot {
  key: keyof KpiSummary;
  icon: LucideIcon;
  invertTrend?: boolean;
}

const KPI_SLOTS: KpiSlot[] = [
  { key: "todaySales", icon: Receipt },
  { key: "estimatedProfit", icon: TrendingUp },
  { key: "orders", icon: ShoppingBag },
  { key: "averageWait", icon: Clock, invertTrend: true },
];

/** Headline totals for the selected period plus the shared KPI tiles. */
export function ReportSummary({
  totalSales,
  totalOrders,
  kpi,
  isLoading,
}: ReportSummaryProps) {
  return (
    <div className="space-y-4" data-ocid="reports.summary">
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        data-ocid="reports.totals_section"
      >
        <Card
          className="shadow-card border-border/70"
          data-ocid="reports.total_sales_card"
        >
          <CardContent className="flex flex-col gap-1 p-5">
            <span className="text-sm font-medium text-muted-foreground">
              ยอดขายรวมตามช่วงเวลา
            </span>
            {isLoading ? (
              <Skeleton className="mt-1 h-8 w-36" />
            ) : (
              <span className="font-display text-3xl font-bold tabular-nums text-primary">
                {formatBaht(totalSales)}
              </span>
            )}
          </CardContent>
        </Card>
        <Card
          className="shadow-card border-border/70"
          data-ocid="reports.total_orders_card"
        >
          <CardContent className="flex flex-col gap-1 p-5">
            <span className="text-sm font-medium text-muted-foreground">
              ออเดอร์รวมตามช่วงเวลา
            </span>
            {isLoading ? (
              <Skeleton className="mt-1 h-8 w-28" />
            ) : (
              <span className="font-display text-3xl font-bold tabular-nums text-info">
                {formatCount(totalOrders)}
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        data-ocid="reports.kpi_section"
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
              const item = kpi[slot.key];
              return (
                <KpiCard
                  key={slot.key}
                  label={item.timeLabel}
                  value={item.value}
                  changePercent={item.changePercent}
                  changeLabel={item.changeLabel}
                  icon={slot.icon}
                  invertTrend={slot.invertTrend}
                  data-ocid={`reports.kpi_card.${index + 1}`}
                />
              );
            })}
      </section>
    </div>
  );
}

export interface OrdersTableProps {
  series: SalesPoint[];
  isLoading: boolean;
}

const TABLE_SKELETON_IDS = Array.from(
  { length: 5 },
  (_, i) => `report-row-${i}`,
);

/** Tabular breakdown of orders and sales per period. */
export function OrdersTable({ series, isLoading }: OrdersTableProps) {
  return (
    <Card
      className="shadow-card border-border/70"
      data-ocid="reports.orders_table"
    >
      <CardHeader>
        <CardTitle className="font-display text-base font-semibold">
          รายละเอียดตามช่วงเวลา
        </CardTitle>
        <CardDescription>ยอดขายและจำนวนออเดอร์ในแต่ละช่วง</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">ช่วงเวลา</TableHead>
              <TableHead className="text-right">ออเดอร์</TableHead>
              <TableHead className="pr-6 text-right">ยอดขาย</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              TABLE_SKELETON_IDS.map((id) => (
                <TableRow key={id}>
                  <TableCell className="pl-6">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-12" />
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : series.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-sm text-muted-foreground"
                  data-ocid="reports.orders_table.empty_state"
                >
                  ยังไม่มีข้อมูลสำหรับช่วงเวลานี้
                </TableCell>
              </TableRow>
            ) : (
              series.map((point, index) => (
                <TableRow
                  key={point.timeLabel}
                  data-ocid={`reports.orders_table.row.${index + 1}`}
                >
                  <TableCell className="pl-6 font-medium text-foreground">
                    {point.timeLabel}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">
                    {formatCount(point.orders)}
                  </TableCell>
                  <TableCell className="pr-6 text-right font-semibold tabular-nums text-primary">
                    {formatBaht(point.sales)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
