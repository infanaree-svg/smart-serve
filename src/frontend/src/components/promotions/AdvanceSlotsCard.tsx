import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdvanceSlots } from "@/hooks/use-backend";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CalendarClock, Clock } from "lucide-react";

const SKELETON_IDS = Array.from({ length: 4 }, (_, i) => `slot-skeleton-${i}`);

export interface AdvanceSlotsCardProps {
  /** Called when the user asks to view the upcoming orders. */
  onViewOrders?: () => void;
}

/**
 * Upcoming-order time slots (11:00–15:00) with the order count in each.
 * Green intensity scales with demand so busy windows read at a glance.
 */
export function AdvanceSlotsCard({ onViewOrders }: AdvanceSlotsCardProps) {
  const { data: slots, isLoading } = useAdvanceSlots();

  const maxCount = (slots ?? []).reduce(
    (max, slot) => Math.max(max, Number(slot.orderCount)),
    0,
  );

  return (
    <Card
      className="shadow-card gap-0 border-border/70 py-0"
      data-ocid="promotions.advance_slots_card"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <CalendarClock className="size-4" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="font-display text-base">
              ออเดอร์ล่วงหน้า
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              จำนวนออเดอร์ในแต่ละช่วงเวลา
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        {isLoading ? (
          <div className="space-y-3" data-ocid="promotions.slots_loading_state">
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : slots && slots.length > 0 ? (
          <ul className="space-y-2.5">
            {slots.map((slot, index) => {
              const count = Number(slot.orderCount);
              const ratio = maxCount > 0 ? count / maxCount : 0;
              return (
                <li
                  key={slot.id.toString()}
                  className="flex items-center gap-3 rounded-lg border border-border/70 px-3.5 py-2.5"
                  data-ocid={`promotions.slot.${index + 1}`}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Clock className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold tabular-nums text-foreground">
                      {slot.timeLabel}
                    </p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-smooth",
                          ratio >= 0.75
                            ? "bg-warning"
                            : ratio >= 0.4
                              ? "bg-primary"
                              : "bg-primary/50",
                        )}
                        style={{ width: `${Math.max(ratio * 100, 6)}%` }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 font-display text-sm font-bold tabular-nums text-foreground">
                    {formatCount(slot.orderCount)}
                    <span className="ml-1 text-xs font-medium text-muted-foreground">
                      ออเดอร์
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p
            className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground"
            data-ocid="promotions.slots_empty_state"
          >
            ยังไม่มีออเดอร์ล่วงหน้าในช่วงเวลานี้
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={onViewOrders}
          data-ocid="promotions.view_advance_orders_button"
        >
          ดูออเดอร์ล่วงหน้า
        </Button>
      </CardContent>
    </Card>
  );
}
