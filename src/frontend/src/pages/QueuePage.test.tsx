import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OrderChannel, OrderStatus } from "@/backend";
import {
  actorModule,
  createFakeActor,
  currentActor,
  renderWithProviders,
} from "@/test/harness";

vi.mock("@caffeineai/core-infrastructure", () => actorModule());

const { default: QueuePage } = await import("@/pages/QueuePage");

describe("QueuePage", () => {
  it("lists the seeded orders with their menu, time and status pill", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderWithProviders(<QueuePage />);

    const table = await findByTestId("queue.orders.table");
    expect(table).toHaveTextContent("#018");
    expect(table).toHaveTextContent("#021");
    expect(table).toHaveTextContent("#022");
    expect(table).toHaveTextContent("ข้าวกะเพรา");
    expect(table).toHaveTextContent("ราดหน้าหมูสับใหญ่");
    expect(table).toHaveTextContent("ผัดกะเพราไข่ดาว");

    // Status pills: #018 and #021 are preparing, #022 is awaiting pickup.
    expect(getByTestId("queue.orders.status.1")).toHaveTextContent("กำลังทำ");
    expect(getByTestId("queue.orders.status.2")).toHaveTextContent("กำลังทำ");
    expect(getByTestId("queue.orders.status.3")).toHaveTextContent(
      "รอรับออเดอร์",
    );
  });

  it("shows the rider tracking card with the accepted rider details", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId } = renderWithProviders(<QueuePage />);
    // Wait for the riders query to resolve into the delivering list.
    await findByTestId("queue.rider.item.1");
    const card = await findByTestId("queue.rider.card");
    expect(card).toHaveTextContent("คุณสมชาย ใจดี");
    expect(card).toHaveTextContent("4.9");
    expect(card).toHaveTextContent("2.8");
    expect(card).toHaveTextContent("8");
  });

  it("adds a new order through the dialog and calls the actor", async () => {
    const user = userEvent.setup();
    const createOrder = vi.fn(createFakeActor().createOrder);
    currentActor.value = createFakeActor({ createOrder });

    const { findByTestId, getByTestId } = renderWithProviders(<QueuePage />);
    await findByTestId("queue.orders.table");

    await user.click(getByTestId("queue.add_order_button"));
    await findByTestId("queue.new_order.dialog");

    await user.type(getByTestId("queue.new_order.menu_input"), "ข้าวผัดปู");
    await user.click(getByTestId("queue.new_order.submit_button"));

    await vi.waitFor(() => {
      expect(createOrder).toHaveBeenCalledTimes(1);
    });
    expect(createOrder.mock.calls[0][0]).toMatchObject({
      menuName: "ข้าวผัดปู",
    });
  });

  it("advances an order from preparing to completed", async () => {
    const user = userEvent.setup();
    const advanceOrderStatus = vi.fn(async () => ({
      id: 18n,
      orderNumber: "#018",
      menuName: "ข้าวกะเพรา",
      orderedAt: 44_400_000_000_000n,
      expectedAt: 44_700_000_000_000n,
      status: OrderStatus.completed,
      channel: OrderChannel.dineIn,
    }));
    currentActor.value = createFakeActor({ advanceOrderStatus });

    const { findByTestId, getByTestId } = renderWithProviders(<QueuePage />);
    await findByTestId("queue.orders.table");

    await user.click(getByTestId("queue.orders.advance_button.1"));
    await vi.waitFor(() => {
      expect(advanceOrderStatus).toHaveBeenCalledWith(18n);
    });
  });
});
