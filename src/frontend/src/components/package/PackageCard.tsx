import type { PackageInfo } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBaht } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";

export interface PackageCardProps {
  info: PackageInfo;
  onViewDetails: () => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * Hero pricing card for the monthly Smart Serve+ package.
 * Deep-green gradient panel, orange value badge, trial label and a
 * checklist of the tools bundled with the plan.
 */
export function PackageCard({
  info,
  onViewDetails,
  className,
  ...rest
}: PackageCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/70 shadow-elevated",
        className,
      )}
      {...rest}
    >
      <div className="bg-gradient-primary px-6 py-6 text-primary-foreground sm:px-8 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">
              แพ็กเกจรายเดือน
            </p>
            <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">
              Smart Serve+ Pro
            </h2>
          </div>
          {info.badge ? (
            <Badge
              className="border-transparent bg-warning text-warning-foreground shadow-soft"
              data-ocid="package.badge"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              {info.badge}
            </Badge>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span
            className="font-display text-4xl font-extrabold tabular-nums sm:text-5xl"
            data-ocid="package.price"
          >
            {formatBaht(info.pricePerMonth)}
          </span>
          <span className="pb-1 text-sm font-medium text-primary-foreground/85">
            /เดือน
          </span>
        </div>

        {info.trialLabel ? (
          <p
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold"
            data-ocid="package.trial_label"
          >
            <Check className="size-3.5" aria-hidden="true" />
            {info.trialLabel}
          </p>
        ) : null}
      </div>

      <CardContent className="space-y-5 p-6 sm:p-8">
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold text-foreground">
            เครื่องมือที่รวมในแพ็กเกจ
          </h3>
          <p className="text-sm text-muted-foreground">
            ครบทุกฟังก์ชันที่ร้านอาหารต้องการ ใช้งานได้ทันทีหลังสมัคร
          </p>
        </div>

        <ul
          className="grid gap-3 sm:grid-cols-2"
          data-ocid="package.feature_list"
        >
          {info.features.map((feature, index) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 rounded-lg bg-secondary/60 px-3 py-2.5"
              data-ocid={`package.feature.${index + 1}`}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          size="lg"
          onClick={onViewDetails}
          className="w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
          data-ocid="package.details_button"
        >
          ดูรายละเอียดเพิ่มเติม
        </Button>
      </CardContent>
    </Card>
  );
}

/** Layout-matched skeleton shown while the package query is pending. */
export function PackageCardSkeleton() {
  return (
    <Card
      className="overflow-hidden border-border/70 shadow-elevated"
      data-ocid="package.loading_state"
    >
      <div className="space-y-4 bg-muted/60 px-6 py-6 sm:px-8 sm:py-7">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <CardContent className="space-y-5 p-6 sm:p-8">
        <Skeleton className="h-5 w-52" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => `feature-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-11 w-full rounded-lg" />
            ),
          )}
        </div>
        <Skeleton className="h-11 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
