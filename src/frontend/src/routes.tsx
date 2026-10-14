import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  Calculator,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Sparkles,
  Tag,
  UtensilsCrossed,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface TabItem {
  to: string;
  label: string;
}

/** Primary sidebar navigation. */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "หน้าหลัก", icon: LayoutDashboard },
  { to: "/menu", label: "เมนูอาหาร", icon: UtensilsCrossed },
  { to: "/stock", label: "สต็อกวัตถุดิบ", icon: Boxes },
  { to: "/reports", label: "รายงาน", icon: BarChart3 },
  { to: "/settings", label: "ตั้งค่า", icon: Settings },
];

/** Top-bar tab row that switches the main content area. */
export const TAB_ITEMS: TabItem[] = [
  { to: "/", label: "ภาพรวม" },
  { to: "/queue", label: "คิวและออเดอร์" },
  { to: "/ai", label: "AI วิเคราะห์ยอดขาย" },
  { to: "/cost", label: "คำนวณต้นทุน" },
  { to: "/promotions", label: "โปรโมชัน" },
  { to: "/package", label: "แพ็กเกจ" },
];

/** Icons referenced by the tab row for compact mobile display. */
export const TAB_ICONS: Record<string, LucideIcon> = {
  "/": LayoutDashboard,
  "/queue": Receipt,
  "/ai": Sparkles,
  "/cost": Calculator,
  "/promotions": Tag,
  "/package": Package,
};
