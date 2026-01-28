class MazeAttempt < ApplicationRecord
  belongs_to :lesson
  belongs_to :student_profile

  # Status enum: in_progress (0), completed (1), abandoned (2)
  enum :status, { in_progress: 0, completed: 1, abandoned: 2 }

  # Validations
  validates :blocks_used, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :time_elapsed_seconds, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stars_earned, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 3 }

  # Custom validation to prevent concurrent active attempts
  validate :no_active_attempt_for_student_lesson, on: :create

  def no_active_attempt_for_student_lesson
    return unless in_progress?

    if MazeAttempt.active.exists?(lesson: lesson, student_profile: student_profile)
      errors.add(:student_profile, "Already have active attempt")
    end
  end

  # Scopes
  scope :completed, -> { where(status: :completed) }
  scope :for_student, ->(student) { where(student_profile: student) }
  scope :recent, -> { order(created_at: :desc) }
  scope :active, -> { where(status: :in_progress) }

  # Calculate stars based on lesson activity_config
  def calculate_stars!
    config = lesson.activity_config

    stars = 1 # Base star for completion

    # 2 stars: optimal blocks
    stars += 1 if blocks_used <= config["optimal_blocks"]

    # 3 stars: optimal time
    stars += 1 if time_elapsed_seconds <= config["optimal_time_seconds"]

    update!(stars_earned: stars)
  end
end
