class LessonProgress < ApplicationRecord
  belongs_to :student_profile
  belongs_to :lesson

  # Validations
  validates :student_profile_id, uniqueness: { scope: :lesson_id }
  validates :video_watch_percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true
  validates :xp_earned, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :completed, -> { where.not(completed_at: nil) }
  scope :in_progress, -> { where(completed_at: nil) }
  scope :recent, -> { order(updated_at: :desc) }

  def completed?
    completed_at.present?
  end

  def in_progress?
    started_at.present? && completed_at.nil?
  end

  # Update video progress
  def update_video_progress!(percentage)
    self.video_watch_percentage = [percentage, video_watch_percentage.to_f].max
    save!

    # Auto-complete if video fully watched (90%+)
    if video_watch_percentage >= 90 && !completed?
      lesson.complete!(student_profile)
    end
  end
end
