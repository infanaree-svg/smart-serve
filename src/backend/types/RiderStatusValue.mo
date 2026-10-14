import OQL "mo:caffeineai-oql";
import Types "riders";

module {
  /// Maps a rider status variant to a queryable text value.
  public func _toRow(self : Types.RiderStatus) : OQL.Value =
    #text(
      switch (self) {
        case (#delivering) { "delivering" };
        case (#enRoute) { "enRoute" };
        case (#idle) { "idle" };
      }
    );
};
