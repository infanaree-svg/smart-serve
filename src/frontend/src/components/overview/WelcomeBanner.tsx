import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface WelcomeBannerProps {
  restaurantName: string;
}

/**
 * Deep-green gradient hero inviting the owner to explore Smart Serve+.
 * The CTA routes to the AI analysis page.
 */
export function WelcomeBanner({ restaurantName }: WelcomeBannerProps) {
  const navigate = useNavigate();

  return (
    <section
      className="bg-gradient-hero relative overflow-hidden rounded-2xl px-6 py-7 text-primary-foreground shadow-elevated sm:px-8 sm:py-9"
      data-ocid="overview.welcome_banner"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-24 size-48 rounded-full bg-white/5 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Smart Serve+
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            สวัสดีครับ ครัวคุณอ้วย
          </h2>
          <p className="max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            ยินดีต้อนรับกลับสู่ {restaurantName} — จัดการคิว ออเดอร์ และยอดขายของร้าน
            ได้ในที่เดียว พร้อมคำแนะนำอัจฉริยะที่ช่วยให้ร้านคุณเติบโตทุกวัน
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/ai")}
          className="w-full shrink-0 rounded-full bg-white text-primary shadow-soft hover:bg-white/90 sm:w-auto"
          data-ocid="overview.welcome_more_button"
        >
          ดูเพิ่มเติม
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
