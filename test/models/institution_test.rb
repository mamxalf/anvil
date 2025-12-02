require "test_helper"

class InstitutionTest < ActiveSupport::TestCase
  def setup
    @institution = Institution.new(
      name: "SDN 1 Jakarta",
      institution_type: :sd,
      address: "Jl. Merdeka No. 1",
      province: "DKI Jakarta",
      city: "Jakarta Pusat",
      district: "Gambir",
      postal_code: "10110",
      phone: "021-12345678",
      email: "sdn1@jakarta.go.id",
      student_count: 500,
      contact_person: "Bapak Kepala Sekolah"
    )
  end

  test "should be valid with valid attributes" do
    assert @institution.valid?
  end

  test "should require name" do
    @institution.name = nil
    assert_not @institution.valid?
    assert_includes @institution.errors[:name], "can't be blank"
  end

  test "should require institution_type" do
    @institution.institution_type = nil
    assert_not @institution.valid?
    assert_includes @institution.errors[:institution_type], "can't be blank"
  end

  test "should have institution_type enum" do
    @institution.institution_type = :paud
    assert @institution.institution_type_paud?

    @institution.institution_type = :sd
    assert @institution.institution_type_sd?

    @institution.institution_type = :smp
    assert @institution.institution_type_smp?

    @institution.institution_type = :sma
    assert @institution.institution_type_sma?

    @institution.institution_type = :pesantren
    assert @institution.institution_type_pesantren?

    @institution.institution_type = :posyandu
    assert @institution.institution_type_posyandu?
  end

  test "should return full address" do
    full = @institution.full_address
    assert_includes full, "Jl. Merdeka No. 1"
    assert_includes full, "Jakarta Pusat"
    assert_includes full, "DKI Jakarta"
  end

  test "should handle empty address components" do
    @institution.district = nil
    @institution.postal_code = nil
    full = @institution.full_address
    assert_includes full, "Jl. Merdeka No. 1"
    assert_includes full, "Jakarta Pusat"
    assert_not_includes full, "nil"
  end

  test "should count beneficiaries" do
    @institution.save!
    target_group = TargetGroup.create!(name: "Test TG", code: "TEST_TG_INST")

    3.times do |i|
      Beneficiary.create!(
        name: "Student #{i}",
        institution: @institution,
        target_group: target_group,
        gender: :male
      )
    end

    assert_equal 3, @institution.total_beneficiaries
  end

  test "should count distributions this month" do
    @institution.save!

    target_group = TargetGroup.create!(name: "TG Dist Test", code: "TG_DIST_TEST")
    user = User.create!(name: "Test", email: "dist_inst@test.com", password: "password123", role: :dietitian)
    menu = Menu.create!(name: "Test Menu", target_group: target_group, created_by: user)

    MealDistribution.create!(
      institution: @institution,
      menu: menu,
      distributed_by: user,
      distribution_date: Date.current,
      recipient_count: 100
    )

    MealDistribution.create!(
      institution: @institution,
      menu: menu,
      distributed_by: user,
      distribution_date: Date.current - 5.days,
      recipient_count: 150
    )

    assert_equal 2, @institution.distribution_count_this_month
  end
end

