require "test_helper"

class MenuTest < ActiveSupport::TestCase
  def setup
    @target_group = TargetGroup.create!(
      name: "SD/MI Kelas 1-3",
      code: "SD_KELAS_1_3_TEST",
      min_energy: 500,
      min_protein: 12.5,
      min_fat: 14,
      min_carbohydrate: 75
    )

    @user = User.create!(
      name: "Test Dietitian",
      email: "dietitian_menu@test.com",
      password: "password123",
      role: :dietitian
    )

    @menu = Menu.new(
      name: "Menu Hari 1",
      description: "Menu sehat untuk SD",
      target_group: @target_group,
      created_by: @user,
      day_number: 1,
      status: :draft
    )
  end

  test "should be valid with valid attributes" do
    assert @menu.valid?
  end

  test "should require name" do
    @menu.name = nil
    assert_not @menu.valid?
    assert_includes @menu.errors[:name], "can't be blank"
  end

  test "should require target_group" do
    @menu.target_group = nil
    assert_not @menu.valid?
    assert_includes @menu.errors[:target_group], "must exist"
  end

  test "should require created_by" do
    @menu.created_by = nil
    assert_not @menu.valid?
    assert_includes @menu.errors[:created_by], "must exist"
  end

  test "should validate day_number range" do
    @menu.day_number = 0
    assert_not @menu.valid?

    @menu.day_number = 11
    assert_not @menu.valid?

    @menu.day_number = 5
    assert @menu.valid?
  end

  test "should have status enum" do
    @menu.status = :draft
    assert @menu.status_draft?

    @menu.status = :published
    assert @menu.status_published?

    @menu.status = :archived
    assert @menu.status_archived?
  end

  test "should return nutrition summary" do
    @menu.total_energy = 550
    @menu.total_protein = 15
    @menu.total_fat = 16
    @menu.total_carbohydrate = 80
    @menu.total_fiber = 7

    summary = @menu.nutrition_summary
    assert_equal 550, summary[:energy]
    assert_equal 15, summary[:protein]
    assert_equal 16, summary[:fat]
    assert_equal 80, summary[:carbohydrate]
    assert_equal 7, summary[:fiber]
  end

  test "should calculate nutrition compliance" do
    @menu.save!
    @menu.total_energy = 550
    @menu.total_protein = 15
    @menu.total_fat = 16
    @menu.total_carbohydrate = 80

    compliance = @menu.nutrition_compliance
    assert compliance[:energy][:met]
    assert compliance[:protein][:met]
    assert compliance[:fat][:met]
    assert compliance[:carbohydrate][:met]
  end

  test "should return false for meets_requirements when not meeting all requirements" do
    @menu.save!
    @menu.total_energy = 400 # Below minimum
    @menu.total_protein = 10
    @menu.total_fat = 10
    @menu.total_carbohydrate = 50

    assert_not @menu.meets_requirements?
  end
end

