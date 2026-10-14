import Map "mo:core/Map";
import Types "../types/promotions";

module {
  /// Returns all active promotions.
  public func listPromotions(promotions : Map.Map<Nat, Types.Promotion>) : [Types.Promotion] {
    promotions.values().toArray().filter(func(promotion) { promotion.active });
  };

  /// Creates a promotion and returns it.
  public func createPromotion(promotions : Map.Map<Nat, Types.Promotion>, nextId : { var value : Nat }, input : Types.NewPromotion) : Types.Promotion {
    let id = nextId.value;
    nextId.value := id + 1;
    // Projected order lift scales with the discount, capped so it stays plausible.
    let projectedLift = if (input.discountPercent > 40) { 40 } else { input.discountPercent };
    let promotion : Types.Promotion = {
      id;
      name = input.name;
      discountPercent = input.discountPercent;
      targetGroup = input.targetGroup;
      projectedOrderLiftPercent = projectedLift;
      active = true;
    };
    promotions.add(id, promotion);
    promotion;
  };

  /// Returns the pre-order time slots with their order counts.
  public func listAdvanceSlots(slots : Map.Map<Nat, Types.AdvanceSlot>) : [Types.AdvanceSlot] {
    slots.values().toArray();
  };
};
