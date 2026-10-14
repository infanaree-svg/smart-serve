import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  RECOMMENDATION,
  actorModule,
  createFakeActor,
  currentActor,
  renderWithProviders,
} from "@/test/harness";

vi.mock("@caffeineai/core-infrastructure", () => actorModule());

const { default: AiPage } = await import("@/pages/AiPage");

/** A promise whose resolution the test controls. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("AiPage", () => {
  it("shows the loading state while the AI recommendation is generating", async () => {
    const pending = deferred<typeof RECOMMENDATION>();
    currentActor.value = createFakeActor({
      refreshRecommendation: () => pending.promise,
    });

    const { findByTestId } = renderWithProviders(<AiPage />);

    // The recommendation card renders its skeleton while the query is pending.
    expect(
      await findByTestId("ai.recommendation.loading_state"),
    ).toBeInTheDocument();

    pending.resolve(RECOMMENDATION);
    expect(await findByTestId("ai.recommendation.item.1")).toBeInTheDocument();
  });

  it("renders the generated recommendation items", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderWithProviders(<AiPage />);

    const first = await findByTestId("ai.recommendation.item.1");
    expect(first).toHaveTextContent("จัดเซ็ตข้าว + เครื่องดื่ม");
    expect(first).toHaveTextContent("เพิ่มยอดขายได้อีก 25%");

    const second = getByTestId("ai.recommendation.item.2");
    expect(second).toHaveTextContent("วัตถุดิบใกล้หมดอายุ");
  });

  it("regenerates the recommendation when the refresh button is pressed", async () => {
    const user = userEvent.setup();
    const refreshRecommendation = vi.fn(
      createFakeActor().refreshRecommendation,
    );
    currentActor.value = createFakeActor({ refreshRecommendation });

    const { findByTestId, getByTestId } = renderWithProviders(<AiPage />);
    await findByTestId("ai.recommendation.item.1");
    expect(refreshRecommendation).toHaveBeenCalledTimes(1);

    await user.click(getByTestId("ai.recommendation.refresh_button"));
    await vi.waitFor(() => {
      expect(refreshRecommendation).toHaveBeenCalledTimes(2);
    });
  });
});
