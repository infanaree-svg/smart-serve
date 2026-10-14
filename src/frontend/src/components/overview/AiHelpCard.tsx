import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Soft-lavender helper panel that invites the owner into the AI analysis page.
 */
export function AiHelpCard() {
  const navigate = useNavigate();

  return (
    <Card
      className="border-violet/20 bg-violet-soft shadow-card"
      data-ocid="overview.ai_help_card"
    >
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet text-violet-foreground">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1">
            <h3 className="font-display text-base font-bold text-foreground">
              ผู้ช่วย AI แนะนำวันนี้
            </h3>
            <p className="text-sm text-muted-foreground">
              ให้ AI วิเคราะห์ยอดขายและพฤติกรรมลูกค้า แล้วเสนอเมนูที่ควรโปรโมท
              พร้อมวิธีเพิ่มกำไรให้ร้านคุณ
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => navigate("/ai")}
          className="w-full rounded-full bg-violet text-violet-foreground hover:bg-violet/90 sm:w-auto sm:self-start"
          data-ocid="overview.ai_help_button"
        >
          เปิดผู้ช่วย AI
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}
