import type { Rider } from "@/backend";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { riderStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import { Bike, MapPin, Navigation, Route, Star } from "lucide-react";

export interface RiderTrackingCardProps {
  rider: Rider | null;
  isLoading: boolean;
  riders: Rider[];
  ridersLoading: boolean;
}

/** Static map-style route visual with a dashed route line and pins. */
function RouteMap({ riderName }: { riderName: string }) {
  return (
    <div
      className="relative h-44 w-full overflow-hidden rounded-xl border border-border bg-secondary"
      data-ocid="queue.rider.map"
    >
      <svg
        viewBox="0 0 400 176"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="map-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          </pattern>
        </defs>
        <rect width="400" height="176" fill="url(#map-grid)" />
        <path
          d="M 40 140 C 110 140 120 60 200 60 S 300 40 360 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="8 7"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>

      <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-soft">
        <MapPin className="size-3.5 text-primary" aria-hidden="true" />
        ร้านครัวคุณอ้วย
      </span>

      <span className="absolute top-3 right-4 flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-soft">
        <Navigation className="size-3.5 text-info" aria-hidden="true" />
        จุดส่ง
      </span>

      <span
        className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated ring-4 ring-card"
        title={riderName}
      >
        <Bike className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}

/**
 * Rider tracking card: rider identity, rating, status, remaining distance and
 * ETA, a static route map, and a list of riders currently delivering.
 */
export function RiderTrackingCard({
  rider,
  isLoading,
  riders,
  ridersLoading,
}: RiderTrackingCardProps) {
  const delivering = riders.filter((item) => item.status !== "idle");

  return (
    <Card className="shadow-card border-border/70" data-ocid="queue.rider.card">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-base font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Route className="size-4" aria-hidden="true" />
          </span>
          ติดตามไรเดอร์
        </CardTitle>
        {rider ? (
          <StatusPill
            label={riderStatusMeta(rider.status).label}
            tone={riderStatusMeta(rider.status).tone}
            data-ocid="queue.rider.status"
          />
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4" data-ocid="queue.rider.loading_state">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : rider ? (
          <>
            <RouteMap riderName={rider.name} />

            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                  {rider.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-foreground">
                    {rider.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star
                      className="size-3.5 fill-warning text-warning"
                      aria-hidden="true"
                    />
                    <span className="font-semibold tabular-nums text-foreground">
                      {rider.rating.toFixed(1)}
                    </span>
                    คะแนน
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary-soft hover:text-primary"
                data-ocid="queue.rider.full_route_button"
              >
                <Navigation className="size-4" aria-hidden="true" />
                ดูเส้นทางแบบเต็ม
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary px-3 py-2.5">
                <p className="text-xs text-muted-foreground">ระยะทางที่เหลือ</p>
                <p className="font-display text-lg font-bold tabular-nums text-foreground">
                  {rider.distanceKm.toFixed(1)}{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    กม.
                  </span>
                </p>
              </div>
              <div className="rounded-lg bg-secondary px-3 py-2.5">
                <p className="text-xs text-muted-foreground">
                  เวลาที่ใช้โดยประมาณ
                </p>
                <p className="font-display text-lg font-bold tabular-nums text-foreground">
                  {rider.etaMinutes.toString()}{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    นาที
                  </span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <p
            className="rounded-lg bg-secondary px-3 py-6 text-center text-sm text-muted-foreground"
            data-ocid="queue.rider.empty_state"
          >
            ยังไม่มีไรเดอร์ที่กำลังจัดส่งในขณะนี้
          </p>
        )}

        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            ไรเดอร์ที่กำลังจัดส่ง
          </p>

          {ridersLoading ? (
            <div
              className="space-y-2"
              data-ocid="queue.rider.list_loading_state"
            >
              {Array.from({ length: 3 }, (_, i) => `rider-skeleton-${i}`).map(
                (id) => (
                  <Skeleton key={id} className="h-12 w-full rounded-lg" />
                ),
              )}
            </div>
          ) : delivering.length > 0 ? (
            <ul className="space-y-2" data-ocid="queue.rider.list">
              {delivering.map((item, index) => {
                const meta = riderStatusMeta(item.status);
                return (
                  <li
                    key={item.id.toString()}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5"
                    data-ocid={`queue.rider.item.${index + 1}`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary",
                        )}
                      >
                        <Bike className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                          {item.distanceKm.toFixed(1)} กม. ·{" "}
                          {item.etaMinutes.toString()} นาที
                        </p>
                      </div>
                    </div>
                    <StatusPill label={meta.label} tone={meta.tone} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p
              className="rounded-lg bg-secondary px-3 py-4 text-center text-sm text-muted-foreground"
              data-ocid="queue.rider.list_empty_state"
            >
              ไม่มีไรเดอร์ที่กำลังจัดส่ง
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
