import OQL "mo:caffeineai-oql";
import Types "orders";

module {
  /// Maps an order status variant to a queryable text value.
  public func _toRow(self : Types.OrderStatus) : OQL.Value =
    #text(
      switch (self) {
        case (#preparing) { "preparing" };
        case (#awaitingPickup) { "awaitingPickup" };
        case (#completed) { "completed" };
      }
    );
};
