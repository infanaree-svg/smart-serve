import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OrderStatus = { #preparing; #awaitingPickup; #completed };
  type OrderChannel = { #dineIn; #online };
  type Order = {
    id : Nat;
    orderNumber : Text;
    menuName : Text;
    orderedAt : Nat;
    expectedAt : Nat;
    status : OrderStatus;
    channel : OrderChannel;
  };

  type RiderStatus = { #delivering; #enRoute; #idle };
  type Rider = {
    id : Nat;
    name : Text;
    rating : Float;
    status : RiderStatus;
    distanceKm : Float;
    etaMinutes : Nat;
  };

  type Promotion = {
    id : Nat;
    name : Text;
    discountPercent : Nat;
    targetGroup : Text;
    projectedOrderLiftPercent : Nat;
    active : Bool;
  };

  type AdvanceSlot = { id : Nat; timeLabel : Text; orderCount : Nat };

  type MenuItem = { id : Nat; name : Text; price : Nat; category : Text };

  type StockStatus = { #fresh; #low; #expiringSoon };
  type Ingredient = { id : Nat; name : Text; quantity : Nat; unit : Text; status : StockStatus };

  type Settings = {
    restaurantName : Text;
    openTime : Text;
    closeTime : Text;
    averagePrepMinutes : Nat;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    orders : Map.Map<Nat, Order>;
    nextOrderId : { var value : Nat };
    riders : Map.Map<Nat, Rider>;
    promotions : Map.Map<Nat, Promotion>;
    nextPromotionId : { var value : Nat };
    advanceSlots : Map.Map<Nat, AdvanceSlot>;
    menuItems : Map.Map<Nat, MenuItem>;
    nextMenuItemId : { var value : Nat };
    ingredients : Map.Map<Nat, Ingredient>;
    settings : { var value : Settings };
  };

  public func migration(_ : OldActor) : NewActor {
    let orders = Map.empty<Nat, Order>();
    orders.add(18, {
      id = 18;
      orderNumber = "#018";
      menuName = "ข้าวกะเพรา";
      orderedAt = 12 * 3600 + 20 * 60;
      expectedAt = 12 * 3600 + 35 * 60;
      status = #preparing;
      channel = #dineIn;
    });
    orders.add(21, {
      id = 21;
      orderNumber = "#021";
      menuName = "ราดหน้าหมูสับใหญ่";
      orderedAt = 12 * 3600 + 28 * 60;
      expectedAt = 12 * 3600 + 40 * 60;
      status = #preparing;
      channel = #online;
    });
    orders.add(22, {
      id = 22;
      orderNumber = "#022";
      menuName = "ผัดกะเพราไข่ดาว";
      orderedAt = 12 * 3600 + 32 * 60;
      expectedAt = 12 * 3600 + 45 * 60;
      status = #awaitingPickup;
      channel = #online;
    });

    let riders = Map.empty<Nat, Rider>();
    riders.add(1, {
      id = 1;
      name = "คุณสมชาย ใจดี";
      rating = 4.9;
      status = #delivering;
      distanceKm = 2.8;
      etaMinutes = 8;
    });

    let promotions = Map.empty<Nat, Promotion>();
    promotions.add(1, {
      id = 1;
      name = "ซื้อข้าว + เครื่องดื่ม ลด 15%";
      discountPercent = 15;
      targetGroup = "พนักงานออฟฟิศ";
      projectedOrderLiftPercent = 18;
      active = true;
    });

    let advanceSlots = Map.empty<Nat, AdvanceSlot>();
    advanceSlots.add(1, { id = 1; timeLabel = "11:00-12:00"; orderCount = 4 });
    advanceSlots.add(2, { id = 2; timeLabel = "12:00-13:00"; orderCount = 9 });
    advanceSlots.add(3, { id = 3; timeLabel = "13:00-14:00"; orderCount = 6 });
    advanceSlots.add(4, { id = 4; timeLabel = "14:00-15:00"; orderCount = 3 });

    let menuItems = Map.empty<Nat, MenuItem>();
    menuItems.add(1, { id = 1; name = "ข้าวกะเพรา"; price = 6000; category = "ข้าว" });
    menuItems.add(2, { id = 2; name = "ราดหน้าหมูสับใหญ่"; price = 7500; category = "เส้น" });
    menuItems.add(3, { id = 3; name = "ผัดกะเพราไข่ดาว"; price = 7000; category = "ข้าว" });
    menuItems.add(4, { id = 4; name = "ต้มยำกุ้ง"; price = 12000; category = "ต้ม" });
    menuItems.add(5, { id = 5; name = "ชาไทยเย็น"; price = 4500; category = "เครื่องดื่ม" });
    menuItems.add(6, { id = 6; name = "น้ำเปล่า"; price = 1500; category = "เครื่องดื่ม" });

    let ingredients = Map.empty<Nat, Ingredient>();
    ingredients.add(1, { id = 1; name = "ผัดกะเพรา"; quantity = 3; unit = "กำ"; status = #expiringSoon });
    ingredients.add(2, { id = 2; name = "ไข่ไก่"; quantity = 12; unit = "ฟอง"; status = #expiringSoon });
    ingredients.add(3, { id = 3; name = "หมูสับ"; quantity = 5; unit = "กก."; status = #low });
    ingredients.add(4, { id = 4; name = "กุ้งสด"; quantity = 2; unit = "กก."; status = #fresh });
    ingredients.add(5, { id = 5; name = "ข้าวสาร"; quantity = 20; unit = "กก."; status = #fresh });

    {
      accessControlState = AccessControl.initState();
      orders;
      nextOrderId = { var value = 23 };
      riders;
      promotions;
      nextPromotionId = { var value = 2 };
      advanceSlots;
      menuItems;
      nextMenuItemId = { var value = 7 };
      ingredients;
      settings = {
        var value = {
          restaurantName = "ครัวคุณอ้วย";
          openTime = "09:00";
          closeTime = "21:00";
          averagePrepMinutes = 12;
        };
      };
    };
  };
};
