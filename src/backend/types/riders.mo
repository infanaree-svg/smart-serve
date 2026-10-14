import Common "common";

module {
  /// Delivery state of a rider.
  public type RiderStatus = {
    #delivering; // กำลังจัดส่ง
    #enRoute; // กำลังเดินทาง
    #idle; // ว่าง
  };

  /// A rider as exposed to the frontend.
  public type Rider = {
    id : Common.Id;
    name : Text;
    rating : Float; // e.g. 4.9
    status : RiderStatus;
    distanceKm : Float; // remaining distance, e.g. 2.8
    etaMinutes : Nat; // e.g. 8
  };
};
