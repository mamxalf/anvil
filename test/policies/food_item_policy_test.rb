require "test_helper"

class FoodItemPolicyTest < ActiveSupport::TestCase
  def setup
    @admin = User.create!(
      name: "Admin",
      email: "admin_food_policy@test.com",
      password: "password123",
      role: :admin
    )

    @dietitian = User.create!(
      name: "Dietitian",
      email: "dietitian_food_policy@test.com",
      password: "password123",
      role: :dietitian
    )

    @user = User.create!(
      name: "Regular User",
      email: "user_food_policy@test.com",
      password: "password123",
      role: :user
    )

    @food_item = FoodItem.create!(
      name: "Policy Test Food",
      code: "POLICY_FOOD_001",
      category: :makanan_pokok,
      energy_per_100g: 130,
      protein_per_100g: 2.7,
      fat_per_100g: 0.3,
      carbohydrate_per_100g: 28.2
    )
  end

  # Admin tests
  test "admin can index food items" do
    assert FoodItemPolicy.new(@admin, FoodItem).index?
  end

  test "admin can show food items" do
    assert FoodItemPolicy.new(@admin, @food_item).show?
  end

  test "admin can create food items" do
    assert FoodItemPolicy.new(@admin, FoodItem).create?
  end

  test "admin can update food items" do
    assert FoodItemPolicy.new(@admin, @food_item).update?
  end

  test "admin can destroy food items" do
    assert FoodItemPolicy.new(@admin, @food_item).destroy?
  end

  # Dietitian tests
  test "dietitian can index food items" do
    assert FoodItemPolicy.new(@dietitian, FoodItem).index?
  end

  test "dietitian can show food items" do
    assert FoodItemPolicy.new(@dietitian, @food_item).show?
  end

  test "dietitian cannot create food items" do
    assert_not FoodItemPolicy.new(@dietitian, FoodItem).create?
  end

  test "dietitian cannot update food items" do
    assert_not FoodItemPolicy.new(@dietitian, @food_item).update?
  end

  test "dietitian cannot destroy food items" do
    assert_not FoodItemPolicy.new(@dietitian, @food_item).destroy?
  end

  # Regular user tests
  test "regular user cannot index food items" do
    assert_not FoodItemPolicy.new(@user, FoodItem).index?
  end

  test "regular user cannot show food items" do
    assert_not FoodItemPolicy.new(@user, @food_item).show?
  end

  test "regular user cannot create food items" do
    assert_not FoodItemPolicy.new(@user, FoodItem).create?
  end

  test "regular user cannot update food items" do
    assert_not FoodItemPolicy.new(@user, @food_item).update?
  end

  test "regular user cannot destroy food items" do
    assert_not FoodItemPolicy.new(@user, @food_item).destroy?
  end
end

