import type { SalesPoint } from "@/backend";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatBaht, formatCount } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export interface SalesInsightChartProps {
  series: SalesPoint[];
  periodLabel: string;
  "data-ocid"?: string;
}

const chartConfig = {
  sales: {
    label: "ยอดขาย",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

/** Bar chart of the sales series, with Thai baht axis labels. */
export function SalesInsightChart({
  series,
  periodLabel,
  ...rest
}: SalesInsightChartProps) {
  const data = series.map((point) => ({
    timeLabel: point.timeLabel,
    sales: Number(point.sales) / 100,
    orders: Number(point.orders),
  }));

  return (
    <Card className="shadow-card border-border/70" {...rest}>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base font-semibold">
          แนวโน้มยอดขาย
        </CardTitle>
        <CardDescription>ยอดขายตามช่วงเวลา · {periodLabel}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length === 0 ? (
          <div
            className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground"
            data-ocid="ai.sales_chart.empty_state"
          >
            ยังไม่มีข้อมูลยอดขายสำหรับช่วงเวลานี้
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-64 w-full"
            data-ocid="ai.sales_chart"
          >
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="timeLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                fontSize={12}
                tickFormatter={(value: number) =>
                  `฿${value.toLocaleString("th-TH")}`
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => {
                      const orders = item?.payload?.orders as
                        | number
                        | undefined;
                      return (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            ยอดขาย{" "}
                            {formatBaht(
                              BigInt(Math.round(Number(value) * 100)),
                            )}
                          </span>
                          {orders !== undefined ? (
                            <span className="text-muted-foreground">
                              {formatCount(BigInt(orders))} ออเดอร์
                            </span>
                          ) : null}
                        </div>
                      );
                    }}
                  />
                }
              />
              <Bar
                dataKey="sales"
                fill="var(--color-sales)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
