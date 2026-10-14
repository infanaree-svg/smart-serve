import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  PROMOTION,
  actorModule,
  createFakeActor,
  currentActor,
  renderWithProviders,
} from "@/test/harness";

vi.mock("@caffeineai/core-infrastructure", () => actorModule());

const { default: PromotionsPage } = await import("@/pages/PromotionsPage");

describe("PromotionsPage", () => {
  it("lists the active promotions with discount and status", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderWithProviders(
      <PromotionsPage />,
    );

    const item = await findByTestId("promotions.item.1");
    expect(item).toHaveTextContent("ซื้อข้าว + เครื่องดื่ม ลด 15%");
    expect(item).toHaveTextContent("พนักงานออฟฟิศ");
    expect(item).toHaveTextContent("15%");
    expect(getByTestId("promotions.status.1")).toHaveTextContent("ใช้งานอยู่");
  });

  it("creates a promotion through the dialog and shows it in the active list", async () => {
    const user = userEvent.setup();
    const created = {
      ...PROMOTION,
      id: 2n,
      name: "โปรนักศึกษา ลด 20%",
      discountPercent: 20n,
      targetGroup: "นักศึกษา",
    };
    // Stateful fake: the list reflects the created promotion after the mutation.
    let promotions = [PROMOTION];
    const createPromotion = vi.fn(
      async (_input: {
        targetGroup: string;
        name: string;
        discountPercent: bigint;
      }) => {
        promotions = [...promotions, created];
        return created;
      },
    );
    currentActor.value = createFakeActor({
      listPromotions: async () => promotions,
      createPromotion,
    });

    const { findByTestId, findByRole, getByTestId } = renderWithProviders(
      <PromotionsPage />,
    );
    await findByTestId("promotions.item.1");

    await user.click(getByTestId("promotions.open_modal_button"));
    await findByTestId("promotions.dialog");

    await user.type(getByTestId("promotions.name_input"), "โปรนักศึกษา ลด 20%");
    await user.type(getByTestId("promotions.discount_input"), "20");

    // Radix Select: open the trigger, then pick the option by its label.
    await user.click(getByTestId("promotions.target_select"));
    await user.click(await findByRole("option", { name: "นักศึกษา" }));

    await user.click(getByTestId("promotions.submit_button"));

    await vi.waitFor(() => {
      expect(createPromotion).toHaveBeenCalledTimes(1);
    });
    expect(createPromotion.mock.calls[0][0]).toMatchObject({
      name: "โปรนักศึกษา ลด 20%",
      discountPercent: 20n,
      targetGroup: "นักศึกษา",
    });

    // The new promotion appears in the active list.
    const newItem = await findByTestId("promotions.item.2");
    expect(newItem).toHaveTextContent("โปรนักศึกษา ลด 20%");
  });
});
