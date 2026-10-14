import Map "mo:core/Map";
import Types "../types/menu";

module {
  /// Returns all menu items.
  public func listMenuItems(items : Map.Map<Nat, Types.MenuItem>) : [Types.MenuItem] {
    items.values().toArray();
  };

  /// Creates a menu item and returns it.
  public func createMenuItem(items : Map.Map<Nat, Types.MenuItem>, nextId : { var value : Nat }, input : Types.NewMenuItem) : Types.MenuItem {
    let id = nextId.value;
    nextId.value := id + 1;
    let item : Types.MenuItem = {
      id;
      name = input.name;
      price = input.price;
      category = input.category;
    };
    items.add(id, item);
    item;
  };

  /// Updates a menu item and returns it, or null when it does not exist.
  public func updateMenuItem(items : Map.Map<Nat, Types.MenuItem>, id : Nat, input : Types.MenuItemUpdate) : ?Types.MenuItem {
    switch (items.get(id)) {
      case (?item) {
        let updated : Types.MenuItem = {
          id = item.id;
          name = input.name;
          price = input.price;
          category = input.category;
        };
        items.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  /// Deletes a menu item; returns whether it existed.
  public func deleteMenuItem(items : Map.Map<Nat, Types.MenuItem>, id : Nat) : Bool {
    switch (items.get(id)) {
      case (?_) { items.remove(id); true };
      case null { false };
    };
  };

  /// Returns all ingredients with their stock levels.
  public func listIngredients(ingredients : Map.Map<Nat, Types.Ingredient>) : [Types.Ingredient] {
    ingredients.values().toArray();
  };

  /// Updates an ingredient's stock and returns it, or null when it does not exist.
  public func updateIngredient(ingredients : Map.Map<Nat, Types.Ingredient>, id : Nat, input : Types.IngredientUpdate) : ?Types.Ingredient {
    switch (ingredients.get(id)) {
      case (?ingredient) {
        let updated : Types.Ingredient = {
          id = ingredient.id;
          name = ingredient.name;
          quantity = input.quantity;
          unit = ingredient.unit;
          status = input.status;
        };
        ingredients.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };
};
