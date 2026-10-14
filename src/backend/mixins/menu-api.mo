import Map "mo:core/Map";
import Types "../types/menu";
import MenuLib "../lib/menu";

mixin (menuItems : Map.Map<Nat, Types.MenuItem>, ingredients : Map.Map<Nat, Types.Ingredient>, nextMenuItemId : { var value : Nat }) {
  /// Lists all menu items.
  public query func listMenuItems() : async [Types.MenuItem] {
    MenuLib.listMenuItems(menuItems);
  };

  /// Creates a menu item.
  public shared func createMenuItem(input : Types.NewMenuItem) : async Types.MenuItem {
    MenuLib.createMenuItem(menuItems, nextMenuItemId, input);
  };

  /// Updates a menu item.
  public shared func updateMenuItem(id : Nat, input : Types.MenuItemUpdate) : async ?Types.MenuItem {
    MenuLib.updateMenuItem(menuItems, id, input);
  };

  /// Deletes a menu item.
  public shared func deleteMenuItem(id : Nat) : async Bool {
    MenuLib.deleteMenuItem(menuItems, id);
  };

  /// Lists all ingredients with their stock levels.
  public query func listIngredients() : async [Types.Ingredient] {
    MenuLib.listIngredients(ingredients);
  };

  /// Updates an ingredient's stock.
  public shared func updateIngredient(id : Nat, input : Types.IngredientUpdate) : async ?Types.Ingredient {
    MenuLib.updateIngredient(ingredients, id, input);
  };
};
