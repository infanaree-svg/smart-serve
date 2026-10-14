import type { Order } from "@/backend";
import { OrderStatus } from "@/backend";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime } from "@/lib/format";
import { ORDER_CHANNEL_LABEL, orderStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Loader2, Utensils } from "lucide-react";

export interface OrderTableProps {
  orders: Order[];
  onAdvance: (id: bigint) => void;
  advancingId: bigint | null;
  isAdvancing: boolean;
}

/** Next-status action label per current status. */
function nextActionLabel(status: OrderStatus): string {
  if (status === OrderStatus.preparing) return "พร้อมรับ";
  if (status === OrderStatus.awaitingPickup) return "เสร็จแล้ว";
  return "เสร็จแล้ว";
}

/**
 * Live order table: order number, menu, ordered time, expected time and status,
 * with a per-row action that advances the order to its next status.
 */
export function OrderTable({
  orders,
  onAdvance,
  advancingId,
  isAdvancing,
}: OrderTableProps) {
  return (
    <Table data-ocid="queue.orders.table">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[110px] pl-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            หมายเลขออเดอร์
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            เมนูอาหาร
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            เวลาสั่งซื้อ
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            เวลาที่คาดว่าจะเสร็จ
          </TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            สถานะ
          </TableHead>
          <TableHead className="w-[130px] pr-4 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            การจัดการ
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => {
          const meta = orderStatusMeta(order.status);
          const isCompleted = order.status === OrderStatus.completed;
          const isRowAdvancing = isAdvancing && advancingId === order.id;

          return (
            <TableRow
              key={order.id.toString()}
              className="group"
              data-ocid={`queue.orders.row.${index + 1}`}
            >
              <TableCell className="pl-4">
                <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {order.orderNumber}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Utensils className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {order.menuName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ORDER_CHANNEL_LABEL[order.channel]}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm tabular-nums text-muted-foreground">
                {formatTime(order.orderedAt)}
              </TableCell>
              <TableCell className="text-sm tabular-nums text-muted-foreground">
                {formatTime(order.expectedAt)}
              </TableCell>
              <TableCell>
                <StatusPill
                  label={meta.label}
                  tone={meta.tone}
                  data-ocid={`queue.orders.status.${index + 1}`}
                />
              </TableCell>
              <TableCell className="pr-4 text-right">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <Check className="size-4" aria-hidden="true" />
                    เสร็จสิ้น
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAdvance(order.id)}
                    disabled={isRowAdvancing}
                    className={cn(
                      "border-primary/30 text-primary hover:bg-primary-soft hover:text-primary",
                    )}
                    data-ocid={`queue.orders.advance_button.${index + 1}`}
                  >
                    {isRowAdvancing ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <ArrowRight className="size-4" aria-hidden="true" />
                    )}
                    {nextActionLabel(order.status)}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
