require "test_helper"

class BeneficiaryPolicyTest < ActiveSupport::TestCase
  def setup
    @admin = User.create!(
      name: "Admin",
      email: "admin_benef_policy@test.com",
      password: "password123",
      role: :admin
    )

    @dietitian = User.create!(
      name: "Dietitian",
      email: "dietitian_benef_policy@test.com",
      password: "password123",
      role: :dietitian
    )

    @user = User.create!(
      name: "Regular User",
      email: "user_benef_policy@test.com",
      password: "password123",
      role: :user
    )

    @target_group = TargetGroup.create!(
      name: "Beneficiary Policy TG",
      code: "BENEF_POLICY_TG"
    )

    @institution = Institution.create!(
      name: "Beneficiary Policy Institution",
      institution_type: :sd
    )

    @beneficiary = Beneficiary.create!(
      name: "Test Beneficiary",
      institution: @institution,
      target_group: @target_group,
      gender: :male
    )
  end

  # Admin tests
  test "admin can index beneficiaries" do
    assert BeneficiaryPolicy.new(@admin, Beneficiary).index?
  end

  test "admin can show beneficiaries" do
    assert BeneficiaryPolicy.new(@admin, @beneficiary).show?
  end

  test "admin can create beneficiaries" do
    assert BeneficiaryPolicy.new(@admin, Beneficiary).create?
  end

  test "admin can update beneficiaries" do
    assert BeneficiaryPolicy.new(@admin, @beneficiary).update?
  end

  test "admin can destroy beneficiaries" do
    assert BeneficiaryPolicy.new(@admin, @beneficiary).destroy?
  end

  # Dietitian tests
  test "dietitian can index beneficiaries" do
    assert BeneficiaryPolicy.new(@dietitian, Beneficiary).index?
  end

  test "dietitian can show beneficiaries" do
    assert BeneficiaryPolicy.new(@dietitian, @beneficiary).show?
  end

  test "dietitian can create beneficiaries" do
    assert BeneficiaryPolicy.new(@dietitian, Beneficiary).create?
  end

  test "dietitian can update beneficiaries" do
    assert BeneficiaryPolicy.new(@dietitian, @beneficiary).update?
  end

  test "dietitian cannot destroy beneficiaries" do
    assert_not BeneficiaryPolicy.new(@dietitian, @beneficiary).destroy?
  end

  # Regular user tests
  test "regular user cannot index beneficiaries" do
    assert_not BeneficiaryPolicy.new(@user, Beneficiary).index?
  end

  test "regular user cannot show beneficiaries" do
    assert_not BeneficiaryPolicy.new(@user, @beneficiary).show?
  end

  test "regular user cannot create beneficiaries" do
    assert_not BeneficiaryPolicy.new(@user, Beneficiary).create?
  end

  test "regular user cannot update beneficiaries" do
    assert_not BeneficiaryPolicy.new(@user, @beneficiary).update?
  end

  test "regular user cannot destroy beneficiaries" do
    assert_not BeneficiaryPolicy.new(@user, @beneficiary).destroy?
  end
end

