import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePromotion } from "@/hooks/use-backend";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TARGET_GROUPS = [
  "พนักงานออฟฟิศ",
  "นักศึกษา",
  "ลูกค้าประจำ",
  "ลูกค้าใหม่",
  "ครอบครัว",
] as const;

/**
 * "สร้างโปรโมชัน" trigger + dialog form.
 * Owns its own draft state and clears it synchronously on submit.
 */
export function NewPromotionDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const createPromotion = useCreatePromotion();

  const discountValue = Number(discount);
  const isValid =
    name.trim().length > 0 &&
    targetGroup.length > 0 &&
    Number.isFinite(discountValue) &&
    discountValue > 0 &&
    discountValue <= 100;

  function resetDraft() {
    setName("");
    setDiscount("");
    setTargetGroup("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || createPromotion.isPending) return;

    const draft = {
      name: name.trim(),
      discountPercent: BigInt(Math.round(discountValue)),
      targetGroup,
    };

    resetDraft();
    setOpen(false);

    createPromotion.mutate(draft, {
      onSuccess: () => {
        toast.success("สร้างโปรโมชันเรียบร้อยแล้ว");
      },
      onError: () => {
        toast.error("สร้างโปรโมชันไม่สำเร็จ กรุณาลองอีกครั้ง");
      },
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetDraft();
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          className="rounded-full"
          data-ocid="promotions.open_modal_button"
        >
          <Plus className="size-4" aria-hidden="true" />
          สร้างโปรโมชัน
        </Button>
      </DialogTrigger>
      <DialogContent data-ocid="promotions.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">สร้างโปรโมชันใหม่</DialogTitle>
          <DialogDescription>
            กำหนดรายละเอียดแคมเปญเพื่อดึงดูดกลุ่มลูกค้าเป้าหมาย
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promotion-name">ชื่อโปรโมชัน</Label>
            <Input
              id="promotion-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="เช่น ซื้อข้าว + เครื่องดื่ม ลด 15%"
              autoComplete="off"
              data-ocid="promotions.name_input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotion-discount">ส่วนลด (%)</Label>
            <Input
              id="promotion-discount"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
              placeholder="15"
              data-ocid="promotions.discount_input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotion-target">กลุ่มเป้าหมาย</Label>
            <Select value={targetGroup} onValueChange={setTargetGroup}>
              <SelectTrigger
                id="promotion-target"
                className="w-full"
                data-ocid="promotions.target_select"
              >
                <SelectValue placeholder="เลือกกลุ่มเป้าหมาย" />
              </SelectTrigger>
              <SelectContent>
                {TARGET_GROUPS.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setOpen(false)}
              data-ocid="promotions.cancel_button"
            >
              ยกเลิก
            </Button>

            <Button
              type="submit"
              className="rounded-full"
              disabled={!isValid || createPromotion.isPending}
              data-ocid="promotions.submit_button"
            >
              {createPromotion.isPending ? "กำลังบันทึก..." : "บันทึกโปรโมชัน"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
