import { StockStatus } from "@/backend";
import type { Ingredient } from "@/backend";
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
import { useUpdateIngredient } from "@/hooks/use-backend";
import { STOCK_STATUS_META } from "@/lib/status";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface IngredientDialogProps {
  /** The ingredient being edited, or null when the dialog is closed. */
  ingredient: Ingredient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS: StockStatus[] = [
  StockStatus.fresh,
  StockStatus.low,
  StockStatus.expiringSoon,
];

/**
 * Modal for editing an ingredient's remaining quantity and stock status.
 * The draft is owned locally and only reset when a new ingredient is opened.
 */
export function IngredientDialog({
  ingredient,
  open,
  onOpenChange,
}: IngredientDialogProps) {
  const updateIngredient = useUpdateIngredient();
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState<StockStatus>(StockStatus.fresh);
  const [error, setError] = useState<string | null>(null);

  // One-time initialization whenever a different ingredient is opened.
  useEffect(() => {
    if (ingredient) {
      setQuantity(ingredient.quantity.toString());
      setStatus(ingredient.status);
      setError(null);
    }
  }, [ingredient]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ingredient) return;

    const parsed = Number.parseInt(quantity, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setError("กรุณากรอกจำนวนคงเหลือเป็นตัวเลขที่ไม่ติดลบ");
      return;
    }
    setError(null);

    updateIngredient.mutate(
      { id: ingredient.id, input: { quantity: BigInt(parsed), status } },
      {
        onSuccess: () => {
          toast.success("บันทึกข้อมูลวัตถุดิบแล้ว", {
            description: `${ingredient.name} · ${parsed} ${ingredient.unit}`,
          });
          onOpenChange(false);
        },
        onError: () => {
          setError("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="stock.edit_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">แก้ไขวัตถุดิบ</DialogTitle>
          <DialogDescription>
            {ingredient
              ? `ปรับจำนวนคงเหลือและสถานะของ ${ingredient.name}`
              : "ปรับจำนวนคงเหลือและสถานะวัตถุดิบ"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredient-quantity">จำนวนคงเหลือ</Label>
            <div className="flex items-center gap-2">
              <Input
                id="ingredient-quantity"
                type="number"
                min={0}
                inputMode="numeric"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="tabular-nums"
                data-ocid="stock.quantity_input"
              />
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                {ingredient?.unit ?? "หน่วย"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredient-status">สถานะ</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as StockStatus)}
            >
              <SelectTrigger
                id="ingredient-status"
                data-ocid="stock.status_select"
              >
                <SelectValue placeholder="เลือกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {STOCK_STATUS_META[option].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? (
            <p
              className="text-sm font-medium text-destructive"
              data-ocid="stock.edit_error"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="stock.cancel_button"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={updateIngredient.isPending}
              data-ocid="stock.save_button"
            >
              {updateIngredient.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              บันทึก
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
