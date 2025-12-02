require "test_helper"

class MenuItemTest < ActiveSupport::TestCase
  def setup
    @target_group = TargetGroup.create!(
      name: "SD Test",
      code: "SD_TEST_MENU_ITEM",
      min_energy: 500,
      min_protein: 12.5,
      min_fat: 14,
      min_carbohydrate: 75
    )

    @user = User.create!(
      name: "Test User",
      email: "user_menuitem@test.com",
      password: "password123",
      role: :dietitian
    )

    @menu = Menu.create!(
      name: "Test Menu",
      target_group: @target_group,
      created_by: @user
    )

    @food_item = FoodItem.create!(
      name: "Nasi Putih",
      code: "MP_MENUITEM_001",
      category: :makanan_pokok,
      energy_per_100g: 130,
      protein_per_100g: 2.7,
      fat_per_100g: 0.3,
      carbohydrate_per_100g: 28.2,
      fiber_per_100g: 0.4
    )

    @menu_item = MenuItem.new(
      menu: @menu,
      food_item: @food_item,
      portion_size: 150,
      portion_unit: "gram",
      meal_type: :makanan_utama
    )
  end

  test "should be valid with valid attributes" do
    assert @menu_item.valid?
  end

  test "should require menu" do
    @menu_item.menu = nil
    assert_not @menu_item.valid?
    assert_includes @menu_item.errors[:menu], "must exist"
  end

  test "should require food_item" do
    @menu_item.food_item = nil
    assert_not @menu_item.valid?
    assert_includes @menu_item.errors[:food_item], "must exist"
  end

  test "should require portion_size" do
    @menu_item.portion_size = nil
    assert_not @menu_item.valid?
    assert_includes @menu_item.errors[:portion_size], "can't be blank"
  end

  test "should require positive portion_size" do
    @menu_item.portion_size = 0
    assert_not @menu_item.valid?

    @menu_item.portion_size = -10
    assert_not @menu_item.valid?
  end

  test "should calculate nutrition based on portion" do
    @menu_item.save!

    # 150g of food with 130 kcal per 100g = 195 kcal
    assert_equal 195, @menu_item.energy
    assert_in_delta 4.05, @menu_item.protein, 0.01
    assert_in_delta 0.45, @menu_item.fat, 0.01
    assert_in_delta 42.3, @menu_item.carbohydrate, 0.01
    assert_in_delta 0.6, @menu_item.fiber, 0.01
  end

  test "should have meal_type enum" do
    @menu_item.meal_type = :makanan_utama
    assert @menu_item.meal_type_makanan_utama?

    @menu_item.meal_type = :selingan
    assert @menu_item.meal_type_selingan?
  end

  test "should sum nutrition for collection" do
    @menu_item.save!

    food_item2 = FoodItem.create!(
      name: "Telur",
      code: "LH_MENUITEM_001",
      category: :lauk_hewani,
      energy_per_100g: 154,
      protein_per_100g: 12.4,
      fat_per_100g: 10.8,
      carbohydrate_per_100g: 0.7,
      fiber_per_100g: 0.0
    )

    menu_item2 = MenuItem.create!(
      menu: @menu,
      food_item: food_item2,
      portion_size: 55, # 1 egg
      portion_unit: "gram",
      meal_type: :makanan_utama
    )

    items = MenuItem.where(menu: @menu)
    sum = items.sum_nutrition

    # Nasi: 195 kcal + Telur: 84.7 kcal = 279.7 kcal
    assert_in_delta 279.7, sum[:energy], 0.1
  end
end

