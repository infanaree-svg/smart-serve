import Common "common";

module {
  /// A promotion as exposed to the frontend.
  public type Promotion = {
    id : Common.Id;
    name : Text;
    discountPercent : Nat; // e.g. 15
    targetGroup : Text; // e.g. "พนักงานออฟฟิศ"
    projectedOrderLiftPercent : Nat; // e.g. 18
    active : Bool;
  };

  /// Input for creating a promotion.
  public type NewPromotion = {
    name : Text;
    discountPercent : Nat;
    targetGroup : Text;
  };

  /// A pre-order time window with its order count.
  public type AdvanceSlot = {
    id : Common.Id;
    timeLabel : Text; // e.g. "11:00-12:00"
    orderCount : Nat;
  };
};
