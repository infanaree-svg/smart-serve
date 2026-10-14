import type { Promotion } from "@/backend";
import { Card, CardContent } from "@/components/ui/card";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Tag, Users } from "lucide-react";

export interface PromotionCardProps {
  promotion: Promotion;
  /** 1-based position used for deterministic test markers. */
  index: number;
}

/**
 * Active promotion card: name, discount, target group and projected lift.
 * Orange accent marks the promotion domain; green marks the active state.
 */
export function PromotionCard({ promotion, index }: PromotionCardProps) {
  const discount = Number(promotion.discountPercent);
  const lift = Number(promotion.projectedOrderLiftPercent);

  return (
    <Card
      className="shadow-card gap-0 border-border/70 py-0 transition-smooth hover:shadow-elevated"
      data-ocid={`promotions.item.${index}`}
    >
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
              <Tag className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-1">
              <h3 className="truncate font-display text-base font-semibold text-foreground">
                {promotion.name}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{promotion.targetGroup}</span>
              </p>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
              promotion.active
                ? "bg-success-soft text-success"
                : "bg-muted text-muted-foreground",
            )}
            data-ocid={`promotions.status.${index}`}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                promotion.active ? "bg-success" : "bg-muted-foreground",
              )}
              aria-hidden="true"
            />
            {promotion.active ? "ใช้งานอยู่" : "ปิดใช้งาน"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-warning-soft/60 px-3 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">ส่วนลด</p>
            <p className="font-display text-xl font-bold tabular-nums text-warning">
              {discount}%
            </p>
          </div>
          <div className="rounded-lg bg-primary-soft/60 px-3 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">
              คาดการณ์ยอดสั่งซื้อ
            </p>
            <p className="flex items-center gap-1 font-display text-xl font-bold tabular-nums text-primary">
              <ArrowUpRight className="size-4" aria-hidden="true" />+{lift}%
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          รหัสโปรโมชัน #{formatCount(promotion.id)}
        </p>
      </CardContent>
    </Card>
  );
}
