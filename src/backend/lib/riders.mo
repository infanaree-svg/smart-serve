import Map "mo:core/Map";
import Types "../types/riders";

module {
  /// Returns all riders currently delivering or en route.
  public func listRiders(riders : Map.Map<Nat, Types.Rider>) : [Types.Rider] {
    riders.values().toArray().filter(
      func(rider) {
        switch (rider.status) {
          case (#delivering) { true };
          case (#enRoute) { true };
          case (#idle) { false };
        };
      }
    );
  };
};
