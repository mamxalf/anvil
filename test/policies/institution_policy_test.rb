require "test_helper"

class InstitutionPolicyTest < ActiveSupport::TestCase
  def setup
    @admin = User.create!(
      name: "Admin",
      email: "admin_inst_policy@test.com",
      password: "password123",
      role: :admin
    )

    @dietitian = User.create!(
      name: "Dietitian",
      email: "dietitian_inst_policy@test.com",
      password: "password123",
      role: :dietitian
    )

    @user = User.create!(
      name: "Regular User",
      email: "user_inst_policy@test.com",
      password: "password123",
      role: :user
    )

    @institution = Institution.create!(
      name: "Policy Test Institution",
      institution_type: :sd
    )
  end

  # Admin tests
  test "admin can index institutions" do
    assert InstitutionPolicy.new(@admin, Institution).index?
  end

  test "admin can show institutions" do
    assert InstitutionPolicy.new(@admin, @institution).show?
  end

  test "admin can create institutions" do
    assert InstitutionPolicy.new(@admin, Institution).create?
  end

  test "admin can update institutions" do
    assert InstitutionPolicy.new(@admin, @institution).update?
  end

  test "admin can destroy institutions" do
    assert InstitutionPolicy.new(@admin, @institution).destroy?
  end

  # Dietitian tests
  test "dietitian can index institutions" do
    assert InstitutionPolicy.new(@dietitian, Institution).index?
  end

  test "dietitian can show institutions" do
    assert InstitutionPolicy.new(@dietitian, @institution).show?
  end

  test "dietitian can create institutions" do
    assert InstitutionPolicy.new(@dietitian, Institution).create?
  end

  test "dietitian can update institutions" do
    assert InstitutionPolicy.new(@dietitian, @institution).update?
  end

  test "dietitian cannot destroy institutions" do
    assert_not InstitutionPolicy.new(@dietitian, @institution).destroy?
  end

  # Regular user tests
  test "regular user cannot index institutions" do
    assert_not InstitutionPolicy.new(@user, Institution).index?
  end

  test "regular user cannot show institutions" do
    assert_not InstitutionPolicy.new(@user, @institution).show?
  end

  test "regular user cannot create institutions" do
    assert_not InstitutionPolicy.new(@user, Institution).create?
  end

  test "regular user cannot update institutions" do
    assert_not InstitutionPolicy.new(@user, @institution).update?
  end

  test "regular user cannot destroy institutions" do
    assert_not InstitutionPolicy.new(@user, @institution).destroy?
  end

  # Unauthenticated user tests
  test "unauthenticated user cannot access institutions" do
    assert_not InstitutionPolicy.new(nil, Institution).index?
    assert_not InstitutionPolicy.new(nil, @institution).show?
  end
end

