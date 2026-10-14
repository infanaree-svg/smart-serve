import type { MenuItem } from "@/backend";
import { PageHeader } from "@/components/common/PageHeader";
import { MenuItemDialog } from "@/components/menu/MenuItemDialog";
import { MenuTable } from "@/components/menu/MenuTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteMenuItem, useMenuItems } from "@/hooks/use-backend";
import { formatBaht } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Search, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ALL_CATEGORIES = "ทั้งหมด";

/** Menu management screen: filterable list with create, edit and delete flows. */
export default function MenuPage() {
  const { data: items, isLoading, isError, refetch } = useMenuItems();
  const deleteMenuItem = useDeleteMenuItem();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MenuItem | null>(null);

  const menuItems = items ?? [];

  const categories = useMemo(() => {
    const unique = new Set(menuItems.map((item) => item.category));
    return [ALL_CATEGORIES, ...Array.from(unique).sort()];
  }, [menuItems]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory =
        category === ALL_CATEGORIES || item.category === category;
      const matchesSearch =
        term === "" || item.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, search, category]);

  const openCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    deleteMenuItem.mutate(target.id, {
      onSuccess: () => toast.success(`ลบเมนู "${target.name}" แล้ว`),
      onError: () => toast.error("ลบเมนูไม่สำเร็จ กรุณาลองอีกครั้ง"),
    });
    setPendingDelete(null);
  };

  const hasItems = menuItems.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <div className="space-y-6" data-ocid="menu.page">
      <PageHeader
        title="เมนูอาหาร"
        description="จัดการรายการเมนู ราคา และหมวดหมู่ของร้าน"
        actions={
          <Button
            type="button"
            onClick={openCreate}
            data-ocid="menu.open_modal_button"
          >
            <Plus className="size-4" aria-hidden="true" />
            เพิ่มเมนู
          </Button>
        }
      />

      <Card className="shadow-card border-border/70">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหาชื่อเมนู"
                className="pl-9"
                aria-label="ค้นหาชื่อเมนู"
                data-ocid="menu.search_input"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              ทั้งหมด{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {filtered.length}
              </span>{" "}
              รายการ
            </p>
          </div>

          {categories.length > 1 ? (
            <fieldset className="flex flex-wrap gap-2 border-0 p-0">
              <legend className="sr-only">กรองตามหมวดหมู่</legend>
              {categories.map((option) => {
                const isActive = option === category;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    aria-pressed={isActive}
                    data-ocid={`menu.filter.tab.${option}`}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </fieldset>
          ) : null}

          {isLoading ? (
            <div className="space-y-2" data-ocid="menu.loading_state">
              {Array.from({ length: 5 }, (_, i) => `menu-skeleton-${i}`).map(
                (id) => (
                  <Skeleton key={id} className="h-12 w-full rounded-lg" />
                ),
              )}
            </div>
          ) : isError ? (
            <div
              className="flex flex-col items-center gap-3 py-12 text-center"
              data-ocid="menu.error_state"
            >
              <p className="text-sm text-muted-foreground">
                โหลดรายการเมนูไม่สำเร็จ
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
                data-ocid="menu.retry_button"
              >
                ลองอีกครั้ง
              </Button>
            </div>
          ) : !hasItems ? (
            <div
              className="flex flex-col items-center gap-3 py-14 text-center"
              data-ocid="menu.empty_state"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <UtensilsCrossed className="size-6" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="font-display font-semibold text-foreground">
                  ยังไม่มีเมนูในร้าน
                </p>
                <p className="text-sm text-muted-foreground">
                  เริ่มต้นด้วยการเพิ่มเมนูแรกของร้านคุณ
                </p>
              </div>
              <Button
                type="button"
                onClick={openCreate}
                data-ocid="menu.empty_add_button"
              >
                <Plus className="size-4" aria-hidden="true" />
                เพิ่มเมนู
              </Button>
            </div>
          ) : !hasResults ? (
            <div
              className="flex flex-col items-center gap-2 py-14 text-center"
              data-ocid="menu.no_results_state"
            >
              <p className="font-display font-semibold text-foreground">
                ไม่พบเมนูที่ตรงกับเงื่อนไข
              </p>
              <p className="text-sm text-muted-foreground">
                ลองปรับคำค้นหาหรือเลือกหมวดหมู่อื่น
              </p>
            </div>
          ) : (
            <MenuTable
              items={filtered}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
          )}
        </CardContent>
      </Card>

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="menu.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              ลบเมนูนี้?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.name}" (${formatBaht(pendingDelete.price)}) จะถูกลบออกจากรายการเมนูอย่างถาวร`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="menu.delete_cancel_button">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="menu.delete_confirm_button"
            >
              {deleteMenuItem.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              ลบเมนู
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
