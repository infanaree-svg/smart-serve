import type { MenuItem } from "@/backend";
import { LOW_MARGIN_THRESHOLD } from "@/components/cost/CostCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBaht, formatBahtNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AlertTriangle, UtensilsCrossed } from "lucide-react";

export interface MenuMarginTableProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  /** Ingredient cost per menu id, in baht. Missing entries fall back to a default. */
  costByMenuId: Record<string, number>;
  "data-ocid"?: string;
}

interface MarginRow {
  id: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  profit: number;
  margin: number;
}

function buildRows(
  menuItems: MenuItem[],
  costByMenuId: Record<string, number>,
): MarginRow[] {
  return menuItems
    .map((item) => {
      const id = item.id.toString();
      const price = Number(item.price) / 100;
      const cost = costByMenuId[id] ?? price * 0.6;
      const profit = price - cost;
      const margin = price > 0 ? (profit / price) * 100 : 0;
      return {
        id,
        name: item.name,
        category: item.category,
        cost,
        price,
        profit,
        margin,
      };
    })
    .sort((a, b) => a.margin - b.margin);
}

function marginClasses(margin: number): string {
  if (margin < 0) return "text-destructive";
  if (margin < LOW_MARGIN_THRESHOLD) return "text-warning";
  return "text-success";
}

/**
 * Menu margin table: every menu item with cost, selling price, profit and
 * margin. Low-margin rows are highlighted in orange/red.
 */
export function MenuMarginTable({
  menuItems,
  isLoading,
  costByMenuId,
  ...rest
}: MenuMarginTableProps) {
  const rows = buildRows(menuItems, costByMenuId);
  const lowMarginCount = rows.filter(
    (row) => row.margin < LOW_MARGIN_THRESHOLD,
  ).length;

  return (
    <Card className="shadow-card border-border/70" {...rest}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <UtensilsCrossed className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <CardTitle className="font-display text-base font-bold">
              กำไรต่อเมนู
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              เรียงจากอัตรากำไรต่ำสุดไปสูงสุด
            </p>
          </div>
        </div>
        {!isLoading && lowMarginCount > 0 ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning"
            data-ocid="cost.low_margin_badge"
          >
            <AlertTriangle className="size-3.5" aria-hidden="true" />
            กำไรต่ำ {lowMarginCount} เมนู
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {isLoading ? (
          <div className="space-y-3 px-6 pb-6">
            {Array.from({ length: 5 }, (_, i) => `cost-row-${i}`).map((id) => (
              <Skeleton key={id} className="h-10 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 px-6 pb-10 pt-4 text-center"
            data-ocid="cost.menu_table.empty_state"
          >
            <UtensilsCrossed
              className="size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-foreground">
              ยังไม่มีเมนูในระบบ
            </p>
            <p className="text-xs text-muted-foreground">
              เพิ่มเมนูอาหารก่อนเพื่อวิเคราะห์ต้นทุนและกำไร
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table data-ocid="cost.menu_table">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">เมนูอาหาร</TableHead>
                  <TableHead className="text-right">ต้นทุนวัตถุดิบ</TableHead>
                  <TableHead className="text-right">ราคาขาย</TableHead>
                  <TableHead className="text-right">กำไรต่อจาน</TableHead>
                  <TableHead className="pr-6 text-right">อัตรากำไร</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => {
                  const isLow = row.margin < LOW_MARGIN_THRESHOLD;
                  return (
                    <TableRow
                      key={row.id}
                      data-ocid={`cost.menu_table.row.${index + 1}`}
                      className={cn(
                        isLow &&
                          (row.margin < 0
                            ? "bg-destructive-soft/50"
                            : "bg-warning-soft/50"),
                      )}
                    >
                      <TableCell className="pl-6">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-foreground">
                            {row.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {row.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatBahtNumber(row.cost)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatBahtNumber(row.price)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold tabular-nums",
                          marginClasses(row.margin),
                        )}
                      >
                        {formatBahtNumber(row.profit)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                            row.margin < 0
                              ? "bg-destructive-soft text-destructive"
                              : isLow
                                ? "bg-warning-soft text-warning"
                                : "bg-success-soft text-success",
                          )}
                        >
                          {row.margin.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
