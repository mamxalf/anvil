require "test_helper"

class TargetGroupTest < ActiveSupport::TestCase
  def setup
    @target_group = TargetGroup.new(
      name: "SD/MI Kelas 1-3",
      code: "SD_KELAS_1_3",
      description: "Siswa SD/MI sederajat kelas 1-3",
      min_energy: 500,
      min_protein: 12.5,
      min_fat: 14,
      min_carbohydrate: 75,
      min_fiber: 6.5,
      age_range_start: 7,
      age_range_end: 9
    )
  end

  test "should be valid with valid attributes" do
    assert @target_group.valid?
  end

  test "should require name" do
    @target_group.name = nil
    assert_not @target_group.valid?
    assert_includes @target_group.errors[:name], "can't be blank"
  end

  test "should require code" do
    @target_group.code = nil
    assert_not @target_group.valid?
    assert_includes @target_group.errors[:code], "can't be blank"
  end

  test "should have unique code" do
    @target_group.save!
    duplicate = @target_group.dup
    duplicate.name = "Different Name"
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:code], "has already been taken"
  end

  test "should return nutrition requirements hash" do
    requirements = @target_group.nutrition_requirements
    assert_equal 500, requirements[:energy]
    assert_equal 12.5, requirements[:protein]
    assert_equal 14, requirements[:fat]
    assert_equal 75, requirements[:carbohydrate]
  end

  test "should check if menu meets nutrition requirements" do
    @target_group.save!
    user = User.create!(name: "Test", email: "test@test.com", password: "password123", role: :dietitian)

    menu = Menu.new(
      name: "Test Menu",
      target_group: @target_group,
      created_by: user,
      total_energy: 550,
      total_protein: 15,
      total_fat: 16,
      total_carbohydrate: 80
    )

    assert @target_group.meets_nutrition_requirements?(menu)
  end

  test "should return false when menu does not meet nutrition requirements" do
    @target_group.save!
    user = User.create!(name: "Test", email: "test@test.com", password: "password123", role: :dietitian)

    menu = Menu.new(
      name: "Test Menu",
      target_group: @target_group,
      created_by: user,
      total_energy: 400, # Below minimum
      total_protein: 10,
      total_fat: 10,
      total_carbohydrate: 50
    )

    assert_not @target_group.meets_nutrition_requirements?(menu)
  end
end

