class TargetGroup < ApplicationRecord
  has_many :menus, dependent: :restrict_with_error
  has_many :beneficiaries, dependent: :restrict_with_error
  has_many :nutrition_requirement_profiles,
           class_name: "TargetGroupNutritionRequirement",
           dependent: :destroy

  validates :name, presence: true
  validates :code, presence: true, uniqueness: true

  # Target group codes based on the document
  CODES = {
    ibu_hamil: "IBU_HAMIL",
    ibu_menyusui: "IBU_MENYUSUI",
    balita_paud: "BALITA_PAUD",
    sd_kelas_1_3: "SD_KELAS_1_3",
    sd_kelas_4_6: "SD_KELAS_4_6",
    smp: "SMP",
    sma: "SMA",
    santri: "SANTRI"
  }.freeze

  scope :ordered, -> { order(:name) }

  def meets_nutrition_requirements?(menu, profile_key = :standard)
    requirements = nutrition_requirements_for(profile_key)

    menu.total_energy.to_f >= requirements[:energy].to_f &&
      menu.total_protein.to_f >= requirements[:protein].to_f &&
      menu.total_fat.to_f >= requirements[:fat].to_f &&
      menu.total_carbohydrate.to_f >= requirements[:carbohydrate].to_f
  end

  # Default nutrition requirements based on min_* columns
  def nutrition_requirements
    {
      energy: min_energy,
      protein: min_protein,
      fat: min_fat,
      carbohydrate: min_carbohydrate,
      fiber: min_fiber,
      vitamins: {
        a: min_vitamin_a,
        b1: min_vitamin_b1,
        b2: min_vitamin_b2,
        b3: min_vitamin_b3,
        b6: min_vitamin_b6,
        b9: min_vitamin_b9,
        b12: min_vitamin_b12,
        c: min_vitamin_c,
        d: min_vitamin_d
      },
      minerals: {
        calcium: min_calcium,
        iron: min_iron,
        zinc: min_zinc,
        iodine: min_iodine,
        selenium: min_selenium
      }
    }
  end

  # Returns macro requirements for a given profile, falling back to min_* values
  def nutrition_requirements_for(profile_key = :standard)
    profile = nutrition_requirement_profiles.find_by(profile_key: profile_key.to_s)

    if profile
      {
        energy: profile.energy || min_energy,
        protein: profile.protein || min_protein,
        fat: profile.fat || min_fat,
        carbohydrate: profile.carbohydrate || min_carbohydrate,
        fiber: profile.fiber || min_fiber
      }
    else
      {
        energy: min_energy,
        protein: min_protein,
        fat: min_fat,
        carbohydrate: min_carbohydrate,
        fiber: min_fiber
      }
    end
  end

  # Expose all profiles as a hash keyed by profile_key for frontend use
  def nutrition_profiles
    nutrition_requirement_profiles.each_with_object({}) do |profile, hash|
      hash[profile.profile_key] = profile.to_profile_hash
    end
  end
end

