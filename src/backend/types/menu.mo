import Common "common";

module {
  /// A menu item as exposed to the frontend.
  public type MenuItem = {
    id : Common.Id;
    name : Text;
    price : Common.Satang;
    category : Text;
  };

  /// Input for creating a menu item.
  public type NewMenuItem = {
    name : Text;
    price : Common.Satang;
    category : Text;
  };

  /// Input for updating a menu item.
  public type MenuItemUpdate = {
    name : Text;
    price : Common.Satang;
    category : Text;
  };

  /// Freshness state of an ingredient.
  public type StockStatus = {
    #fresh; // ปกติ
    #low; // ใกล้หมด
    #expiringSoon; // ใกล้หมดอายุ
  };

  /// An ingredient as exposed to the frontend.
  public type Ingredient = {
    id : Common.Id;
    name : Text;
    quantity : Nat;
    unit : Text;
    status : StockStatus;
  };

  /// Input for updating an ingredient's stock.
  public type IngredientUpdate = {
    quantity : Nat;
    status : StockStatus;
  };
};
