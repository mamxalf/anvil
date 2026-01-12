class Lesson < ApplicationRecord
  belongs_to :course_module

  has_one :quiz, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :lesson_progresses, dependent: :destroy

  # Validations
  validates :title, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
  validates :xp_reward, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :ordered, -> { order(:position) }

  # Delegate course access
  delegate :course, to: :course_module

  # Parse YouTube video ID from URL
  def youtube_video_id
    return nil unless video_url.present?

    # Handle various YouTube URL formats
    regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    match = video_url.match(regex)
    match ? match[1] : nil
  end

  def youtube_embed_url
    video_id = youtube_video_id
    return nil unless video_id
    "https://www.youtube.com/embed/#{video_id}"
  end

  # Check if lesson is completed by student
  def completed_by?(student_profile)
    lesson_progresses.find_by(student_profile: student_profile)&.completed_at.present?
  end

  # Get or create progress for a student
  def progress_for(student_profile)
    lesson_progresses.find_or_create_by(student_profile: student_profile) do |progress|
      progress.started_at = Time.current
    end
  end

  # Complete the lesson for a student and award XP
  def complete!(student_profile)
    progress = progress_for(student_profile)
    return if progress.completed_at.present? # Already completed

    progress.update!(
      completed_at: Time.current,
      video_watch_percentage: 100,
      xp_earned: xp_reward
    )

    # Award XP to student
    student_profile.add_points(xp_reward)
    student_profile.record_activity!

    # Update course progress
    update_course_progress(student_profile)
  end

  private

  def update_course_progress(student_profile)
    enrollment = student_profile.course_enrollments.find_by(course: course)
    return unless enrollment

    total_lessons = course.lessons.count
    completed_lessons = student_profile.lesson_progresses
                                       .joins(lesson: :course_module)
                                       .where(course_modules: { course_id: course.id })
                                       .where.not(completed_at: nil)
                                       .count

    progress = (completed_lessons.to_f / total_lessons * 100).round(2)
    enrollment.update!(progress_percentage: progress)

    # Mark course as completed if 100%
    if progress >= 100 && enrollment.completed_at.nil?
      enrollment.update!(completed_at: Time.current, status: :completed)
      Notification.notify_course_completed(student_profile.user, course)
    end
  end
end
