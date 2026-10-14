import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { TAB_ITEMS } from "@/routes";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export interface TopBarProps {
  restaurantName: string;
}

/** Store name header plus the tab row that switches the main content area. */
export function TopBar({ restaurantName }: TopBarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="เปิดเมนูหลัก"
              data-ocid="nav.open_modal_button"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">เมนูหลัก</SheetTitle>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">ร้านอาหาร</p>
          <h2 className="truncate font-display text-lg font-bold leading-tight text-foreground">
            {restaurantName}
          </h2>
        </div>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="แท็บเนื้อหา"
      >
        {TAB_ITEMS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            data-ocid={`tab.${tab.to === "/" ? "overview" : tab.to.slice(1)}`}
            className={({ isActive }) =>
              cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-smooth",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
