class LessonHint < ApplicationRecord
  belongs_to :lesson

  # Tier enum: beginner (1) -> intermediate (2) -> advanced (3)
  enum :tier, { beginner: 1, intermediate: 2, advanced: 3 }

  # Validations
  validates :content, presence: true
  validates :tier, presence: true, uniqueness: { scope: :lesson }

  # Scopes
  scope :ordered, -> { order(tier: :asc) }
  scope :for_lesson, ->(lesson) { where(lesson: lesson) }

  # Trigger configuration helpers
  def failed_runs_threshold
    trigger_config["failed_runs_threshold"] || 3
  end

  def time_threshold_seconds
    trigger_config["time_threshold_seconds"] || 120
  end

  def show_immediately?
    trigger_config["show_immediately"] || false
  end
end
