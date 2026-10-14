import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("answers the dashboard reads instead of trapping", async () => {
  const kpi = await actor.getKpiSummary();
  expect(kpi.todaySales.value).toBe("฿4,820");
  expect(kpi.estimatedProfit.value).toBe("฿1,450");
  expect(kpi.orders.value).toBe("38");
  expect(kpi.averageWait.value).toBe("12 นาที");

  const delivery = await actor.getDeliverySummary();
  expect(delivery.dineInQueue).toBe(5n);
  expect(delivery.onlineOrders).toBe(7n);
  expect(delivery.delivering).toBe(3n);

  const pkg = await actor.getPackageInfo();
  expect(pkg.pricePerMonth).toBe(99_000n);
  expect(pkg.trialLabel).toBe("ใช้ฟรี 7 วัน");

  const settings = await actor.getSettings();
  expect(settings.restaurantName).toBe("ครัวคุณอ้วย");
});

it("lists the seeded orders with their statuses", async () => {
  const orders = await actor.listOrders({ status: [], search: [] });
  const byNumber = new Map(orders.map((order) => [order.orderNumber, order]));
  expect(byNumber.get("#018")?.status).toEqual({ preparing: null });
  expect(byNumber.get("#021")?.status).toEqual({ preparing: null });
  expect(byNumber.get("#022")?.status).toEqual({ awaitingPickup: null });
});

it("lists the seeded rider with the accepted details", async () => {
  const riders = await actor.listRiders();
  expect(riders).toContainEqual(
    expect.objectContaining({
      name: "คุณสมชาย ใจดี",
      rating: 4.9,
      distanceKm: 2.8,
      etaMinutes: 8n,
    }),
  );
});

it("round-trips a new order through the real canister", async () => {
  const created = await actor.createOrder({
    menuName: "ข้าวผัดปู",
    orderedAt: 1_000n,
    expectedAt: 2_000n,
    channel: { dineIn: null },
  });
  expect(created.menuName).toBe("ข้าวผัดปู");
  expect(created.status).toEqual({ preparing: null });

  const orders = await actor.listOrders({ status: [], search: [] });
  expect(orders).toContainEqual(expect.objectContaining({ id: created.id, menuName: "ข้าวผัดปู" }));
});

it("advances an order from preparing to awaiting pickup", async () => {
  const advanced = await actor.advanceOrderStatus(18n);
  expect(advanced).not.toBeNull();
  expect(advanced?.[0]?.status).toEqual({ awaitingPickup: null });
});

it("creates a promotion that appears in the active list", async () => {
  const created = await actor.createPromotion({
    name: "โปรนักศึกษา ลด 20%",
    discountPercent: 20n,
    targetGroup: "นักศึกษา",
  });
  expect(created.active).toBe(true);

  const promotions = await actor.listPromotions();
  expect(promotions).toContainEqual(expect.objectContaining({ id: created.id, name: "โปรนักศึกษา ลด 20%" }));
});

it("lists the seeded menu items and ingredients", async () => {
  const menu = await actor.listMenuItems();
  expect(menu.length).toBeGreaterThan(0);
  expect(menu).toContainEqual(expect.objectContaining({ name: "ข้าวกะเพรา" }));

  const ingredients = await actor.listIngredients();
  expect(ingredients.length).toBeGreaterThan(0);
});

it("returns a sales report for a period label", async () => {
  const report = await actor.getSalesReport("today");
  expect(report.series.length).toBeGreaterThan(0);
  expect(report.totalOrders).toBeGreaterThan(0n);
});

// `refreshRecommendation` is deliberately NOT called here. It reaches the
// platform inference service through `caffeineai-inference-client`, whose
// `fromEnv<system>()` traps with `CAFFEINE_INFERENCE_API_KEY is not set` on a
// local replica that has no platform secret. That trap is an environment fact
// of this sandbox, not a verdict about the app, so the method is recorded as
// unexercised in the cover's coverage limits rather than asserted here.
