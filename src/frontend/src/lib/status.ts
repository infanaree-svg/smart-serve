import { OrderChannel, OrderStatus, RiderStatus, StockStatus } from "@/backend";

export type StatusTone =
  | "warning"
  | "info"
  | "success"
  | "destructive"
  | "violet"
  | "muted";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

/** Thai label + tone for each order status. */
export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  [OrderStatus.preparing]: { label: "กำลังทำ", tone: "warning" },
  [OrderStatus.awaitingPickup]: { label: "รอรับออเดอร์", tone: "info" },
  [OrderStatus.completed]: { label: "เสร็จแล้ว", tone: "success" },
};

/** Thai label + tone for each rider status. */
export const RIDER_STATUS_META: Record<RiderStatus, StatusMeta> = {
  [RiderStatus.delivering]: { label: "กำลังส่ง", tone: "info" },
  [RiderStatus.enRoute]: { label: "กำลังไปรับ", tone: "warning" },
  [RiderStatus.idle]: { label: "ว่าง", tone: "muted" },
};

/** Thai label + tone for each stock status. */
export const STOCK_STATUS_META: Record<StockStatus, StatusMeta> = {
  [StockStatus.fresh]: { label: "สดใหม่", tone: "success" },
  [StockStatus.low]: { label: "ใกล้หมด", tone: "warning" },
  [StockStatus.expiringSoon]: { label: "ใกล้หมดอายุ", tone: "destructive" },
};

/** Thai label for each order channel. */
export const ORDER_CHANNEL_LABEL: Record<OrderChannel, string> = {
  [OrderChannel.dineIn]: "ทานที่ร้าน",
  [OrderChannel.online]: "ออนไลน์",
};

export function orderStatusMeta(status: OrderStatus): StatusMeta {
  return ORDER_STATUS_META[status] ?? { label: "ไม่ทราบสถานะ", tone: "muted" };
}

export function riderStatusMeta(status: RiderStatus): StatusMeta {
  return RIDER_STATUS_META[status] ?? { label: "ไม่ทราบสถานะ", tone: "muted" };
}

export function stockStatusMeta(status: StockStatus): StatusMeta {
  return STOCK_STATUS_META[status] ?? { label: "ไม่ทราบสถานะ", tone: "muted" };
}
