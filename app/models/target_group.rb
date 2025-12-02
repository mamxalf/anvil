class TargetGroup < ApplicationRecord
  has_many :menus, dependent: :restrict_with_error
  has_many :beneficiaries, dependent: :restrict_with_error

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

  def meets_nutrition_requirements?(menu)
    menu.total_energy >= min_energy &&
      menu.total_protein >= min_protein &&
      menu.total_fat >= min_fat &&
      menu.total_carbohydrate >= min_carbohydrate
  end

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
end

