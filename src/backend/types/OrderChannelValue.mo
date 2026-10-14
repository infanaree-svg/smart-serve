import OQL "mo:caffeineai-oql";
import Types "orders";

module {
  /// Maps an order channel variant to a queryable text value.
  public func _toRow(self : Types.OrderChannel) : OQL.Value =
    #text(
      switch (self) {
        case (#dineIn) { "dineIn" };
        case (#online) { "online" };
      }
    );
};
