class ScreenTimeLimit < ApplicationRecord
  belongs_to :parent_child

  # Day of week constants (matches Ruby's Date#wday)
  DAYS = {
    0 => :sunday,
    1 => :monday,
    2 => :tuesday,
    3 => :wednesday,
    4 => :thursday,
    5 => :friday,
    6 => :saturday
  }.freeze

  # Validations
  validates :day_of_week, presence: true, inclusion: { in: 0..6 }
  validates :max_minutes, numericality: { greater_than: 0 }
  validates :parent_child_id, uniqueness: { scope: :day_of_week, message: "already has a limit for this day" }

  # Scopes
  scope :enabled, -> { where(enabled: true) }
  scope :for_day, ->(day) { where(day_of_week: day) }

  def day_name
    DAYS[day_of_week]
  end

  def day_name_localized
    I18n.t("date.day_names")[day_of_week]
  end

  # Class method to get today's limit for a parent-child relationship
  def self.today_limit_for(parent_child)
    for_day(Date.current.wday).find_by(parent_child: parent_child)
  end

  # Class method to create default limits for all days
  def self.create_default_for(parent_child, max_minutes: 60)
    (0..6).each do |day|
      create!(
        parent_child: parent_child,
        day_of_week: day,
        max_minutes: max_minutes,
        enabled: true
      )
    end
  end
end
