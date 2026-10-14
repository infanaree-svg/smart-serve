import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { actorModule, createFakeActor, currentActor } from "@/test/harness";

vi.mock("@caffeineai/core-infrastructure", () => actorModule());

const { AppLayout } = await import("@/components/layout/AppLayout");
const { default: OverviewPage } = await import("@/pages/OverviewPage");
const { default: MenuPage } = await import("@/pages/MenuPage");
const { default: StockPage } = await import("@/pages/StockPage");
const { default: ReportsPage } = await import("@/pages/ReportsPage");
const { default: SettingsPage } = await import("@/pages/SettingsPage");
const { default: QueuePage } = await import("@/pages/QueuePage");
const { default: AiPage } = await import("@/pages/AiPage");
const { default: CostPage } = await import("@/pages/CostPage");
const { default: PromotionsPage } = await import("@/pages/PromotionsPage");
const { default: PackagePage } = await import("@/pages/PackagePage");

/** Test-only probe that exposes the current pathname for URL assertions. */
function LocationProbe() {
  const location = useLocation();
  return <span data-ocid="test.location">{location.pathname}</span>;
}

function renderApp(route = "/") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <LocationProbe />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="ai" element={<AiPage />} />
            <Route path="cost" element={<CostPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="package" element={<PackagePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AppLayout navigation", () => {
  it("renders the dashboard shell with sidebar and top tabs", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderApp("/");

    expect(await findByTestId("nav.home.link")).toBeInTheDocument();
    expect(getByTestId("nav.menu.link")).toBeInTheDocument();
    expect(getByTestId("nav.stock.link")).toBeInTheDocument();
    expect(getByTestId("nav.reports.link")).toBeInTheDocument();
    expect(getByTestId("nav.settings.link")).toBeInTheDocument();

    expect(getByTestId("tab.overview")).toBeInTheDocument();
    expect(getByTestId("tab.queue")).toBeInTheDocument();
    expect(getByTestId("tab.ai")).toBeInTheDocument();
    expect(getByTestId("tab.cost")).toBeInTheDocument();
    expect(getByTestId("tab.promotions")).toBeInTheDocument();
    expect(getByTestId("tab.package")).toBeInTheDocument();
  });

  it("switches screens and updates the URL from the sidebar", async () => {
    const user = userEvent.setup();
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderApp("/");

    await findByTestId("nav.menu.link");
    await user.click(getByTestId("nav.menu.link"));
    expect(getByTestId("test.location")).toHaveTextContent("/menu");
    expect(await findByTestId("menu.page")).toBeInTheDocument();

    await user.click(getByTestId("nav.stock.link"));
    expect(getByTestId("test.location")).toHaveTextContent("/stock");
    expect(await findByTestId("stock.page")).toBeInTheDocument();

    await user.click(getByTestId("nav.reports.link"));
    expect(getByTestId("test.location")).toHaveTextContent("/reports");
    expect(await findByTestId("reports.page")).toBeInTheDocument();

    await user.click(getByTestId("nav.settings.link"));
    expect(getByTestId("test.location")).toHaveTextContent("/settings");
    expect(await findByTestId("settings.page")).toBeInTheDocument();
  });

  it("switches screens and updates the URL from the top tabs", async () => {
    const user = userEvent.setup();
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderApp("/");

    await findByTestId("tab.queue");
    await user.click(getByTestId("tab.queue"));
    expect(getByTestId("test.location")).toHaveTextContent("/queue");
    expect(await findByTestId("queue.orders.table")).toBeInTheDocument();

    await user.click(getByTestId("tab.ai"));
    expect(getByTestId("test.location")).toHaveTextContent("/ai");
    expect(await findByTestId("ai.recommendation.item.1")).toBeInTheDocument();

    await user.click(getByTestId("tab.promotions"));
    expect(getByTestId("test.location")).toHaveTextContent("/promotions");
    expect(await findByTestId("promotions.item.1")).toBeInTheDocument();

    await user.click(getByTestId("tab.package"));
    expect(getByTestId("test.location")).toHaveTextContent("/package");
    expect(await findByTestId("package.price")).toBeInTheDocument();
  });

  it("opens the mobile navigation drawer", async () => {
    const user = userEvent.setup();
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId, getAllByTestId } = renderApp("/");

    await findByTestId("nav.home.link");
    await user.click(getByTestId("nav.open_modal_button"));

    // The drawer renders a second copy of the sidebar navigation.
    await vi.waitFor(() => {
      expect(getAllByTestId("nav.menu.link").length).toBeGreaterThan(1);
    });
  });
});
