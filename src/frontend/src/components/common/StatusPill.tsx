import type { StatusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<StatusTone, string> = {
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  destructive: "bg-destructive-soft text-destructive",
  violet: "bg-violet-soft text-violet",
  muted: "bg-muted text-muted-foreground",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  warning: "bg-warning",
  info: "bg-info",
  success: "bg-success",
  destructive: "bg-destructive",
  violet: "bg-violet",
  muted: "bg-muted-foreground",
};

export interface StatusPillProps {
  label: string;
  tone: StatusTone;
  className?: string;
  /** Optional deterministic test marker. */
  "data-ocid"?: string;
}

/**
 * Compact status badge used across order, rider and stock tables.
 * Orange = กำลังทำ, blue = รอรับออเดอร์, green = เสร็จแล้ว.
 */
export function StatusPill({
  label,
  tone,
  className,
  ...rest
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      <span
        className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
