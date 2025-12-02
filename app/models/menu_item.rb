class MenuItem < ApplicationRecord
  belongs_to :menu
  belongs_to :food_item

  enum :meal_type, {
    makanan_utama: 0,   # Main dish
    selingan: 1         # Snack
  }, prefix: true

  validates :menu, presence: true
  validates :food_item, presence: true
  validates :portion_size, presence: true, numericality: { greater_than: 0 }
  validates :portion_unit, presence: true

  after_save :update_menu_totals
  after_destroy :update_menu_totals

  scope :ordered, -> { order(:meal_type, :created_at) }
  scope :main_dishes, -> { where(meal_type: :makanan_utama) }
  scope :snacks, -> { where(meal_type: :selingan) }

  def self.sum_nutrition
    includes(:food_item).inject({ energy: 0, protein: 0, fat: 0, carbohydrate: 0, fiber: 0 }) do |sum, item|
      nutrition = item.calculated_nutrition
      {
        energy: sum[:energy] + nutrition[:energy],
        protein: sum[:protein] + nutrition[:protein],
        fat: sum[:fat] + nutrition[:fat],
        carbohydrate: sum[:carbohydrate] + nutrition[:carbohydrate],
        fiber: sum[:fiber] + nutrition[:fiber]
      }
    end
  end

  def calculated_nutrition
    return empty_nutrition unless food_item

    # Convert portion to grams for calculation
    grams = convert_to_grams
    food_item.calculate_nutrition_for_portion(grams)
  end

  def energy
    calculated_nutrition[:energy]
  end

  def protein
    calculated_nutrition[:protein]
  end

  def fat
    calculated_nutrition[:fat]
  end

  def carbohydrate
    calculated_nutrition[:carbohydrate]
  end

  def fiber
    calculated_nutrition[:fiber]
  end

  private

  def convert_to_grams
    case portion_unit.downcase
    when "gram", "g"
      portion_size
    when "porsi", "portion"
      portion_size * (food_item.portion_size || 100)
    else
      portion_size
    end
  end

  def empty_nutrition
    { energy: 0, protein: 0, fat: 0, carbohydrate: 0, fiber: 0 }
  end

  def update_menu_totals
    menu.recalculate_totals! if menu.persisted?
  end
end

