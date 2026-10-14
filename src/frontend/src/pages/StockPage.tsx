import { StockStatus } from "@/backend";
import type { Ingredient } from "@/backend";
import { PageHeader } from "@/components/common/PageHeader";
import { IngredientDialog } from "@/components/stock/IngredientDialog";
import { IngredientTable } from "@/components/stock/IngredientTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIngredients } from "@/hooks/use-backend";
import { STOCK_STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, Package } from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = "all" | StockStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  {
    value: StockStatus.fresh,
    label: STOCK_STATUS_META[StockStatus.fresh].label,
  },
  { value: StockStatus.low, label: STOCK_STATUS_META[StockStatus.low].label },
  {
    value: StockStatus.expiringSoon,
    label: STOCK_STATUS_META[StockStatus.expiringSoon].label,
  },
];

const SUMMARY_TILES = [
  {
    status: StockStatus.fresh,
    icon: CheckCircle2,
    tileClass: "bg-success-soft text-success",
  },
  {
    status: StockStatus.low,
    icon: AlertTriangle,
    tileClass: "bg-warning-soft text-warning",
  },
  {
    status: StockStatus.expiringSoon,
    icon: Clock,
    tileClass: "bg-destructive-soft text-destructive",
  },
] as const;

export default function StockPage() {
  const { data: ingredients, isLoading } = useIngredients();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const list = useMemo(() => ingredients ?? [], [ingredients]);

  const counts = useMemo(() => {
    const base: Record<StockStatus, number> = {
      [StockStatus.fresh]: 0,
      [StockStatus.low]: 0,
      [StockStatus.expiringSoon]: 0,
    };
    for (const item of list) {
      base[item.status] += 1;
    }
    return base;
  }, [list]);

  const visible = useMemo(
    () => (filter === "all" ? list : list.filter((i) => i.status === filter)),
    [list, filter],
  );

  const handleEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6" data-ocid="stock.page">
      <PageHeader
        title="สต็อกวัตถุดิบ"
        description="ติดตามจำนวนคงเหลือและสถานะความสดของวัตถุดิบในครัว"
      />

      {/* Summary strip */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-ocid="stock.summary"
      >
        <Card className="border-border/70 shadow-card">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Package className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                วัตถุดิบทั้งหมด
              </p>
              <p className="font-display text-2xl font-bold tabular-nums text-foreground">
                {isLoading ? "—" : list.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {SUMMARY_TILES.map(({ status, icon: Icon, tileClass }) => (
          <Card
            key={status}
            className="border-border/70 shadow-card"
            data-ocid={`stock.summary.${status}`}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg",
                  tileClass,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {STOCK_STATUS_META[status].label}
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-foreground">
                  {isLoading ? "—" : counts[status]}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter row */}
      <fieldset
        className="flex flex-wrap items-center gap-2 border-0 p-0"
        data-ocid="stock.filter"
      >
        <legend className="sr-only">กรองตามสถานะ</legend>
        {FILTERS.map((option) => {
          const active = filter === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className="rounded-full"
              data-ocid={`stock.filter.${option.value}`}
            >
              {option.label}
            </Button>
          );
        })}
      </fieldset>

      {!isLoading && visible.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
          data-ocid="stock.empty_state"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package className="size-6" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="font-display font-semibold text-foreground">
              ไม่พบวัตถุดิบในสถานะนี้
            </p>
            <p className="text-sm text-muted-foreground">
              ลองเลือกสถานะอื่น หรือดูรายการทั้งหมด
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFilter("all")}
            data-ocid="stock.show_all_button"
          >
            ดูทั้งหมด
          </Button>
        </div>
      ) : (
        <IngredientTable
          ingredients={visible}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      )}

      <IngredientDialog
        ingredient={editing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
