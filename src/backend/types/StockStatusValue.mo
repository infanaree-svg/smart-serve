import OQL "mo:caffeineai-oql";
import Types "menu";

module {
  /// Maps a stock status variant to a queryable text value.
  public func _toRow(self : Types.StockStatus) : OQL.Value =
    #text(
      switch (self) {
        case (#fresh) { "fresh" };
        case (#low) { "low" };
        case (#expiringSoon) { "expiringSoon" };
      }
    );
};
