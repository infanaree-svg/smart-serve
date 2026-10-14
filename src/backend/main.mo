import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import FloatValue "mo:caffeineai-oql/FloatValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import OrderStatusValue "types/OrderStatusValue";
import OrderChannelValue "types/OrderChannelValue";
import RiderStatusValue "types/RiderStatusValue";
import StockStatusValue "types/StockStatusValue";

import OrderTypes "types/orders";
import RiderTypes "types/riders";
import PromotionTypes "types/promotions";
import MenuTypes "types/menu";
import ReportTypes "types/reports";

import OrdersApi "mixins/orders-api";
import RidersApi "mixins/riders-api";
import PromotionsApi "mixins/promotions-api";
import MenuApi "mixins/menu-api";
import ReportsApi "mixins/reports-api";
import AiApi "mixins/ai-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;

  let orders : Map.Map<Nat, OrderTypes.Order>;
  let nextOrderId : { var value : Nat };
  let riders : Map.Map<Nat, RiderTypes.Rider>;
  let promotions : Map.Map<Nat, PromotionTypes.Promotion>;
  let nextPromotionId : { var value : Nat };
  let advanceSlots : Map.Map<Nat, PromotionTypes.AdvanceSlot>;
  let menuItems : Map.Map<Nat, MenuTypes.MenuItem>;
  let nextMenuItemId : { var value : Nat };
  let ingredients : Map.Map<Nat, MenuTypes.Ingredient>;
  let settings : { var value : ReportTypes.Settings };

  include MixinAuthorization(accessControlState, null);

  include Expose({
    entities = [
      orders.toEntity("order", "Order", "id")
        .sample({
          id = 0;
          orderNumber = "#000";
          menuName = "";
          orderedAt = 0;
          expectedAt = 0;
          status = #preparing;
          channel = #dineIn;
        })
        .controllerOnly()
        .build(),
      riders.toEntity("rider", "Rider", "id")
        .sample({ id = 0; name = ""; rating = 0.0; status = #idle; distanceKm = 0.0; etaMinutes = 0 })
        .controllerOnly()
        .build(),
      promotions.toEntity("promotion", "Promotion", "id")
        .sample({ id = 0; name = ""; discountPercent = 0; targetGroup = ""; projectedOrderLiftPercent = 0; active = true })
        .controllerOnly()
        .build(),
      advanceSlots.toEntity("advanceSlot", "AdvanceSlot", "id")
        .sample({ id = 0; timeLabel = ""; orderCount = 0 })
        .controllerOnly()
        .build(),
      menuItems.toEntity("menuItem", "MenuItem", "id")
        .sample({ id = 0; name = ""; price = 0; category = "" })
        .controllerOnly()
        .build(),
      ingredients.toEntity("ingredient", "Ingredient", "id")
        .sample({ id = 0; name = ""; quantity = 0; unit = ""; status = #fresh })
        .controllerOnly()
        .build(),
      // `settings` is a single persisted record, not a collection: expose it as
      // a one-row entity via manual mode over a single-element iterator.
      Entity.manual<ReportTypes.Settings>(
        "settings",
        func () = [settings.value].values(),
        "Settings",
        "restaurantName",
      )
        .sample({ restaurantName = ""; openTime = ""; closeTime = ""; averagePrepMinutes = 0 })
        .payload("restaurantName", func s = s.restaurantName)
        .payload("openTime", func s = s.openTime)
        .payload("closeTime", func s = s.closeTime)
        .payload("averagePrepMinutes", func s = s.averagePrepMinutes)
        .controllerOnly()
        .build(),
    ];
  });

  include OrdersApi(orders, nextOrderId);
  include RidersApi(riders);
  include PromotionsApi(promotions, advanceSlots, nextPromotionId);
  include MenuApi(menuItems, ingredients, nextMenuItemId);
  include ReportsApi(settings);
  include AiApi();
  include ApiDocMixin();
};
