class Menu < ApplicationRecord
  belongs_to :target_group
  belongs_to :created_by, class_name: "User"
  has_many :menu_items, dependent: :destroy
  has_many :food_items, through: :menu_items
  has_many :meal_distributions, dependent: :restrict_with_error

  accepts_nested_attributes_for :menu_items, allow_destroy: true, reject_if: :all_blank

  enum :status, {
    draft: 0,
    published: 1,
    archived: 2
  }, prefix: true

  validates :name, presence: true
  validates :target_group, presence: true
  validates :created_by, presence: true
  validates :day_number, numericality: { greater_than: 0, less_than_or_equal_to: 10 }, allow_nil: true

  scope :ordered, -> { order(created_at: :desc) }
  scope :published, -> { where(status: :published) }
  scope :by_target_group, ->(target_group_id) { where(target_group_id: target_group_id) }
  scope :by_day, ->(day_number) { where(day_number: day_number) }

  before_save :calculate_totals

  def calculate_totals
    totals = menu_items.includes(:food_item).sum_nutrition

    self.total_energy = totals[:energy]
    self.total_protein = totals[:protein]
    self.total_fat = totals[:fat]
    self.total_carbohydrate = totals[:carbohydrate]
    self.total_fiber = totals[:fiber]
  end

  def recalculate_totals!
    calculate_totals
    save!
  end

  def meets_requirements?
    target_group.meets_nutrition_requirements?(self)
  end

  def nutrition_summary
    {
      energy: total_energy,
      protein: total_protein,
      fat: total_fat,
      carbohydrate: total_carbohydrate,
      fiber: total_fiber
    }
  end

  def nutrition_compliance
    requirements = target_group.nutrition_requirements
    {
      energy: { value: total_energy, required: requirements[:energy], met: total_energy >= requirements[:energy] },
      protein: { value: total_protein, required: requirements[:protein], met: total_protein >= requirements[:protein] },
      fat: { value: total_fat, required: requirements[:fat], met: total_fat >= requirements[:fat] },
      carbohydrate: { value: total_carbohydrate, required: requirements[:carbohydrate], met: total_carbohydrate >= requirements[:carbohydrate] }
    }
  end
end

