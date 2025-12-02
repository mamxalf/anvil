class FoodItem < ApplicationRecord
  has_many :menu_items, dependent: :restrict_with_error
  has_many :menus, through: :menu_items

  # Categories based on document: Makanan Pokok, Lauk Hewani, Lauk Nabati, Sayuran, Buah, Susu
  enum :category, {
    makanan_pokok: 0,   # Staple food (rice, bread, etc.)
    lauk_hewani: 1,     # Animal protein
    lauk_nabati: 2,     # Plant protein
    sayuran: 3,         # Vegetables
    buah: 4,            # Fruits
    susu: 5             # Milk/Dairy
  }, prefix: true

  validates :name, presence: true
  validates :category, presence: true
  validates :energy_per_100g, numericality: { greater_than_or_equal_to: 0 }
  validates :protein_per_100g, numericality: { greater_than_or_equal_to: 0 }
  validates :fat_per_100g, numericality: { greater_than_or_equal_to: 0 }
  validates :carbohydrate_per_100g, numericality: { greater_than_or_equal_to: 0 }
  validates :fiber_per_100g, numericality: { greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:name) }
  scope :by_category, ->(category) { where(category: category) }

  def calculate_nutrition_for_portion(grams)
    multiplier = grams.to_f / 100.0
    {
      energy: (energy_per_100g * multiplier).round(2),
      protein: (protein_per_100g * multiplier).round(2),
      fat: (fat_per_100g * multiplier).round(2),
      carbohydrate: (carbohydrate_per_100g * multiplier).round(2),
      fiber: (fiber_per_100g * multiplier).round(2)
    }
  end

  def category_name_id
    I18n.t("food_items.categories.#{category}", locale: :id)
  end

  def category_name_en
    I18n.t("food_items.categories.#{category}", locale: :en)
  end
end

