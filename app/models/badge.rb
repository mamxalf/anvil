class Badge < ApplicationRecord
  has_many :user_badges, dependent: :destroy
  has_many :student_profiles, through: :user_badges

  # Criteria types for earning badges
  enum :criteria_type, {
    course_completed: 0,
    lessons_completed: 1,
    streak_days: 2,
    quizzes_passed: 3,
    total_points: 4,
    first_course: 5,
    perfect_quiz: 6,
    first_lesson: 7,
    first_badge: 8
  }

  # Rarity levels
  enum :rarity, { common: 0, rare: 1, epic: 2, legendary: 3 }

  # Validations
  validates :name, presence: true
  validates :criteria_value, numericality: { greater_than: 0 }
  validates :points_reward, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :by_rarity, ->(rarity) { where(rarity: rarity) }

  # Check if a student qualifies for this badge
  def qualifies?(student_profile)
    return false if already_earned?(student_profile)

    case criteria_type
    when "course_completed"
      student_profile.course_enrollments.completed.count >= criteria_value
    when "lessons_completed"
      student_profile.lesson_progresses.completed.count >= criteria_value
    when "streak_days"
      student_profile.current_streak >= criteria_value
    when "quizzes_passed"
      student_profile.quiz_attempts.passed.count >= criteria_value
    when "total_points"
      student_profile.total_points >= criteria_value
    when "first_course"
      student_profile.course_enrollments.count >= 1
    when "perfect_quiz"
      student_profile.quiz_attempts.where(score: 100).count >= criteria_value
    when "first_lesson"
      student_profile.lesson_progresses.completed.count >= 1
    when "first_badge"
      student_profile.user_badges.count >= 1
    else
      false
    end
  end

  def already_earned?(student_profile)
    user_badges.exists?(student_profile: student_profile)
  end

  # Award badge to student
  def award_to!(student_profile)
    return if already_earned?(student_profile)

    user_badge = user_badges.create!(
      student_profile: student_profile,
      earned_at: Time.current
    )

    # Award bonus points
    if points_reward > 0
      student_profile.add_points(points_reward)
    end

    # Send notification
    Notification.notify_badge_earned(student_profile.user, self)

    user_badge
  end

  # Class method to check and award all eligible badges
  class << self
    def check_and_award_all(student_profile)
      awarded = []
      find_each do |badge|
        if badge.qualifies?(student_profile)
          user_badge = badge.award_to!(student_profile)
          awarded << badge if user_badge
        end
      end
      awarded
    end
  end
end
