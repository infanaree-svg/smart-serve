import Map "mo:core/Map";
import Types "../types/promotions";
import PromotionsLib "../lib/promotions";

mixin (promotions : Map.Map<Nat, Types.Promotion>, advanceSlots : Map.Map<Nat, Types.AdvanceSlot>, nextPromotionId : { var value : Nat }) {
  /// Lists all active promotions.
  public query func listPromotions() : async [Types.Promotion] {
    PromotionsLib.listPromotions(promotions);
  };

  /// Creates a promotion.
  public shared func createPromotion(input : Types.NewPromotion) : async Types.Promotion {
    PromotionsLib.createPromotion(promotions, nextPromotionId, input);
  };

  /// Lists the pre-order time slots with their order counts.
  public query func listAdvanceSlots() : async [Types.AdvanceSlot] {
    PromotionsLib.listAdvanceSlots(advanceSlots);
  };
};
