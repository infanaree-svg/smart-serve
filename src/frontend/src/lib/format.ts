/**
 * Shared formatting helpers for the Smart Serve+ dashboard.
 * Backend money values are satang (bigint); timestamps are nanosecond bigints.
 */

const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

/** Converts a backend nanosecond timestamp into a Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats satang (bigint) as Thai baht, e.g. 482000n -> "฿4,820". */
export function formatBaht(satang: bigint): string {
  const baht = Number(satang) / 100;
  return `฿${baht.toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Formats a plain number as Thai baht, e.g. 4820 -> "฿4,820". */
export function formatBahtNumber(baht: number): string {
  return `฿${baht.toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Formats a backend timestamp as "29 ส.ค. 21:30". */
export function formatDateTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const day = date.getDate();
  const month = THAI_MONTHS_SHORT[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
}

/** Formats a backend timestamp as a short time "21:30". */
export function formatTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** Formats a signed percentage change, e.g. 12 -> "+12%", -6 -> "-6%". */
export function formatPercentChange(percent: number): string {
  const rounded = Math.round(percent * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}%`;
}

/** Formats a bigint count with Thai thousands separators. */
export function formatCount(value: bigint): string {
  return Number(value).toLocaleString("th-TH");
}
