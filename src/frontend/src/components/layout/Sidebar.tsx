import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/routes";
import { UtensilsCrossed } from "lucide-react";
import { NavLink } from "react-router-dom";

export interface SidebarProps {
  /** Called after a nav item is chosen (used to close the mobile drawer). */
  onNavigate?: () => void;
}

/** Smart Serve+ brand mark + primary navigation list. */
export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 bg-card px-4 py-5">
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
          <UtensilsCrossed className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-bold leading-tight text-foreground">
            Smart Serve+
          </p>
          <p className="truncate text-xs text-muted-foreground">
            ระบบจัดการร้านอาหาร
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="เมนูหลัก">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            data-ocid={`nav.${item.to === "/" ? "home" : item.to.slice(1)}.link`}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl bg-gradient-subtle p-3">
        <p className="text-xs font-semibold text-foreground">ครัวคุณอ้วย</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          แพ็กเกจ Pro · ใช้งานได้ถึง 30 ก.ย.
        </p>
      </div>
    </div>
  );
}
