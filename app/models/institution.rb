class Institution < ApplicationRecord
  has_many :beneficiaries, dependent: :destroy
  has_many :meal_distributions, dependent: :destroy

  enum :institution_type, {
    paud: 0,          # PAUD/TK/RA
    sd: 1,            # SD/MI
    smp: 2,           # SMP/MTS
    sma: 3,           # SMA/MA
    pesantren: 4,     # Pondok Pesantren
    posyandu: 5       # Posyandu
  }, prefix: true

  validates :name, presence: true
  validates :institution_type, presence: true

  scope :ordered, -> { order(:name) }
  scope :by_type, ->(type) { where(institution_type: type) }
  scope :by_province, ->(province) { where(province: province) }
  scope :by_city, ->(city) { where(city: city) }

  def full_address
    [ address, district, city, province, postal_code ].compact.reject(&:blank?).join(", ")
  end

  def total_beneficiaries
    beneficiaries.count
  end

  def recent_distributions(limit = 5)
    meal_distributions.order(distribution_date: :desc).limit(limit)
  end

  def distribution_count_this_month
    meal_distributions.where(
      distribution_date: Date.current.beginning_of_month..Date.current.end_of_month
    ).count
  end

  def institution_type_name_id
    I18n.t("institutions.types.#{institution_type}", locale: :id)
  end

  def institution_type_name_en
    I18n.t("institutions.types.#{institution_type}", locale: :en)
  end
end

