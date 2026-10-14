import { describe, expect, it, vi } from "vitest";

import {
  actorModule,
  createFakeActor,
  currentActor,
  renderWithProviders,
} from "@/test/harness";

vi.mock("@caffeineai/core-infrastructure", () => actorModule());

// Import after the mock is registered.
const { default: OverviewPage } = await import("@/pages/OverviewPage");

describe("OverviewPage", () => {
  it("renders the four KPI cards with the accepted values and deltas", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderWithProviders(<OverviewPage />);

    // Wait for the KPI section to leave its skeleton state.
    const salesCard = await findByTestId("overview.kpi_card.1");
    expect(salesCard).toHaveTextContent("ยอดขายวันนี้");
    expect(salesCard).toHaveTextContent("฿4,820");
    expect(salesCard).toHaveTextContent("+12%");

    const profitCard = getByTestId("overview.kpi_card.2");
    expect(profitCard).toHaveTextContent("กำไรโดยประมาณ");
    expect(profitCard).toHaveTextContent("฿1,450");
    expect(profitCard).toHaveTextContent("+15%");

    const ordersCard = getByTestId("overview.kpi_card.3");
    expect(ordersCard).toHaveTextContent("ออเดอร์");
    expect(ordersCard).toHaveTextContent("38");
    expect(ordersCard).toHaveTextContent("+9%");

    const waitCard = getByTestId("overview.kpi_card.4");
    expect(waitCard).toHaveTextContent("เวลารอเฉลี่ย");
    expect(waitCard).toHaveTextContent("12 นาที");
    expect(waitCard).toHaveTextContent("-6 นาที");
  });

  it("shows the restaurant name from settings in the welcome banner", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId } = renderWithProviders(<OverviewPage />);
    const banner = await findByTestId("overview.welcome_banner");
    expect(banner).toHaveTextContent("ครัวคุณอ้วย");
  });

  it("renders the queue and delivery summary counts", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId } = renderWithProviders(<OverviewPage />);
    // Wait for the delivery summary query to resolve into its row list.
    await findByTestId("overview.queue_item.1");
    const card = await findByTestId("overview.queue_delivery_card");
    expect(card).toHaveTextContent("คิวและการจัดส่ง");
    expect(card).toHaveTextContent("5 คิว");
    expect(card).toHaveTextContent("7 ออเดอร์");
    expect(card).toHaveTextContent("3 รายการ");
  });
});
