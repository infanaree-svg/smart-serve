import type {
  AdvanceSlot,
  DailyRecommendation,
  DeliverySummary,
  Ingredient,
  KpiSummary,
  MenuItem,
  Order,
  PackageInfo,
  Promotion,
  Rider,
  SalesReport,
  Settings,
} from "@/backend";
import { OrderChannel, OrderStatus, RiderStatus, StockStatus } from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

/**
 * A typed fake of the generated `Backend` actor surface used by the app's
 * `use-backend` hooks. Every method returns a resolved promise so the real
 * TanStack Query hooks, query keys and mutations run unchanged.
 *
 * This is a local mock: it proves the frontend consumer contract, not the
 * canister. See the PocketIC lane for real backend behavior.
 */
export interface FakeActor {
  listOrders: (filter: {
    status?: OrderStatus;
    search?: string;
  }) => Promise<Order[]>;
  getQueueSummary: () => Promise<{
    onlineCount: bigint;
    dineInCount: bigint;
    totalCount: bigint;
  }>;
  getDeliverySummary: () => Promise<DeliverySummary>;
  listRiders: () => Promise<Rider[]>;
  listPromotions: () => Promise<Promotion[]>;
  listAdvanceSlots: () => Promise<AdvanceSlot[]>;
  listMenuItems: () => Promise<MenuItem[]>;
  listIngredients: () => Promise<Ingredient[]>;
  getSalesReport: (period: string) => Promise<SalesReport>;
  getKpiSummary: () => Promise<KpiSummary>;
  getSettings: () => Promise<Settings>;
  getPackageInfo: () => Promise<PackageInfo>;
  refreshRecommendation: () => Promise<DailyRecommendation>;
  createOrder: (input: {
    menuName: string;
    orderedAt: bigint;
    channel: OrderChannel;
    expectedAt: bigint;
  }) => Promise<Order>;
  advanceOrderStatus: (id: bigint) => Promise<Order | null>;
  createPromotion: (input: {
    targetGroup: string;
    name: string;
    discountPercent: bigint;
  }) => Promise<Promotion>;
  createMenuItem: (input: {
    name: string;
    category: string;
    price: bigint;
  }) => Promise<MenuItem>;
  updateMenuItem: (
    id: bigint,
    input: { name: string; category: string; price: bigint },
  ) => Promise<MenuItem | null>;
  deleteMenuItem: (id: bigint) => Promise<boolean>;
  updateIngredient: (
    id: bigint,
    input: { status: StockStatus; quantity: bigint },
  ) => Promise<Ingredient | null>;
  updateSettings: (input: Settings) => Promise<Settings>;
}

export const KPI_SUMMARY: KpiSummary = {
  todaySales: {
    timeLabel: "ยอดขายวันนี้",
    value: "฿4,820",
    changePercent: 12,
    changeLabel: "+12%",
  },
  estimatedProfit: {
    timeLabel: "กำไรโดยประมาณ",
    value: "฿1,450",
    changePercent: 15,
    changeLabel: "+15%",
  },
  orders: {
    timeLabel: "ออเดอร์",
    value: "38",
    changePercent: 9,
    changeLabel: "+9%",
  },
  averageWait: {
    timeLabel: "เวลารอเฉลี่ย",
    value: "12 นาที",
    changePercent: -6,
    changeLabel: "-6 นาที",
  },
};

export const PACKAGE_INFO: PackageInfo = {
  pricePerMonth: 99000n,
  badge: "คุ้มค่า!",
  trialLabel: "ใช้ฟรี 7 วัน",
  features: [
    "ตารางออเดอร์สดและคิวหน้าร้าน",
    "ติดตามไรเดอร์แบบเรียลไทม์",
    "AI แนะนำเมนูและโปรโมชัน",
    "รายงานยอดขายและกำไร",
    "จัดการเมนูและสต็อกวัตถุดิบ",
  ],
};

export const SETTINGS: Settings = {
  restaurantName: "ครัวคุณอ้วย",
  openTime: "09:00",
  closeTime: "21:00",
  averagePrepMinutes: 12n,
};

export const RIDER: Rider = {
  id: 1n,
  name: "คุณสมชาย ใจดี",
  rating: 4.9,
  status: RiderStatus.delivering,
  distanceKm: 2.8,
  etaMinutes: 8n,
};

export const ORDERS: Order[] = [
  {
    id: 18n,
    orderNumber: "#018",
    menuName: "ข้าวกะเพรา",
    orderedAt: 44_400_000_000_000n,
    expectedAt: 44_700_000_000_000n,
    status: OrderStatus.preparing,
    channel: OrderChannel.dineIn,
  },
  {
    id: 21n,
    orderNumber: "#021",
    menuName: "ราดหน้าหมูสับใหญ่",
    orderedAt: 44_880_000_000_000n,
    expectedAt: 45_000_000_000_000n,
    status: OrderStatus.preparing,
    channel: OrderChannel.online,
  },
  {
    id: 22n,
    orderNumber: "#022",
    menuName: "ผัดกะเพราไข่ดาว",
    orderedAt: 45_120_000_000_000n,
    expectedAt: 45_300_000_000_000n,
    status: OrderStatus.awaitingPickup,
    channel: OrderChannel.online,
  },
];

