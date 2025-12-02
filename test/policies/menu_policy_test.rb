require "test_helper"

class MenuPolicyTest < ActiveSupport::TestCase
  def setup
    @target_group = TargetGroup.create!(
      name: "Policy Test TG",
      code: "POLICY_TEST_TG"
    )

    @admin = User.create!(
      name: "Admin",
      email: "admin_policy@test.com",
      password: "password123",
      role: :admin
    )

    @dietitian = User.create!(
      name: "Dietitian",
      email: "dietitian_policy@test.com",
      password: "password123",
      role: :dietitian
    )

    @user = User.create!(
      name: "Regular User",
      email: "user_policy@test.com",
      password: "password123",
      role: :user
    )

    @menu = Menu.create!(
      name: "Policy Test Menu",
      target_group: @target_group,
      created_by: @dietitian,
      status: :draft
    )
  end

  # Admin tests
  test "admin can index menus" do
    assert MenuPolicy.new(@admin, Menu).index?
  end

  test "admin can show menus" do
    assert MenuPolicy.new(@admin, @menu).show?
  end

  test "admin can create menus" do
    assert MenuPolicy.new(@admin, Menu).create?
  end

  test "admin can update any menu" do
    assert MenuPolicy.new(@admin, @menu).update?
  end

  test "admin can destroy any menu" do
    assert MenuPolicy.new(@admin, @menu).destroy?
  end

  test "admin can publish menus" do
    assert MenuPolicy.new(@admin, @menu).publish?
  end

  test "admin can archive menus" do
    assert MenuPolicy.new(@admin, @menu).archive?
  end

  # Dietitian tests
  test "dietitian can index menus" do
    assert MenuPolicy.new(@dietitian, Menu).index?
  end

  test "dietitian can show menus" do
    assert MenuPolicy.new(@dietitian, @menu).show?
  end

  test "dietitian can create menus" do
    assert MenuPolicy.new(@dietitian, Menu).create?
  end

  test "dietitian can update own menu" do
    assert MenuPolicy.new(@dietitian, @menu).update?
  end

  test "dietitian cannot update other dietitian menu" do
    other_dietitian = User.create!(
      name: "Other",
      email: "other_policy@test.com",
      password: "password123",
      role: :dietitian
    )
    assert_not MenuPolicy.new(other_dietitian, @menu).update?
  end

  test "dietitian can destroy own draft menu" do
    assert MenuPolicy.new(@dietitian, @menu).destroy?
  end

  test "dietitian cannot destroy published menu" do
    @menu.update!(status: :published)
    assert_not MenuPolicy.new(@dietitian, @menu).destroy?
  end

  test "dietitian can publish own draft menu" do
    assert MenuPolicy.new(@dietitian, @menu).publish?
  end

  test "dietitian cannot archive menus" do
    assert_not MenuPolicy.new(@dietitian, @menu).archive?
  end

  # Regular user tests
  test "regular user cannot index menus" do
    assert_not MenuPolicy.new(@user, Menu).index?
  end

  test "regular user cannot show menus" do
    assert_not MenuPolicy.new(@user, @menu).show?
  end

  test "regular user cannot create menus" do
    assert_not MenuPolicy.new(@user, Menu).create?
  end

  test "regular user cannot update menus" do
    assert_not MenuPolicy.new(@user, @menu).update?
  end

  test "regular user cannot destroy menus" do
    assert_not MenuPolicy.new(@user, @menu).destroy?
  end

  # Unauthenticated user tests
  test "unauthenticated user cannot access menus" do
    assert_not MenuPolicy.new(nil, Menu).index?
    assert_not MenuPolicy.new(nil, @menu).show?
    assert_not MenuPolicy.new(nil, Menu).create?
  end
end

