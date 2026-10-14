module {
  /// Identifier for an order, rider, menu item, ingredient, promotion, or slot.
  public type Id = Nat;

  /// Wall-clock time expressed as nanoseconds since the Unix epoch.
  public type Timestamp = Nat;

  /// Money amount expressed in satang (1 THB = 100 satang).
  public type Satang = Nat;
};
