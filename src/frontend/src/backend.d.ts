import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdvanceSlot {
    id: Id;
    timeLabel: string;
    orderCount: bigint;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface DailyRecommendation {
    generatedAt: bigint;
    items: Array<Recommendation>;
}
export interface DeliverySummary {
    delivering: bigint;
    dineInQueue: bigint;
    onlineOrders: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type Id = bigint;
export interface Ingredient {
    id: Id;
    status: StockStatus;
    name: string;
    unit: string;
    quantity: bigint;
}
export interface IngredientUpdate {
    status: StockStatus;
    quantity: bigint;
}
export interface Kpi {
    timeLabel: string;
    value: string;
    changeLabel: string;
    changePercent: number;
}
export interface KpiSummary {
    todaySales: Kpi;
    orders: Kpi;
    averageWait: Kpi;
    estimatedProfit: Kpi;
}
export interface MenuItem {
    id: Id;
    name: string;
    category: string;
    price: Satang;
}
export interface MenuItemUpdate {
    name: string;
    category: string;
    price: Satang;
}
export interface NewMenuItem {
    name: string;
    category: string;
    price: Satang;
}
export interface NewOrder {
    menuName: string;
    orderedAt: Timestamp;
    channel: OrderChannel;
    expectedAt: Timestamp;
}
export interface NewPromotion {
    targetGroup: string;
    name: string;
    discountPercent: bigint;
}
export interface Order {
    id: Id;
    status: OrderStatus;
    menuName: string;
    orderedAt: Timestamp;
    channel: OrderChannel;
    expectedAt: Timestamp;
    orderNumber: string;
}
export interface OrderFilter {
    status?: OrderStatus;
    search?: string;
}
export interface PackageInfo {
    features: Array<string>;
    trialLabel: string;
    badge: string;
    pricePerMonth: Satang;
}
export interface Promotion {
    id: Id;
    active: boolean;
    targetGroup: string;
    name: string;
    discountPercent: bigint;
    projectedOrderLiftPercent: bigint;
}
export interface QueueSummary {
    onlineCount: bigint;
    dineInCount: bigint;
    totalCount: bigint;
}
export interface Recommendation {
    title: string;
    detail: string;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Rider {
    id: Id;
    status: RiderStatus;
    etaMinutes: bigint;
    name: string;
    distanceKm: number;
    rating: number;
}
export interface SalesPoint {
    timeLabel: string;
    orders: bigint;
    sales: Satang;
}
export interface SalesReport {
    totalOrders: bigint;
    series: Array<SalesPoint>;
    totalSales: Satang;
}
export type Satang = bigint;
export interface Settings {
    closeTime: string;
    averagePrepMinutes: bigint;
    restaurantName: string;
    openTime: string;
}
export interface SettingsUpdate {
    closeTime: string;
    averagePrepMinutes: bigint;
    restaurantName: string;
    openTime: string;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum OrderChannel {
    dineIn = "dineIn",
    online = "online"
}
export enum OrderStatus {
    preparing = "preparing",
    completed = "completed",
    awaitingPickup = "awaitingPickup"
}
export enum RiderStatus {
    delivering = "delivering",
    idle = "idle",
    enRoute = "enRoute"
}
export enum StockStatus {
    low = "low",
    expiringSoon = "expiringSoon",
    fresh = "fresh"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Advances an order to its next status.
     */
    advanceOrderStatus(id: bigint): Promise<Order | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Creates a menu item.
     */
    createMenuItem(input: NewMenuItem): Promise<MenuItem>;
    /**
     * / Creates a new order.
     */
    createOrder(input: NewOrder): Promise<Order>;
    /**
     * / Creates a promotion.
     */
    createPromotion(input: NewPromotion): Promise<Promotion>;
    /**
     * / Deletes a menu item.
     */
    deleteMenuItem(id: bigint): Promise<boolean>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Returns the backend's behavioral API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Returns the queue and delivery counts.
     */
    getDeliverySummary(): Promise<DeliverySummary>;
    /**
     * / Returns the dashboard KPI set.
     */
    getKpiSummary(): Promise<KpiSummary>;
    /**
     * / Returns the monthly subscription package details.
     */
    getPackageInfo(): Promise<PackageInfo>;
    /**
     * / Returns counts of orders grouped by channel.
     */
    getQueueSummary(): Promise<QueueSummary>;
    /**
     * / Returns the sales report for the given period label.
     */
    getSalesReport(period: string): Promise<SalesReport>;
    /**
     * / Returns the restaurant settings.
     */
    getSettings(): Promise<Settings>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Lists the pre-order time slots with their order counts.
     */
    listAdvanceSlots(): Promise<Array<AdvanceSlot>>;
    /**
     * / Lists all ingredients with their stock levels.
     */
    listIngredients(): Promise<Array<Ingredient>>;
    /**
     * / Lists all menu items.
     */
    listMenuItems(): Promise<Array<MenuItem>>;
    /**
     * / Lists orders, optionally filtered by status and/or search term.
     */
    listOrders(filter: OrderFilter): Promise<Array<Order>>;
    /**
     * / Lists all active promotions.
     */
    listPromotions(): Promise<Array<Promotion>>;
    /**
     * / Lists riders currently delivering or en route.
     */
    listRiders(): Promise<Array<Rider>>;
    /**
     * / Generates a fresh AI daily recommendation from sales and customer behaviour.
     */
    refreshRecommendation(): Promise<DailyRecommendation>;
    schema(): Promise<string>;
    /**
     * / Updates an ingredient's stock.
     */
    updateIngredient(id: bigint, input: IngredientUpdate): Promise<Ingredient | null>;
    /**
     * / Updates a menu item.
     */
    updateMenuItem(id: bigint, input: MenuItemUpdate): Promise<MenuItem | null>;
    /**
     * / Updates the restaurant settings.
     */
    updateSettings(input: SettingsUpdate): Promise<Settings>;
}
