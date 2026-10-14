import Common "common";

module {
  /// Lifecycle state of an order.
  public type OrderStatus = {
    #preparing; // กำลังทำ
    #awaitingPickup; // รอรับออเดอร์
    #completed; // เสร็จแล้ว
  };

  /// Where the order came from.
  public type OrderChannel = {
    #dineIn; // คิวหน้าร้าน
    #online; // ออเดอร์ออนไลน์
  };

  /// A single order as exposed to the frontend.
  public type Order = {
    id : Common.Id;
    orderNumber : Text; // e.g. "#018"
    menuName : Text;
    orderedAt : Common.Timestamp;
    expectedAt : Common.Timestamp;
    status : OrderStatus;
    channel : OrderChannel;
  };

  /// Input for creating a new order.
  public type NewOrder = {
    menuName : Text;
    orderedAt : Common.Timestamp;
    expectedAt : Common.Timestamp;
    channel : OrderChannel;
  };

  /// Filter applied when listing orders.
  public type OrderFilter = {
    status : ?OrderStatus;
    search : ?Text; // matches order number or menu name
  };

  /// Counts of orders grouped by channel.
  public type QueueSummary = {
    dineInCount : Nat; // คิวหน้าร้าน
    onlineCount : Nat; // ออเดอร์ออนไลน์
    totalCount : Nat; // รวม
  };
};
