import type { Ingredient } from "@/backend";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { stockStatusMeta } from "@/lib/status";
import { Pencil } from "lucide-react";

export interface IngredientTableProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  onEdit: (ingredient: Ingredient) => void;
}

const SKELETON_ROWS = Array.from(
  { length: 6 },
  (_, i) => `stock-skeleton-${i}`,
);

/** Dense stock table: name, remaining quantity with unit, status, edit action. */
export function IngredientTable({
  ingredients,
  isLoading,
  onEdit,
}: IngredientTableProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
      data-ocid="stock.table"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              วัตถุดิบ
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              จำนวนคงเหลือ
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              สถานะ
            </TableHead>
            <TableHead className="h-11 w-24 px-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              จัดการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id} className="hover:bg-transparent">
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="ml-auto h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))
            : ingredients.map((ingredient, index) => {
                const meta = stockStatusMeta(ingredient.status);
                return (
                  <TableRow
                    key={ingredient.id.toString()}
                    className="transition-colors hover:bg-muted/50"
                    data-ocid={`stock.row.${index + 1}`}
                  >
                    <TableCell className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        {ingredient.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span className="font-display font-semibold tabular-nums text-foreground">
                        {ingredient.quantity.toString()}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        {ingredient.unit}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusPill
                        label={meta.label}
                        tone={meta.tone}
                        data-ocid={`stock.status.${index + 1}`}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(ingredient)}
                        className="gap-1.5 text-muted-foreground hover:text-primary"
                        data-ocid={`stock.edit_button.${index + 1}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        แก้ไข
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
