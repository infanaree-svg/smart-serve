import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Types "../types/orders";

module {
  /// Returns all orders, optionally filtered by status and/or search term.
  public func listOrders(orders : Map.Map<Nat, Types.Order>, filter : Types.OrderFilter) : [Types.Order] {
    let all = orders.values().toArray();
    let term = switch (filter.search) {
      case (?s) { ?s.toLower() };
      case null { null };
    };
    all.filter(
      func(order) {
        let statusOk = switch (filter.status) {
          case (?s) { order.status == s };
          case null { true };
        };
        let searchOk = switch (term) {
          case (?t) {
            order.orderNumber.toLower().contains(#text t) or order.menuName.toLower().contains(#text t);
          };
          case null { true };
        };
        statusOk and searchOk;
      }
    );
  };

  /// Creates a new order and returns it.
  public func createOrder(orders : Map.Map<Nat, Types.Order>, nextId : { var value : Nat }, input : Types.NewOrder) : Types.Order {
    let id = nextId.value;
    nextId.value := id + 1;
    let order : Types.Order = {
      id;
      orderNumber = "#" # pad3(id);
      menuName = input.menuName;
      orderedAt = input.orderedAt;
      expectedAt = input.expectedAt;
      status = #preparing;
      channel = input.channel;
    };
    orders.add(id, order);
    order;
  };

  /// Advances an order to its next status and returns the updated order.
  public func advanceOrderStatus(orders : Map.Map<Nat, Types.Order>, id : Nat) : ?Types.Order {
    switch (orders.get(id)) {
      case (?order) {
        let next : Types.OrderStatus = switch (order.status) {
          case (#preparing) { #awaitingPickup };
          case (#awaitingPickup) { #completed };
          case (#completed) { #completed };
        };
        let updated : Types.Order = {
          id = order.id;
          orderNumber = order.orderNumber;
          menuName = order.menuName;
          orderedAt = order.orderedAt;
          expectedAt = order.expectedAt;
          status = next;
          channel = order.channel;
        };
        orders.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Returns counts of orders grouped by channel.
  public func getQueueSummary(orders : Map.Map<Nat, Types.Order>) : Types.QueueSummary {
    var dineIn = 0;
    var online = 0;
    for (order in orders.values()) {
      switch (order.channel) {
        case (#dineIn) { dineIn += 1 };
        case (#online) { online += 1 };
      };
    };
    { dineInCount = dineIn; onlineCount = online; totalCount = dineIn + online };
  };

  /// Formats a numeric id as a zero-padded three-digit order number.
  func pad3(n : Nat) : Text {
    if (n < 10) { "00" # n.toText() }
    else if (n < 100) { "0" # n.toText() }
    else { n.toText() };
  };
};
