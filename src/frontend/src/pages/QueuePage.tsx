import { OrderStatus } from "@/backend";
import type { OrderFilter } from "@/backend";
import { PageHeader } from "@/components/common/PageHeader";
import { NewOrderDialog } from "@/components/queue/NewOrderDialog";
import { OrderTable } from "@/components/queue/OrderTable";
import { RiderTrackingCard } from "@/components/queue/RiderTrackingCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdvanceOrderStatus,
  useCreateOrder,
  useDeliverySummary,
  useOrders,
  useRiders,
} from "@/hooks/use-backend";
import { ORDER_STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import {
  Bike,
  ClipboardList,
  Globe,
  Plus,
  Search,
  Store,
  Utensils,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ALL_STATUSES = "all";

interface SummaryTile {
  key: string;
  label: string;
  value: string;
  icon: typeof Store;
  tone: string;
}

export default function QueuePage() {
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filter = useMemo<OrderFilter>(() => {
    const next: OrderFilter = {};
    if (statusFilter !== ALL_STATUSES) {
      next.status = statusFilter as OrderStatus;
    }
    const trimmed = search.trim();
    if (trimmed) next.search = trimmed;
    return next;
  }, [statusFilter, search]);

  const { data: orders, isLoading: ordersLoading } = useOrders(filter);
  const { data: summary, isLoading: summaryLoading } = useDeliverySummary();
  const { data: riders, isLoading: ridersLoading } = useRiders();

  const createOrder = useCreateOrder();
  const advanceOrder = useAdvanceOrderStatus();

  const orderList = orders ?? [];
  const riderList = riders ?? [];
  const primaryRider =
    riderList.find((rider) => rider.status === "delivering") ??
    riderList[0] ??
    null;

  const summaryTiles: SummaryTile[] = [
    {
      key: "dineIn",
      label: "คิวหน้าร้าน",
      value: summary ? summary.dineInQueue.toString() : "—",
      icon: Store,
      tone: "bg-primary-soft text-primary",
    },
    {
      key: "online",
      label: "ออเดอร์ออนไลน์",
      value: summary ? summary.onlineOrders.toString() : "—",
      icon: Globe,
      tone: "bg-info-soft text-info",
    },
    {
      key: "total",
      label: "รวมคิว/ออเดอร์",
      value: summary
        ? (summary.dineInQueue + summary.onlineOrders).toString()
        : "—",
      icon: ClipboardList,
      tone: "bg-warning-soft text-warning",
    },
  ];

  function handleCreateOrder(input: Parameters<typeof createOrder.mutate>[0]) {
    createOrder.mutate(input, {
      onSuccess: () => {
        toast.success("เพิ่มออเดอร์เข้าคิวแล้ว");
        setDialogOpen(false);
      },
      onError: () => {
        toast.error("เพิ่มออเดอร์ไม่สำเร็จ กรุณาลองใหม่");
      },
    });
  }

  function handleAdvance(id: bigint) {
    advanceOrder.mutate(id, {
      onSuccess: (order) => {
        if (order) {
          toast.success(`อัปเดตออเดอร์ ${order.orderNumber} แล้ว`);
        }
      },
      onError: () => {
        toast.error("เลื่อนสถานะออเดอร์ไม่สำเร็จ");
      },
    });
  }

  return (
    <div className="space-y-6" data-ocid="queue.page">
      <PageHeader
        title="คิวและออเดอร์"
        description="ติดตามออเดอร์ในครัวและสถานะการจัดส่งแบบเรียลไทม์"
        actions={
          <Button
            type="button"
            onClick={() => setDialogOpen(true)}
            data-ocid="queue.add_order_button"
          >
            <Plus className="size-4" aria-hidden="true" />
            เพิ่มออเดอร์
          </Button>
        }
      />

      {/* Summary strip */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        data-ocid="queue.summary.section"
      >
        {summaryTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card
              key={tile.key}
              className="shadow-card border-border/70"
              data-ocid={`queue.summary.card.${tile.key}`}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    tile.tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    {tile.label}
                  </p>
                  {summaryLoading ? (
                    <Skeleton className="mt-1 h-7 w-12" />
                  ) : (
                    <p className="font-display text-2xl font-bold tabular-nums text-foreground">
                      {tile.value}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders + rider tracking */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card
          className="shadow-card border-border/70"
          data-ocid="queue.orders.card"
        >
          <CardContent className="space-y-4 p-0">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Utensils className="size-4" aria-hidden="true" />
                </span>
                <h2 className="font-display text-base font-semibold text-foreground">
                  ออเดอร์สด
                </h2>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ค้นหาหมายเลขหรือเมนู"
                    aria-label="ค้นหาออเดอร์"
                    className="w-full pl-9 sm:w-56"
                    data-ocid="queue.search_input"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    className="w-full sm:w-44"
                    aria-label="กรองตามสถานะ"
                    data-ocid="queue.status_filter"
                  >
                    <SelectValue placeholder="ทุกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_STATUSES}>ทุกสถานะ</SelectItem>
                    <SelectItem value={OrderStatus.preparing}>
                      {ORDER_STATUS_META[OrderStatus.preparing].label}
                    </SelectItem>
                    <SelectItem value={OrderStatus.awaitingPickup}>
                      {ORDER_STATUS_META[OrderStatus.awaitingPickup].label}
                    </SelectItem>
                    <SelectItem value={OrderStatus.completed}>
                      {ORDER_STATUS_META[OrderStatus.completed].label}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {ordersLoading ? (
              <div
                className="space-y-3 p-4 pt-0"
                data-ocid="queue.orders.loading_state"
              >
                {Array.from({ length: 4 }, (_, i) => `order-skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-14 w-full rounded-lg" />
                  ),
                )}
              </div>
            ) : orderList.length > 0 ? (
              <OrderTable
                orders={orderList}
                onAdvance={handleAdvance}
                advancingId={advanceOrder.variables ?? null}
                isAdvancing={advanceOrder.isPending}
              />
            ) : (
              <div
                className="flex flex-col items-center gap-3 px-4 py-14 text-center"
                data-ocid="queue.orders.empty_state"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <ClipboardList className="size-6" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className="font-display text-sm font-semibold text-foreground">
                    ไม่พบออเดอร์ที่ตรงกับเงื่อนไข
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ลองปรับตัวกรองหรือเพิ่มออเดอร์ใหม่เข้าคิวครัว
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  data-ocid="queue.orders.empty_add_button"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  เพิ่มออเดอร์
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <RiderTrackingCard
          rider={primaryRider}
          isLoading={ridersLoading}
          riders={riderList}
          ridersLoading={ridersLoading}
        />
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Bike className="size-3.5" aria-hidden="true" />
        ข้อมูลออเดอร์และไรเดอร์อัปเดตอัตโนมัติจากระบบหลังบ้าน
      </p>

      <NewOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateOrder}
        isPending={createOrder.isPending}
        isError={createOrder.isError}
      />
    </div>
  );
}
