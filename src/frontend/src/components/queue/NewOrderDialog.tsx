import { OrderChannel } from "@/backend";
import type { NewOrder } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_CHANNEL_LABEL } from "@/lib/status";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: NewOrder) => void;
  isPending: boolean;
  isError: boolean;
}

/** Converts a "HH:MM" time input into a nanosecond timestamp on today's date. */
function timeToTimestamp(value: string): bigint {
  const [hours, minutes] = value.split(":").map((part) => Number(part));
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return BigInt(date.getTime()) * 1_000_000n;
}

/** Current local time as "HH:MM" for the default form values. */
function nowTimeValue(offsetMinutes = 0): string {
  const date = new Date(Date.now() + offsetMinutes * 60_000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Dialog form for creating a new order: menu name, ordered time, expected time
 * and channel. Clears its draft synchronously on submit.
 */
export function NewOrderDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  isError,
}: NewOrderDialogProps) {
  const [menuName, setMenuName] = useState("");
  const [orderedTime, setOrderedTime] = useState(() => nowTimeValue());
  const [expectedTime, setExpectedTime] = useState(() => nowTimeValue(15));
  const [channel, setChannel] = useState<OrderChannel>(OrderChannel.dineIn);

  const canSubmit = menuName.trim().length > 0 && !isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const draft: NewOrder = {
      menuName: menuName.trim(),
      orderedAt: timeToTimestamp(orderedTime),
      expectedAt: timeToTimestamp(expectedTime),
      channel,
    };

    setMenuName("");
    setOrderedTime(nowTimeValue());
    setExpectedTime(nowTimeValue(15));
    setChannel(OrderChannel.dineIn);

    onSubmit(draft);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-ocid="queue.new_order.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">เพิ่มออเดอร์ใหม่</DialogTitle>
          <DialogDescription>กรอกข้อมูลออเดอร์เพื่อเพิ่มเข้าคิวครัวทันที</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order-menu-name">เมนูอาหาร</Label>
            <Input
              id="order-menu-name"
              value={menuName}
              onChange={(event) => setMenuName(event.target.value)}
              placeholder="เช่น ข้าวกะเพราหมูกรอบ"
              autoComplete="off"
              data-ocid="queue.new_order.menu_input"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order-ordered-time">เวลาสั่งซื้อ</Label>
              <Input
                id="order-ordered-time"
                type="time"
                value={orderedTime}
                onChange={(event) => setOrderedTime(event.target.value)}
                data-ocid="queue.new_order.ordered_time_input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-expected-time">เวลาที่คาดว่าจะเสร็จ</Label>
              <Input
                id="order-expected-time"
                type="time"
                value={expectedTime}
                onChange={(event) => setExpectedTime(event.target.value)}
                data-ocid="queue.new_order.expected_time_input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order-channel">ช่องทาง</Label>
            <Select
              value={channel}
              onValueChange={(value) => setChannel(value as OrderChannel)}
            >
              <SelectTrigger
                id="order-channel"
                className="w-full"
                data-ocid="queue.new_order.channel_select"
              >
                <SelectValue placeholder="เลือกช่องทาง" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderChannel.dineIn}>
                  {ORDER_CHANNEL_LABEL[OrderChannel.dineIn]}
                </SelectItem>
                <SelectItem value={OrderChannel.online}>
                  {ORDER_CHANNEL_LABEL[OrderChannel.online]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isError ? (
            <p
              className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive"
              data-ocid="queue.new_order.error_state"
            >
              เพิ่มออเดอร์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="queue.new_order.cancel_button"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              data-ocid="queue.new_order.submit_button"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
              เพิ่มออเดอร์
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
