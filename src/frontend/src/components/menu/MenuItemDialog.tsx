import type { MenuItem } from "@/backend";
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
import { useCreateMenuItem, useUpdateMenuItem } from "@/hooks/use-backend";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/** Preset categories offered in the form; free text is still allowed. */
export const MENU_CATEGORIES = [
  "อาหารจานหลัก",
  "อาหารจานเดียว",
  "ของทานเล่น",
  "เครื่องดื่ม",
  "ของหวาน",
] as const;

export interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this item; otherwise it creates a new one. */
  item?: MenuItem | null;
}

interface FormState {
  name: string;
  category: string;
  price: string;
}

const EMPTY_FORM: FormState = { name: "", category: "", price: "" };

/** Converts a satang bigint into a plain baht string for the price input. */
function satangToBahtInput(satang: bigint): string {
  const baht = Number(satang) / 100;
  return Number.isInteger(baht) ? String(baht) : baht.toFixed(2);
}

/**
 * Create / edit dialog for a menu item. Owns its own draft state and resets it
 * only when the dialog opens, so a background refetch never wipes typing.
 */
export function MenuItemDialog({
  open,
  onOpenChange,
  item,
}: MenuItemDialogProps) {
  const isEditing = Boolean(item);
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  // Seed the draft once each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      item
        ? {
            name: item.name,
            category: item.category,
            price: satangToBahtInput(item.price),
          }
        : EMPTY_FORM,
    );
  }, [open, item]);

  const isPending = createMenuItem.isPending || updateMenuItem.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const category = form.category.trim();
    const priceBaht = Number(form.price);

    if (!name) {
      setError("กรุณากรอกชื่อเมนู");
      return;
    }
    if (!category) {
      setError("กรุณาเลือกหรือกรอกหมวดหมู่");
      return;
    }
    if (!Number.isFinite(priceBaht) || priceBaht <= 0) {
      setError("กรุณากรอกราคาที่มากกว่า 0 บาท");
      return;
    }

    setError(null);
    const price = BigInt(Math.round(priceBaht * 100));
    const input = { name, category, price };

    if (item) {
      updateMenuItem.mutate(
        { id: item.id, input },
        {
          onSuccess: () => {
            toast.success("บันทึกการแก้ไขเมนูแล้ว");
            onOpenChange(false);
          },
          onError: () => setError("บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง"),
        },
      );
    } else {
      createMenuItem.mutate(input, {
        onSuccess: () => {
          toast.success("เพิ่มเมนูใหม่แล้ว");
          onOpenChange(false);
        },
        onError: () => setError("เพิ่มเมนูไม่สำเร็จ กรุณาลองอีกครั้ง"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="menu.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "ปรับปรุงชื่อ หมวดหมู่ และราคาของเมนูนี้"
              : "กรอกรายละเอียดเมนูใหม่เพื่อเพิ่มเข้าสู่รายการ"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="menu-name">ชื่อเมนู</Label>
            <Input
              id="menu-name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="เช่น ข้าวกะเพราหมูกรอบ"
              autoComplete="off"
              data-ocid="menu.name_input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-category">หมวดหมู่</Label>
            <Select
              value={form.category || undefined}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger
                id="menu-category"
                className="w-full"
                data-ocid="menu.category_select"
              >
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {MENU_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-price">ราคา (บาท)</Label>
            <Input
              id="menu-price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, price: event.target.value }))
              }
              placeholder="เช่น 65"
              data-ocid="menu.price_input"
            />
          </div>

          {error ? (
            <p
              className="text-sm font-medium text-destructive"
              role="alert"
              data-ocid="menu.error_state"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              data-ocid="menu.cancel_button"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="menu.submit_button"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {isEditing ? "บันทึก" : "เพิ่มเมนู"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
