require "test_helper"

class MealDistributionPolicyTest < ActiveSupport::TestCase
  def setup
    @admin = User.create!(
      name: "Admin",
      email: "admin_dist_policy@test.com",
      password: "password123",
      role: :admin
    )

    @dietitian = User.create!(
      name: "Dietitian",
      email: "dietitian_dist_policy@test.com",
      password: "password123",
      role: :dietitian
    )

    @user = User.create!(
      name: "Regular User",
      email: "user_dist_policy@test.com",
      password: "password123",
      role: :user
    )

    @target_group = TargetGroup.create!(
      name: "Distribution Policy TG",
      code: "DIST_POLICY_TG"
    )

    @institution = Institution.create!(
      name: "Distribution Policy Institution",
      institution_type: :sd
    )

    @menu = Menu.create!(
      name: "Distribution Policy Menu",
      target_group: @target_group,
      created_by: @dietitian
    )

    @distribution = MealDistribution.create!(
      institution: @institution,
      menu: @menu,
      distributed_by: @dietitian,
      distribution_date: Date.current,
      recipient_count: 100
    )
  end

  # Admin tests
  test "admin can index distributions" do
    assert MealDistributionPolicy.new(@admin, MealDistribution).index?
  end

  test "admin can show distributions" do
    assert MealDistributionPolicy.new(@admin, @distribution).show?
  end

  test "admin can create distributions" do
    assert MealDistributionPolicy.new(@admin, MealDistribution).create?
  end

  test "admin can update distributions" do
    assert MealDistributionPolicy.new(@admin, @distribution).update?
  end

  test "admin can destroy distributions" do
    assert MealDistributionPolicy.new(@admin, @distribution).destroy?
  end

  # Dietitian tests
  test "dietitian can index distributions" do
    assert MealDistributionPolicy.new(@dietitian, MealDistribution).index?
  end

  test "dietitian can show distributions" do
    assert MealDistributionPolicy.new(@dietitian, @distribution).show?
  end

  test "dietitian can create distributions" do
    assert MealDistributionPolicy.new(@dietitian, MealDistribution).create?
  end

  test "dietitian can update distributions" do
    assert MealDistributionPolicy.new(@dietitian, @distribution).update?
  end

  test "dietitian cannot destroy distributions" do
    assert_not MealDistributionPolicy.new(@dietitian, @distribution).destroy?
  end

  # Regular user tests
  test "regular user cannot index distributions" do
    assert_not MealDistributionPolicy.new(@user, MealDistribution).index?
  end

  test "regular user cannot show distributions" do
    assert_not MealDistributionPolicy.new(@user, @distribution).show?
  end

  test "regular user cannot create distributions" do
    assert_not MealDistributionPolicy.new(@user, MealDistribution).create?
  end

  test "regular user cannot update distributions" do
    assert_not MealDistributionPolicy.new(@user, @distribution).update?
  end

  test "regular user cannot destroy distributions" do
    assert_not MealDistributionPolicy.new(@user, @distribution).destroy?
  end
end

