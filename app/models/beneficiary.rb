class Beneficiary < ApplicationRecord
  belongs_to :institution
  belongs_to :target_group

  enum :gender, {
    male: 0,
    female: 1
  }, prefix: true

  validates :name, presence: true
  validates :institution, presence: true
  validates :target_group, presence: true

  scope :ordered, -> { order(:name) }
  scope :by_gender, ->(gender) { where(gender: gender) }
  scope :by_target_group, ->(target_group_id) { where(target_group_id: target_group_id) }
  scope :with_allergies, -> { where.not(allergies: [ nil, "" ]) }
  scope :with_special_needs, -> { where.not(special_needs: [ nil, "" ]) }

  def age
    return nil unless date_of_birth

    now = Date.current
    age = now.year - date_of_birth.year
    age -= 1 if now.yday < date_of_birth.yday
    age
  end

  def has_dietary_restrictions?
    allergies.present? || special_needs.present?
  end

  def dietary_restrictions
    restrictions = []
    restrictions << "Alergi: #{allergies}" if allergies.present?
    restrictions << "Kebutuhan Khusus: #{special_needs}" if special_needs.present?
    restrictions
  end

  def gender_name_id
    I18n.t("beneficiaries.genders.#{gender}", locale: :id)
  end

  def gender_name_en
    I18n.t("beneficiaries.genders.#{gender}", locale: :en)
  end
end

