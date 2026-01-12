class Achievement < ApplicationRecord
  belongs_to :badge, optional: true
  has_many :user_achievements, dependent: :destroy
  has_many :student_profiles, through: :user_achievements

  # Enums
  enum :criteria_type, {
    login_streak: 0,
    total_xp: 1,
    courses_completed: 2,
    quizzes_passed: 3,
    forum_posts: 4,
    perfect_quiz_scores: 5
  }

  validates :title, presence: true
  validates :criteria_type, presence: true
  validates :criteria_value, presence: true, numericality: { greater_than: 0 }
  validates :xp_reward, numericality: { greater_than_or_equal_to: 0 }
end
