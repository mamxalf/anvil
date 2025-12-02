require "test_helper"

class BeneficiaryTest < ActiveSupport::TestCase
  def setup
    @target_group = TargetGroup.create!(
      name: "SD Beneficiary Test",
      code: "SD_BENEFICIARY_TEST"
    )

    @institution = Institution.create!(
      name: "SDN Beneficiary Test",
      institution_type: :sd
    )

    @beneficiary = Beneficiary.new(
      name: "Budi Santoso",
      institution: @institution,
      target_group: @target_group,
      date_of_birth: Date.new(2015, 5, 15),
      gender: :male,
      allergies: "Kacang",
      special_needs: nil
    )
  end

  test "should be valid with valid attributes" do
    assert @beneficiary.valid?
  end

  test "should require name" do
    @beneficiary.name = nil
    assert_not @beneficiary.valid?
    assert_includes @beneficiary.errors[:name], "can't be blank"
  end

  test "should require institution" do
    @beneficiary.institution = nil
    assert_not @beneficiary.valid?
    assert_includes @beneficiary.errors[:institution], "must exist"
  end

  test "should require target_group" do
    @beneficiary.target_group = nil
    assert_not @beneficiary.valid?
    assert_includes @beneficiary.errors[:target_group], "must exist"
  end

  test "should have gender enum" do
    @beneficiary.gender = :male
    assert @beneficiary.gender_male?

    @beneficiary.gender = :female
    assert @beneficiary.gender_female?
  end

  test "should calculate age correctly" do
    # Born in 2015, current year calculation
    age = @beneficiary.age
    expected_age = Date.current.year - 2015
    expected_age -= 1 if Date.current.yday < Date.new(2015, 5, 15).yday

    assert_equal expected_age, age
  end

  test "should return nil age when date_of_birth is nil" do
    @beneficiary.date_of_birth = nil
    assert_nil @beneficiary.age
  end

  test "should detect dietary restrictions" do
    assert @beneficiary.has_dietary_restrictions?

    @beneficiary.allergies = nil
    @beneficiary.special_needs = "Vegetarian"
    assert @beneficiary.has_dietary_restrictions?

    @beneficiary.special_needs = nil
    assert_not @beneficiary.has_dietary_restrictions?
  end

  test "should return dietary restrictions list" do
    restrictions = @beneficiary.dietary_restrictions
    assert_includes restrictions.first, "Alergi: Kacang"
  end

  test "should scope by gender" do
    @beneficiary.save!

    female_beneficiary = Beneficiary.create!(
      name: "Siti",
      institution: @institution,
      target_group: @target_group,
      gender: :female
    )

    males = Beneficiary.by_gender(:male)
    females = Beneficiary.by_gender(:female)

    assert_includes males, @beneficiary
    assert_not_includes males, female_beneficiary
    assert_includes females, female_beneficiary
  end

  test "should scope with allergies" do
    @beneficiary.save!

    healthy_beneficiary = Beneficiary.create!(
      name: "Healthy",
      institution: @institution,
      target_group: @target_group,
      gender: :male,
      allergies: nil
    )

    with_allergies = Beneficiary.with_allergies
    assert_includes with_allergies, @beneficiary
    assert_not_includes with_allergies, healthy_beneficiary
  end
end

