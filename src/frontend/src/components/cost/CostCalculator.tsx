import type { MenuItem } from "@/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBaht, formatBahtNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

export interface CostCalculatorProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  "data-ocid"?: string;
}

/** Margin below this percentage is flagged as low. */
export const LOW_MARGIN_THRESHOLD = 30;

function marginTone(margin: number): {
  text: string;
  soft: string;
  label: string;
} {
  if (margin < 0) {
    return {
      text: "text-destructive",
      soft: "bg-destructive-soft",
      label: "ขาดทุน",
    };
  }
  if (margin < LOW_MARGIN_THRESHOLD) {
    return {
      text: "text-warning",
      soft: "bg-warning-soft",
      label: "กำไรต่ำ",
    };
  }
  return {
    text: "text-success",
    soft: "bg-success-soft",
    label: "กำไรดี",
  };
}

/**
 * Live cost calculator: pick a menu item, enter the ingredient cost, and see
 * selling price, profit per dish and margin percentage update instantly.
 */
export function CostCalculator({
  menuItems,
  isLoading,
  ...rest
}: CostCalculatorProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [costInput, setCostInput] = useState<string>("");

  const selected = useMemo(
    () => menuItems.find((item) => item.id.toString() === selectedId) ?? null,
    [menuItems, selectedId],
  );

  const ingredientCost = Number.parseFloat(costInput);
  const hasCost = costInput.trim() !== "" && Number.isFinite(ingredientCost);

  const sellingPrice = selected ? Number(selected.price) / 100 : 0;
  const profit = hasCost ? sellingPrice - ingredientCost : 0;
  const margin =
    hasCost && sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const tone = marginTone(margin);

  if (isLoading) {
    return (
      <Card className="shadow-card border-border/70" {...rest}>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border/70" {...rest}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Calculator className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <CardTitle className="font-display text-base font-bold">
            คำนวณต้นทุนและกำไร
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            เลือกเมนู ใส่ต้นทุนวัตถุดิบ แล้วดูกำไรต่อจานทันที
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cost-menu-select">เมนูอาหาร</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger
                id="cost-menu-select"
                data-ocid="cost.menu_select"
                className="w-full"
              >
                <SelectValue placeholder="เลือกเมนูอาหาร" />
              </SelectTrigger>
              <SelectContent>
                {menuItems.map((item) => (
                  <SelectItem
                    key={item.id.toString()}
                    value={item.id.toString()}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost-ingredient-input">ต้นทุนวัตถุดิบ (บาท)</Label>
            <Input
              id="cost-ingredient-input"
              data-ocid="cost.ingredient_input"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.5"
              placeholder="เช่น 45"
              value={costInput}
              onChange={(event) => setCostInput(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/70 bg-secondary/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">ราคาขาย</p>
            <p
              className="mt-1 font-display text-xl font-bold tabular-nums text-foreground"
              data-ocid="cost.selling_price"
            >
              {selected ? formatBaht(selected.price) : "—"}
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-secondary/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              กำไรต่อจาน
            </p>
            <p
              className={cn(
                "mt-1 font-display text-xl font-bold tabular-nums",
                hasCost && selected ? tone.text : "text-foreground",
              )}
              data-ocid="cost.profit_per_dish"
            >
              {hasCost && selected ? formatBahtNumber(profit) : "—"}
            </p>
          </div>

          <div className="rounded-lg border border-border/70 bg-secondary/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              อัตรากำไร
            </p>
            <p
              className={cn(
                "mt-1 font-display text-xl font-bold tabular-nums",
                hasCost && selected ? tone.text : "text-foreground",
              )}
              data-ocid="cost.margin_percent"
            >
              {hasCost && selected ? `${margin.toFixed(1)}%` : "—"}
            </p>
          </div>
        </div>

        {hasCost && selected ? (
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3",
              tone.soft,
            )}
            data-ocid="cost.result_banner"
          >
            {profit >= 0 ? (
              <TrendingUp
                className={cn("size-5 shrink-0", tone.text)}
                aria-hidden="true"
              />
            ) : (
              <TrendingDown
                className={cn("size-5 shrink-0", tone.text)}
                aria-hidden="true"
              />
            )}
            <p className={cn("text-sm font-semibold", tone.text)}>
              {selected.name} — {tone.label} · กำไร {formatBahtNumber(profit)}{" "}
              ต่อจาน ({margin.toFixed(1)}%)
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            เลือกเมนูและกรอกต้นทุนวัตถุดิบเพื่อดูผลกำไรโดยประมาณ
          </p>
        )}
      </CardContent>
    </Card>
  );
}
