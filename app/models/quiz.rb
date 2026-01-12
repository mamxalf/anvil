class Quiz < ApplicationRecord
  belongs_to :lesson

  has_many :questions, dependent: :destroy
  has_many :quiz_attempts, dependent: :destroy

  # Validations
  validates :title, presence: true
  validates :passing_score, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :xp_reward, numericality: { greater_than_or_equal_to: 0 }
  validates :max_attempts, numericality: { greater_than: 0 }, allow_nil: true

  # Delegate course access
  delegate :course, :course_module, to: :lesson

  # Calculate total points possible
  def total_points
    questions.sum(:points)
  end

  # Check if student can attempt quiz
  def can_attempt?(student_profile)
    return true if max_attempts.nil?

    attempts_count = quiz_attempts.where(student_profile: student_profile).count
    attempts_count < max_attempts
  end

  # Get remaining attempts for student
  def remaining_attempts(student_profile)
    return nil if max_attempts.nil?

    attempts_count = quiz_attempts.where(student_profile: student_profile).count
    [ max_attempts - attempts_count, 0 ].max
  end

  # Check if student passed the quiz
  def passed_by?(student_profile)
    quiz_attempts.where(student_profile: student_profile, passed: true).exists?
  end

  # Get best attempt for student
  def best_attempt(student_profile)
    quiz_attempts.where(student_profile: student_profile)
                 .order(score: :desc)
                 .first
  end

  # Start a new attempt
  def start_attempt!(student_profile)
    return nil unless can_attempt?(student_profile)

    quiz_attempts.create!(
      student_profile: student_profile,
      started_at: Time.current
    )
  end
end
