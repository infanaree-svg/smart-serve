import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useSettings } from "@/hooks/use-backend";
import { Outlet } from "react-router-dom";

const DEFAULT_RESTAURANT_NAME = "ครัวคุณอ้วย";

/**
 * Persistent dashboard shell: fixed left sidebar on desktop, drawer on mobile,
 * top bar with store name + tab row, and the routed content area.
 */
export function AppLayout() {
  const { data: settings } = useSettings();
  const restaurantName = settings?.restaurantName || DEFAULT_RESTAURANT_NAME;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar restaurantName={restaurantName} />
        <main
          className="flex-1 px-4 py-5 sm:px-6 sm:py-6"
          data-ocid="page.content"
        >
          <Outlet />
        </main>
        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
