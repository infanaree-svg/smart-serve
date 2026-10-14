mixin () {
  /// Returns the backend's behavioral API documentation as Markdown.
  public query func getApiDoc() : async Text {
    return "\23 Smart Serve+ Backend API

Backend for the Smart Serve+ restaurant dashboard (ครัวคุณอ้วย). It exposes the
order queue, rider tracking, promotions, menu and stock management, sales
reports, dashboard KPIs, restaurant settings, and an AI daily recommendation.

## Authentication and authorization

- All domain endpoints are callable by any caller, including anonymous ones. The
  dashboard is a single-operator tool and does not gate reads or writes behind a
  signed-in principal.
- The authorization mixin is installed but no role is required by any domain
  endpoint.
- The OQL query surface (`schema` and `execute`) is separate: every entity is
  registered at the `controllerOnly` level, so only a canister controller can
  read rows through OQL. Anonymous and ordinary signed-in callers receive an
  authorization trap from `schema`/`execute`.
- The app's frontend pins an Internet Identity derivation origin, published at
  `/.well-known/ii-derivation-origin` when available. An agent already holding
  the user's Internet Identity authorization derives the correct per-app
  principal against that origin (for example
  `icp identity link web <name> --app <host>`). Such a delegation acts with the
  user's full authority in this app until it expires.

## Units and encodings

- `Timestamp` values are nanoseconds since the Unix epoch.
- `Satang` money values are integer satang (1 THB = 100 satang).
- `Float` fields (`rating`, `distanceKm`, `changePercent`) are IEEE-754 doubles.
- `Id` values are `Nat` identifiers assigned by the backend.
- Optional fields are Candid `opt`; absent values are `null`.
- Enum-like fields are Candid variants: order `status` is
  `#preparing | #awaitingPickup | #completed`, order `channel` is
  `#dineIn | #online`, rider `status` is `#delivering | #enRoute | #idle`, and
  ingredient `status` is `#fresh | #low | #expiringSoon`.

## Orders

- `listOrders(filter)` — query. `filter.status` and `filter.search` are both
  optional; `search` matches the order number or menu name (case-insensitive).
- `createOrder(input)` — update. Assigns the next order number and returns the
  created order with status `#preparing`.
- `advanceOrderStatus(id)` — update. Moves an order one step forward:
  `#preparing` → `#awaitingPickup` → `#completed`. Returns `null` when the id is
  unknown; an order already `#completed` stays `#completed`.
- `getQueueSummary()` — query. Returns dine-in, online, and total counts.

## Riders

- `listRiders()` — query. Returns riders currently delivering or en route.

## Promotions and advance orders

- `listPromotions()` — query. Returns active promotions.
- `createPromotion(input)` — update. Creates an active promotion.
- `listAdvanceSlots()` — query. Returns the pre-order time windows and counts.

## Menu and stock

- `listMenuItems()` — query.
- `createMenuItem(input)` — update.
- `updateMenuItem(id, input)` — update. Returns `null` when the id is unknown.
- `deleteMenuItem(id)` — update. Returns whether the item existed.
- `listIngredients()` — query.
- `updateIngredient(id, input)` — update. Returns `null` when the id is unknown.

## Reports, KPIs, and settings

- `getSalesReport(period)` — query. `period` is a label such as `today` or
  `week`; returns totals plus a time series.
- `getKpiSummary()` — query. Returns the four dashboard KPI tiles.
- `getDeliverySummary()` — query. Returns dine-in queue, online orders, and
  delivering counts.
- `getSettings()` — query. Returns the restaurant settings.
- `updateSettings(input)` — update. Replaces and returns the settings.
- `getPackageInfo()` — query. Returns the monthly subscription package details.

## AI recommendation

- `refreshRecommendation()` — update. Calls Caffeine Inference and returns a
  freshly generated daily recommendation. This is an outcall-backed update and
  takes seconds to complete; show a pending state and offer a retry on failure.
  It does not trap: if inference credentials are unavailable, the model returns
  no content, or the call fails, it falls back to a static set of Thai
  recommendations and still returns a result.

## Queryable data (OQL)

The backend registers one OQL entity per persisted table, all at the
`controllerOnly` authorization level. `schema()` describes the tables and
`execute(json)` runs a query; both are controller-only.

- `order` — orders, primary key `id`.
- `rider` — riders, primary key `id`.
- `promotion` — promotions, primary key `id`.
- `advanceSlot` — pre-order time windows, primary key `id`.
- `menuItem` — menu items, primary key `id`.
- `ingredient` — ingredients, primary key `id`.
- `settings` — the single restaurant-settings row, primary key
  `restaurantName`.

## Mutation retry safety

- `createOrder`, `createPromotion`, and `createMenuItem` are not idempotent:
  each call creates a new record. Do not retry blindly after a timeout.
- `advanceOrderStatus`, `updateMenuItem`, `deleteMenuItem`, and
  `updateIngredient` are idempotent for a given target state.
- `updateSettings` is idempotent (last write wins).
- `refreshRecommendation` is safe to retry; each call regenerates the text.

## Errors and limits

- Unknown ids return `null` (or `false` for `deleteMenuItem`) rather than
  trapping.
- `refreshRecommendation` never traps: on inference failure it returns static
  Thai recommendations instead.
- OQL `schema`/`execute` trap for any caller that is not a canister controller.
";
  };
};
