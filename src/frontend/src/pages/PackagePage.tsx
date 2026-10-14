import { PageHeader } from "@/components/common/PageHeader";
import {
  PackageCard,
  PackageCardSkeleton,
} from "@/components/package/PackageCard";
import { Card, CardContent } from "@/components/ui/card";
import { usePackageInfo } from "@/hooks/use-backend";
import { formatBaht } from "@/lib/format";
import {
  BarChart3,
  Boxes,
  ChefHat,
  Megaphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const BENEFITS = [
  {
    icon: ChefHat,
    title: "จัดการครัวและคิวออเดอร์",
    description: "รับออเดอร์จากทุกช่องทาง จัดคิวครัวอัตโนมัติ และติดตามสถานะแบบเรียลไทม์",
  },
  {
    icon: Boxes,
    title: "ควบคุมสต็อกวัตถุดิบ",
    description: "แจ้งเตือนวัตถุดิบใกล้หมด ลดของเสีย และวางแผนสั่งซื้อได้แม่นยำขึ้น",
  },
  {
    icon: Megaphone,
    title: "โปรโมชันและลูกค้าประจำ",
    description: "สร้างแคมเปญส่วนลด จัดการโปรโมชันตามช่วงเวลา และดึงลูกค้ากลับมาซ้ำ",
  },
  {
    icon: BarChart3,
    title: "รายงานยอดขายและต้นทุน",
    description: "ดูยอดขาย กำไร และต้นทุนต่อจาน พร้อมวิเคราะห์แนวโน้มรายวันถึงรายเดือน",
  },
  {
    icon: TrendingUp,
    title: "วิเคราะห์ด้วย AI",
    description: "คำแนะนำเมนูที่ควรผลักดันและพยากรณ์ยอดขายจากข้อมูลจริงของร้านคุณ",
  },
  {
    icon: Sparkles,
    title: "อัปเดตฟีเจอร์ต่อเนื่อง",
    description: "ฟีเจอร์ใหม่และปรับปรุงระบบสม่ำเสมอ โดยไม่มีค่าใช้จ่ายเพิ่มเติม",
  },
];

export default function PackagePage() {
  const { data: info, isLoading, isError, refetch } = usePackageInfo();

  const handleViewDetails = () => {
    toast.success("แพ็กเกจ Smart Serve+ Pro", {
      description: info
        ? `ราคา ${formatBaht(info.pricePerMonth)}/เดือน • ${info.trialLabel}`
        : "กำลังโหลดรายละเอียดแพ็กเกจ",
    });
  };

  return (
    <div className="space-y-6" data-ocid="package.page">
      <PageHeader
        title="แพ็กเกจ"
        description="แพ็กเกจรายเดือนที่รวมทุกเครื่องมือสำหรับบริหารร้านอาหารของคุณ"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        {isLoading ? (
          <PackageCardSkeleton />
        ) : isError || !info ? (
          <Card
            className="border-border/70 shadow-card"
            data-ocid="package.error_state"
          >
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <p className="font-display text-base font-bold text-foreground">
                ไม่สามารถโหลดข้อมูลแพ็กเกจได้
              </p>
              <p className="text-sm text-muted-foreground">
                กรุณาลองใหม่อีกครั้งเพื่อดูรายละเอียดแพ็กเกจ
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90"
                data-ocid="package.retry_button"
              >
                ลองใหม่อีกครั้ง
              </button>
            </CardContent>
          </Card>
        ) : (
          <PackageCard info={info} onViewDetails={handleViewDetails} />
        )}

        <section
          className="space-y-4"
          aria-labelledby="package-benefits-heading"
          data-ocid="package.benefits_section"
        >
          <div className="space-y-1">
            <h2
              id="package-benefits-heading"
              className="font-display text-lg font-bold text-foreground"
            >
              สิ่งที่คุณได้รับจากแพ็กเกจ
            </h2>
            <p className="text-sm text-muted-foreground">
              จ่ายเดือนละครั้ง ได้ครบทุกเครื่องมือ ไม่มีค่าใช้จ่ายแอบแฝง
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={benefit.title}
                  className="border-border/70 shadow-card transition-smooth hover:shadow-elevated"
                  data-ocid={`package.benefit.${index + 1}`}
                >
                  <CardContent className="flex gap-3 p-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
