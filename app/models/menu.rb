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

  def nutrition_profile
    self[:nutrition_profile] || "standard"
  end

  def meets_requirements?
    target_group.meets_nutrition_requirements?(self, nutrition_profile.to_sym)
  end

  # For JSON serialization without question mark in key
  def meets_requirements
    meets_requirements?
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
    profile_key = nutrition_profile.to_sym
    requirements = target_group.nutrition_requirements_for(profile_key)

    {
      energy: {
        value: total_energy.to_f,
        required: requirements[:energy].to_f,
        met: total_energy.to_f >= requirements[:energy].to_f
      },
      protein: {
        value: total_protein.to_f,
        required: requirements[:protein].to_f,
        met: total_protein.to_f >= requirements[:protein].to_f
      },
      fat: {
        value: total_fat.to_f,
        required: requirements[:fat].to_f,
        met: total_fat.to_f >= requirements[:fat].to_f
      },
      carbohydrate: {
        value: total_carbohydrate.to_f,
        required: requirements[:carbohydrate].to_f,
        met: total_carbohydrate.to_f >= requirements[:carbohydrate].to_f
      }
    }
  end
end

