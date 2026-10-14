import Map "mo:core/Map";
import Types "../types/riders";
import RidersLib "../lib/riders";

mixin (riders : Map.Map<Nat, Types.Rider>) {
  /// Lists riders currently delivering or en route.
  public query func listRiders() : async [Types.Rider] {
    RidersLib.listRiders(riders);
  };
};
