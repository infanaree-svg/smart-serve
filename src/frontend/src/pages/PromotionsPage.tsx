import { PageHeader } from "@/components/common/PageHeader";
import { AdvanceSlotsCard } from "@/components/promotions/AdvanceSlotsCard";
import { NewPromotionDialog } from "@/components/promotions/NewPromotionDialog";
import { PromotionCard } from "@/components/promotions/PromotionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePromotions } from "@/hooks/use-backend";
import { Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SKELETON_IDS = Array.from(
  { length: 3 },
  (_, i) => `promotion-skeleton-${i}`,
);

export default function PromotionsPage() {
  const { data: promotions, isLoading } = usePromotions();
  const navigate = useNavigate();

  const activeCount = (promotions ?? []).filter((p) => p.active).length;

  return (
    <div className="space-y-6" data-ocid="promotions.page">
      <PageHeader
        title="โปรโมชัน"
        description="จัดการแคมเปญและส่วนลดสำหรับกลุ่มลูกค้าเป้าหมาย"
        actions={<NewPromotionDialog />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-4" data-ocid="promotions.list_section">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-semibold text-foreground">
              โปรโมชันที่ใช้งานอยู่
            </h2>
            {!isLoading && promotions ? (
              <span className="text-sm text-muted-foreground">
                ทั้งหมด {activeCount} แคมเปญ
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <div
              className="grid gap-4 sm:grid-cols-2"
              data-ocid="promotions.loading_state"
            >
              {SKELETON_IDS.map((id) => (
                <Card key={id} className="shadow-card border-border/70">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : promotions && promotions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {promotions.map((promotion, index) => (
                <PromotionCard
                  key={promotion.id.toString()}
                  promotion={promotion}
                  index={index + 1}
                />
              ))}
            </div>
          ) : (
            <Card
              className="shadow-card border-dashed border-border"
              data-ocid="promotions.empty_state"
            >
              <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-warning-soft text-warning">
                  <Tag className="size-6" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className="font-display text-base font-semibold text-foreground">
                    ยังไม่มีโปรโมชัน
                  </p>
                  <p className="text-sm text-muted-foreground">
                    เริ่มสร้างแคมเปญแรกเพื่อกระตุ้นยอดสั่งซื้อของร้านคุณ
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <AdvanceSlotsCard onViewOrders={() => navigate("/queue")} />
        </aside>
      </div>
    </div>
  );
}
