import type { SalesPoint } from "@/backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBaht, formatCount } from "@/lib/format";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export interface SalesChartProps {
  series: SalesPoint[];
  isLoading: boolean;
  periodLabel: string;
}

const chartConfig = {
  sales: { label: "ยอดขาย", color: "var(--chart-1)" },
};

const SKELETON_IDS = Array.from({ length: 6 }, (_, i) => `sales-bar-${i}`);

/** Area chart of sales revenue across the report's time labels. */
export function SalesChart({
  series,
  isLoading,
  periodLabel,
}: SalesChartProps) {
  const data = series.map((point) => ({
    timeLabel: point.timeLabel,
    sales: Number(point.sales) / 100,
  }));

  return (
    <Card
      className="shadow-card border-border/70"
      data-ocid="reports.sales_chart"
    >
      <CardHeader>
        <CardTitle className="font-display text-base font-semibold">
          แนวโน้มยอดขาย
        </CardTitle>
        <CardDescription>ยอดขายรวมตามช่วงเวลา · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="flex h-[280px] items-end gap-3 px-2"
            data-ocid="reports.sales_chart.loading_state"
          >
            {SKELETON_IDS.map((id, index) => (
              <Skeleton
                key={id}
                className="flex-1 rounded-t-md"
                style={{ height: `${35 + ((index * 17) % 55)}%` }}
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div
            className="flex h-[280px] flex-col items-center justify-center gap-2 text-center"
            data-ocid="reports.sales_chart.empty_state"
          >
            <p className="text-sm font-medium text-foreground">
              ยังไม่มีข้อมูลยอดขาย
            </p>
            <p className="text-xs text-muted-foreground">
              เลือกช่วงเวลาอื่นเพื่อดูรายงาน
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
            data-ocid="reports.sales_chart.canvas"
          >
            <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(value: number) =>
                  `฿${value.toLocaleString("th-TH")}`
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) =>
                      formatBaht(BigInt(Math.round(Number(value) * 100)))
                    }
                  />
                }
              />
              <Area
                dataKey="sales"
                type="monotone"
                stroke="var(--color-sales)"
                strokeWidth={2.5}
                fill="url(#salesFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

/** Bar chart of order counts across the report's time labels. */
export function OrdersChart({
  series,
  isLoading,
  periodLabel,
}: SalesChartProps) {
  const data = series.map((point) => ({
    timeLabel: point.timeLabel,
    orders: Number(point.orders),
  }));

  return (
    <Card
      className="shadow-card border-border/70"
      data-ocid="reports.orders_chart"
    >
      <CardHeader>
        <CardTitle className="font-display text-base font-semibold">
          จำนวนออเดอร์
        </CardTitle>
        <CardDescription>ออเดอร์ต่อช่วงเวลา · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="flex h-[280px] items-end gap-3 px-2"
            data-ocid="reports.orders_chart.loading_state"
          >
            {SKELETON_IDS.map((id, index) => (
              <Skeleton
                key={id}
                className="flex-1 rounded-t-md"
                style={{ height: `${30 + ((index * 23) % 60)}%` }}
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div
            className="flex h-[280px] flex-col items-center justify-center gap-2 text-center"
            data-ocid="reports.orders_chart.empty_state"
          >
            <p className="text-sm font-medium text-foreground">
              ยังไม่มีข้อมูลออเดอร์
            </p>
            <p className="text-xs text-muted-foreground">
              เลือกช่วงเวลาอื่นเพื่อดูรายงาน
            </p>
          </div>
        ) : (
          <ChartContainer
            config={{ orders: { label: "ออเดอร์", color: "var(--chart-3)" } }}
            className="aspect-auto h-[280px] w-full"
            data-ocid="reports.orders_chart.canvas"
          >
            <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value) =>
                      `${formatCount(BigInt(Math.round(Number(value))))} ออเดอร์`
                    }
                  />
                }
              />
              <Area
                dataKey="orders"
                type="monotone"
                stroke="var(--color-orders)"
                strokeWidth={2.5}
                fill="var(--color-orders)"
                fillOpacity={0.15}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
