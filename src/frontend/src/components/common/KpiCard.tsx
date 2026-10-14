import { Card, CardContent } from "@/components/ui/card";
import { formatPercentChange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface KpiCardProps {
  label: string;
  value: string;
  changePercent: number;
  changeLabel: string;
  icon: LucideIcon;
  /** When true, a negative change is the good outcome (e.g. average wait time). */
  invertTrend?: boolean;
  "data-ocid"?: string;
}

/**
 * KPI tile: icon badge, headline value and a delta pill.
 * Delta pill is green when the change is favourable, red otherwise.
 */
export function KpiCard({
  label,
  value,
  changePercent,
  changeLabel,
  icon: Icon,
  invertTrend = false,
  ...rest
}: KpiCardProps) {
  const isUp = changePercent >= 0;
  const isFavourable = invertTrend ? !isUp : isUp;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="shadow-card border-border/70" {...rest}>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <span className="font-display text-2xl font-bold tabular-nums text-foreground">
            {value}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
              isFavourable
                ? "bg-success-soft text-success"
                : "bg-destructive-soft text-destructive",
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {formatPercentChange(changePercent)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{changeLabel}</span>
      </CardContent>
    </Card>
  );
}
