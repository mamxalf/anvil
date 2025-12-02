class MealDistribution < ApplicationRecord
  belongs_to :institution
  belongs_to :menu
  belongs_to :distributed_by, class_name: "User"

  validates :institution, presence: true
  validates :menu, presence: true
  validates :distributed_by, presence: true
  validates :distribution_date, presence: true
  validates :recipient_count, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(distribution_date: :desc) }
  scope :by_date, ->(date) { where(distribution_date: date) }
  scope :by_date_range, ->(start_date, end_date) { where(distribution_date: start_date..end_date) }
  scope :by_institution, ->(institution_id) { where(institution_id: institution_id) }
  scope :this_week, -> { where(distribution_date: Date.current.beginning_of_week..Date.current.end_of_week) }
  scope :this_month, -> { where(distribution_date: Date.current.beginning_of_month..Date.current.end_of_month) }

  def menu_name
    menu&.name
  end

  def institution_name
    institution&.name
  end

  def target_group_name
    menu&.target_group&.name
  end

  def nutrition_delivered
    return {} unless menu

    {
      energy: menu.total_energy * recipient_count,
      protein: menu.total_protein * recipient_count,
      fat: menu.total_fat * recipient_count,
      carbohydrate: menu.total_carbohydrate * recipient_count
    }
  end

  def self.total_recipients_for_period(start_date, end_date)
    by_date_range(start_date, end_date).sum(:recipient_count)
  end

  def self.distribution_stats(start_date, end_date)
    distributions = by_date_range(start_date, end_date)
    {
      total_distributions: distributions.count,
      total_recipients: distributions.sum(:recipient_count),
      unique_institutions: distributions.select(:institution_id).distinct.count,
      unique_menus: distributions.select(:menu_id).distinct.count
    }
  end
end