export const PROMOTION: Promotion = {
  id: 1n,
  name: "ซื้อข้าว + เครื่องดื่ม ลด 15%",
  discountPercent: 15n,
  targetGroup: "พนักงานออฟฟิศ",
  projectedOrderLiftPercent: 18n,
  active: true,
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 1n, name: "ข้าวกะเพรา", price: 6000n, category: "ข้าว" },
  { id: 2n, name: "ราดหน้าหมูสับใหญ่", price: 7500n, category: "เส้น" },
];

export const INGREDIENTS: Ingredient[] = [
  {
    id: 1n,
    name: "ผัดกะเพรา",
    quantity: 3n,
    unit: "กำ",
    status: StockStatus.expiringSoon,
  },
  {
    id: 2n,
    name: "ข้าวสาร",
    quantity: 20n,
    unit: "กก.",
    status: StockStatus.fresh,
  },
];

export const SALES_REPORT: SalesReport = {
  totalSales: 482000n,
  totalOrders: 38n,
  series: [
    { timeLabel: "จ.", sales: 382000n, orders: 31n },
    { timeLabel: "อา.", sales: 482000n, orders: 38n },
  ],
};

export const RECOMMENDATION: DailyRecommendation = {
  generatedAt: 1_700_000_000_000_000_000n,
  items: [
    { title: "จัดเซ็ตข้าว + เครื่องดื่ม", detail: "เพิ่มยอดขายได้อีก 25%" },
    { title: "วัตถุดิบใกล้หมดอายุ", detail: "ควรใช้ภายใน 2 วัน" },
  ],
};

/** Builds a fake actor with sensible defaults; override any method per test. */
export function createFakeActor(overrides: Partial<FakeActor> = {}): FakeActor {
  const base: FakeActor = {
    listOrders: async () => ORDERS,
    getQueueSummary: async () => ({
      onlineCount: 2n,
      dineInCount: 1n,
      totalCount: 3n,
    }),
    getDeliverySummary: async () => ({
      dineInQueue: 5n,
      onlineOrders: 7n,
      delivering: 3n,
    }),
    listRiders: async () => [RIDER],
    listPromotions: async () => [PROMOTION],
    listAdvanceSlots: async () => [
      { id: 1n, timeLabel: "11:00-12:00", orderCount: 4n },
      { id: 2n, timeLabel: "12:00-13:00", orderCount: 9n },
    ],
    listMenuItems: async () => MENU_ITEMS,
    listIngredients: async () => INGREDIENTS,
    getSalesReport: async () => SALES_REPORT,
    getKpiSummary: async () => KPI_SUMMARY,
    getSettings: async () => SETTINGS,
    getPackageInfo: async () => PACKAGE_INFO,
    refreshRecommendation: async () => RECOMMENDATION,
    createOrder: async (input) => ({
      id: 99n,
      orderNumber: "#099",
      menuName: input.menuName,
      orderedAt: input.orderedAt,
      expectedAt: input.expectedAt,
      status: OrderStatus.preparing,
      channel: input.channel,
    }),
    advanceOrderStatus: async (id) => {
      const found = ORDERS.find((order) => order.id === id);
      if (!found) return null;
      return { ...found, status: OrderStatus.completed };
    },
    createPromotion: async (input) => ({
      id: 2n,
      name: input.name,
      discountPercent: input.discountPercent,
      targetGroup: input.targetGroup,
      projectedOrderLiftPercent: input.discountPercent,
      active: true,
    }),
    createMenuItem: async (input) => ({
      id: 3n,
      name: input.name,
      category: input.category,
      price: input.price,
    }),
    updateMenuItem: async (id, input) => ({
      id,
      name: input.name,
      category: input.category,
      price: input.price,
    }),
    deleteMenuItem: async () => true,
    updateIngredient: async (id, input) => ({
      id,
      name: "ผัดกะเพรา",
      quantity: input.quantity,
      unit: "กำ",
      status: input.status,
    }),
    updateSettings: async (input) => input,
  };
  return { ...base, ...overrides };
}

/**
 * Mutable holder read by the `useActor` mock on every render. Tests set
 * `currentActor.value` before rendering to install a per-test fake actor.
 */
export const currentActor: { value: FakeActor } = {
  value: createFakeActor(),
};

/**
 * Module shape for `vi.mock("@caffeineai/core-infrastructure", ...)`. The
 * `useActor` implementation reads `currentActor.value` at call time so each
 * test can swap in its own fake actor before rendering.
 */
export function actorModule() {
  return {
    useActor: () => ({ actor: currentActor.value, isFetching: false }),
    InternetIdentityProvider: ({ children }: { children: ReactNode }) =>
      children,
    useInternetIdentity: () => ({
      isAuthenticated: false,
      isInitializing: false,
      login: vi.fn(),
      clear: vi.fn(),
    }),
  };
}

/** Renders a component inside a fresh QueryClient and a MemoryRouter. */
export function renderWithProviders(
  ui: ReactElement,
  { route = "/" }: { route?: string } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}
