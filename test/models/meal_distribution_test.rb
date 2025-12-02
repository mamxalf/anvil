require "test_helper"

class MealDistributionTest < ActiveSupport::TestCase
  def setup
    @target_group = TargetGroup.create!(
      name: "TG Distribution Test",
      code: "TG_DISTRIBUTION_TEST"
    )

    @institution = Institution.create!(
      name: "SDN Distribution Test",
      institution_type: :sd,
      student_count: 300
    )

    @user = User.create!(
      name: "Dietitian Test",
      email: "dietitian_dist@test.com",
      password: "password123",
      role: :dietitian
    )

    @menu = Menu.create!(
      name: "Menu Distribution Test",
      target_group: @target_group,
      created_by: @user,
      total_energy: 550,
      total_protein: 15,
      total_fat: 16,
      total_carbohydrate: 80
    )

    @distribution = MealDistribution.new(
      institution: @institution,
      menu: @menu,
      distributed_by: @user,
      distribution_date: Date.current,
      recipient_count: 250,
      notes: "Distribution went smoothly"
    )
  end

  test "should be valid with valid attributes" do
    assert @distribution.valid?
  end

  test "should require institution" do
    @distribution.institution = nil
    assert_not @distribution.valid?
    assert_includes @distribution.errors[:institution], "must exist"
  end

  test "should require menu" do
    @distribution.menu = nil
    assert_not @distribution.valid?
    assert_includes @distribution.errors[:menu], "must exist"
  end

  test "should require distributed_by" do
    @distribution.distributed_by = nil
    assert_not @distribution.valid?
    assert_includes @distribution.errors[:distributed_by], "must exist"
  end

  test "should require distribution_date" do
    @distribution.distribution_date = nil
    assert_not @distribution.valid?
    assert_includes @distribution.errors[:distribution_date], "can't be blank"
  end

  test "should require recipient_count" do
    @distribution.recipient_count = nil
    assert_not @distribution.valid?
    assert_includes @distribution.errors[:recipient_count], "can't be blank"
  end

  test "should validate recipient_count is non-negative" do
    @distribution.recipient_count = -10
    assert_not @distribution.valid?
  end

  test "should return menu name" do
    assert_equal "Menu Distribution Test", @distribution.menu_name
  end

  test "should return institution name" do
    assert_equal "SDN Distribution Test", @distribution.institution_name
  end

  test "should return target group name" do
    assert_equal "TG Distribution Test", @distribution.target_group_name
  end

  test "should calculate nutrition delivered" do
    delivered = @distribution.nutrition_delivered

    # 250 recipients * menu nutrition
    assert_equal 250 * 550, delivered[:energy]
    assert_equal 250 * 15, delivered[:protein]
    assert_equal 250 * 16, delivered[:fat]
    assert_equal 250 * 80, delivered[:carbohydrate]
  end

  test "should scope by date range" do
    @distribution.save!

    old_distribution = MealDistribution.create!(
      institution: @institution,
      menu: @menu,
      distributed_by: @user,
      distribution_date: Date.current - 1.month,
      recipient_count: 200
    )

    this_month = MealDistribution.by_date_range(
      Date.current.beginning_of_month,
      Date.current.end_of_month
    )

    assert_includes this_month, @distribution
    assert_not_includes this_month, old_distribution
  end

  test "should calculate total recipients for period" do
    @distribution.save!

    MealDistribution.create!(
      institution: @institution,
      menu: @menu,
      distributed_by: @user,
      distribution_date: Date.current - 2.days,
      recipient_count: 150
    )

    total = MealDistribution.total_recipients_for_period(
      Date.current.beginning_of_month,
      Date.current.end_of_month
    )

    assert_equal 400, total
  end

  test "should return distribution stats" do
    @distribution.save!

    institution2 = Institution.create!(name: "SDN 2", institution_type: :sd)

    MealDistribution.create!(
      institution: institution2,
      menu: @menu,
      distributed_by: @user,
      distribution_date: Date.current - 1.day,
      recipient_count: 100
    )

    stats = MealDistribution.distribution_stats(
      Date.current.beginning_of_month,
      Date.current.end_of_month
    )

    assert_equal 2, stats[:total_distributions]
    assert_equal 350, stats[:total_recipients]
    assert_equal 2, stats[:unique_institutions]
    assert_equal 1, stats[:unique_menus]
  end

  test "should scope this week" do
    @distribution.save!

    last_week = MealDistribution.create!(
      institution: @institution,
      menu: @menu,
      distributed_by: @user,
      distribution_date: Date.current - 2.weeks,
      recipient_count: 100
    )

    this_week = MealDistribution.this_week
    assert_includes this_week, @distribution
    assert_not_includes this_week, last_week
  end
end

