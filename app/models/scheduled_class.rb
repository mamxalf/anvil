class ScheduledClass < ApplicationRecord
  belongs_to :course
  belongs_to :instructor_profile

  has_many :class_registrations, dependent: :destroy
  has_many :student_profiles, through: :class_registrations

  # Validations
  validates :title, presence: true
  validates :scheduled_at, presence: true
  validates :duration_minutes, numericality: { greater_than: 0 }
  validates :max_participants, numericality: { greater_than: 0 }, allow_nil: true

  # Scopes
  scope :upcoming, -> { where("scheduled_at > ?", Time.current).order(:scheduled_at) }
  scope :past, -> { where("scheduled_at <= ?", Time.current).order(scheduled_at: :desc) }
  scope :today, -> { where(scheduled_at: Time.current.beginning_of_day..Time.current.end_of_day) }
  scope :this_week, -> { where(scheduled_at: Time.current.beginning_of_week..Time.current.end_of_week) }

  def instructor
    instructor_profile.user
  end

  def end_time
    scheduled_at + duration_minutes.minutes
  end

  def in_progress?
    Time.current.between?(scheduled_at, end_time)
  end

  def upcoming?
    scheduled_at > Time.current
  end

  def past?
    end_time < Time.current
  end

  # Check if student can register
  def can_register?(student_profile)
    return false if past?
    return false if class_registrations.exists?(student_profile: student_profile)
    return true if max_participants.nil?

    class_registrations.count < max_participants
  end

  def spots_remaining
    return nil if max_participants.nil?
    max_participants - class_registrations.count
  end

  # Register a student
  def register!(student_profile)
    return false unless can_register?(student_profile)

    class_registrations.create!(
      student_profile: student_profile,
      attended: false,
      reminder_sent: false
    )
  end

  # Mark student as attended
  def mark_attended!(student_profile)
    registration = class_registrations.find_by(student_profile: student_profile)
    registration&.update!(attended: true)
  end

  # Calendar event data (for iCal/Google Calendar integration)
  def to_calendar_event
    {
      title: title,
      description: description,
      start_time: scheduled_at,
      end_time: end_time,
      location: meeting_url,
      organizer: instructor.name
    }
  end
end
