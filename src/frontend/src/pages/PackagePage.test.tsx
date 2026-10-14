import { describe, expect, it, vi } from "vitest";

import {
  actorModule,
  createFakeActor,
  currentActor,
  renderWithProviders,
} from "@/test/harness";

vi.mock("@caffeineai/core-infrastructure", () => actorModule());

const { default: PackagePage } = await import("@/pages/PackagePage");

describe("PackagePage", () => {
  it("shows the monthly price and free-trial label", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId } = renderWithProviders(<PackagePage />);

    expect(await findByTestId("package.price")).toHaveTextContent("฿990");
    expect(await findByTestId("package.trial_label")).toHaveTextContent(
      "ใช้ฟรี 7 วัน",
    );
  });

  it("lists the bundled tools and benefits", async () => {
    currentActor.value = createFakeActor();
    const { findByTestId, getByTestId } = renderWithProviders(<PackagePage />);

    const features = await findByTestId("package.feature_list");
    expect(features).toHaveTextContent("ตารางออเดอร์สดและคิวหน้าร้าน");
    expect(features).toHaveTextContent("ติดตามไรเดอร์แบบเรียลไทม์");
    expect(getByTestId("package.benefit.1")).toHaveTextContent(
      "จัดการครัวและคิวออเดอร์",
    );
  });
});
