import type { Recommendation } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Lightbulb, Sparkles } from "lucide-react";

export interface RecommendationListProps {
  items: Recommendation[];
  className?: string;
  "data-ocid"?: string;
}

/** Renders the AI recommendation items as a numbered list of insight rows. */
export function RecommendationList({
  items,
  className,
  ...rest
}: RecommendationListProps) {
  if (items.length === 0) {
    return (
      <p
        className={cn("text-sm text-violet", className)}
        data-ocid="ai.recommendation.empty_state"
      >
        ยังไม่มีคำแนะนำในขณะนี้ กดรีเฟรชเพื่อให้ AI วิเคราะห์ยอดขายอีกครั้ง
      </p>
    );
  }

  return (
    <ul className={cn("space-y-3", className)} {...rest}>
      {items.map((item, index) => (
        <li
          key={`${index}-${item.title}`}
          className="flex gap-3 rounded-xl border border-violet/20 bg-card/70 p-3.5"
          data-ocid={`ai.recommendation.item.${index + 1}`}
        >
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-soft text-violet">
            <Lightbulb className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="font-display text-sm font-semibold text-foreground">
              {item.title}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Layout-matched skeleton shown while the AI is generating recommendations. */
export function RecommendationListSkeleton() {
  const ids = Array.from(
    { length: 3 },
    (_, i) => `recommendation-skeleton-${i}`,
  );
  return (
    <div className="space-y-3" data-ocid="ai.recommendation.loading_state">
      <div className="flex items-center gap-2 text-sm font-medium text-violet">
        <Sparkles className="size-4 animate-pulse" aria-hidden="true" />
        กำลังสร้างคำแนะนำ…
      </div>
      {ids.map((id) => (
        <div
          key={id}
          className="flex gap-3 rounded-xl border border-violet/20 bg-card/70 p-3.5"
        >
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
