require "test_helper"

class FoodItemTest < ActiveSupport::TestCase
  def setup
    @food_item = FoodItem.new(
      name: "Nasi Putih",
      code: "MP001",
      category: :makanan_pokok,
      energy_per_100g: 130,
      protein_per_100g: 2.7,
      fat_per_100g: 0.3,
      carbohydrate_per_100g: 28.2,
      fiber_per_100g: 0.4,
      portion_size: 100,
      portion_unit: "gram",
      urt_description: "3/4 gelas"
    )
  end

  test "should be valid with valid attributes" do
    assert @food_item.valid?
  end

  test "should require name" do
    @food_item.name = nil
    assert_not @food_item.valid?
    assert_includes @food_item.errors[:name], "can't be blank"
  end

  test "should require category" do
    @food_item.category = nil
    assert_not @food_item.valid?
    assert_includes @food_item.errors[:category], "can't be blank"
  end

  test "should validate energy_per_100g is non-negative" do
    @food_item.energy_per_100g = -10
    assert_not @food_item.valid?
  end

  test "should calculate nutrition for portion" do
    nutrition = @food_item.calculate_nutrition_for_portion(200) # 200 grams
    assert_equal 260, nutrition[:energy]
    assert_equal 5.4, nutrition[:protein]
    assert_equal 0.6, nutrition[:fat]
    assert_equal 56.4, nutrition[:carbohydrate]
    assert_equal 0.8, nutrition[:fiber]
  end

  test "should calculate nutrition for smaller portion" do
    nutrition = @food_item.calculate_nutrition_for_portion(50) # 50 grams
    assert_equal 65, nutrition[:energy]
    assert_equal 1.35, nutrition[:protein]
  end

  test "should have category enum" do
    assert @food_item.category_makanan_pokok?

    @food_item.category = :lauk_hewani
    assert @food_item.category_lauk_hewani?

    @food_item.category = :sayuran
    assert @food_item.category_sayuran?
  end

  test "should have unique code when present" do
    @food_item.save!
    duplicate = @food_item.dup
    duplicate.name = "Different Name"
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:code], "has already been taken"
  end

  test "should allow blank code" do
    @food_item.code = nil
    assert @food_item.valid?
  end
end

