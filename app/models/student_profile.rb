class StudentProfile < ApplicationRecord
  belongs_to :user

  # Course enrollments
  has_many :course_enrollments, dependent: :destroy
  has_many :courses, through: :course_enrollments

  has_many :user_achievements, dependent: :destroy
  has_many :achievements, through: :user_achievements

  # Gamification
  has_many :user_badges, dependent: :destroy
  has_many :badges, through: :user_badges
  has_many :quiz_attempts, dependent: :destroy
  has_many :lesson_progresses, dependent: :destroy
  has_many :class_registrations, dependent: :destroy

  # Validations
  validates :user_id, uniqueness: true
  validates :total_points, :current_streak, :longest_streak, :level,
            numericality: { greater_than_or_equal_to: 0 }

  # Calculate age from birth_date
  def age
    return nil unless birth_date
    now = Time.current.to_date
    now.year - birth_date.year - (now.month > birth_date.month ||
      (now.month == birth_date.month && now.day >= birth_date.day) ? 0 : 1)
  end

  # Add XP points and level up if needed
  def add_points(points)
    self.total_points += points
    check_level_up
    save!
  end

  # Points needed for next level (exponential curve)
  def points_for_level(lvl)
    (100 * (1.5 ** (lvl - 1))).to_i
  end

  def points_to_next_level
    points_for_level(level + 1) - total_points
  end

  def level_progress_percentage
    current_level_points = points_for_level(level)
    next_level_points = points_for_level(level + 1)
    range = next_level_points - current_level_points
    progress = total_points - current_level_points
    [ (progress.to_f / range * 100).round, 100 ].min
  end

  # Update streak on activity
  def record_activity!
    today = Date.current

    if last_activity_at.nil? || last_activity_at.to_date < today - 1.day
      # Streak broken, reset
      self.current_streak = 1
    elsif last_activity_at.to_date == today - 1.day
      # Consecutive day, increment streak
      self.current_streak += 1
    end
    # If same day, don't change streak

    self.longest_streak = [ longest_streak, current_streak ].max
    self.last_activity_at = Time.current
    save!
  end

  private

  def check_level_up
    while total_points >= points_for_level(level + 1)
      self.level += 1
    end
  end
end
