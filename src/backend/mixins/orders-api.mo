import Map "mo:core/Map";
import Types "../types/orders";
import OrdersLib "../lib/orders";

mixin (orders : Map.Map<Nat, Types.Order>, nextOrderId : { var value : Nat }) {
  /// Lists orders, optionally filtered by status and/or search term.
  public query func listOrders(filter : Types.OrderFilter) : async [Types.Order] {
    OrdersLib.listOrders(orders, filter);
  };

  /// Creates a new order.
  public shared func createOrder(input : Types.NewOrder) : async Types.Order {
    OrdersLib.createOrder(orders, nextOrderId, input);
  };

  /// Advances an order to its next status.
  public shared func advanceOrderStatus(id : Nat) : async ?Types.Order {
    OrdersLib.advanceOrderStatus(orders, id);
  };

  /// Returns counts of orders grouped by channel.
  public query func getQueueSummary() : async Types.QueueSummary {
    OrdersLib.getQueueSummary(orders);
  };
};
