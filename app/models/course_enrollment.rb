class CourseEnrollment < ApplicationRecord
  belongs_to :student_profile
  belongs_to :course
  belongs_to :enrolled_by, class_name: "User", optional: true

  has_one :certificate, dependent: :destroy

  enum :status, { active: 0, completed: 1, expired: 2, cancelled: 3 }

  # Validations
  validates :student_profile_id, uniqueness: { scope: :course_id, message: "is already enrolled in this course" }

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :completed, -> { where(status: :completed) }
  scope :trial_active, -> { where("trial_expires_at IS NOT NULL AND trial_expires_at > ?", Time.current) }
  scope :trial_expired, -> { where("trial_expires_at IS NOT NULL AND trial_expires_at <= ?", Time.current) }
  scope :recent, -> { order(created_at: :desc) }

  # Check if trial is active
  def trial_active?
    trial_expires_at.present? && trial_expires_at > Time.current
  end

  # Check if trial expired
  def trial_expired?
    trial_expires_at.present? && trial_expires_at <= Time.current
  end

  # Complete the course
  def complete!
    return if completed?

    update!(
      status: :completed,
      completed_at: Time.current,
      progress_percentage: 100
    )

    # Create certificate
    create_certificate!(
      certificate_number: generate_certificate_number,
      issued_at: Time.current
    )

    # Notify user
    Notification.notify_course_completed(student_profile.user, course)
  end

  # Calculate days since enrollment
  def days_enrolled
    (Date.current - created_at.to_date).to_i
  end

  private

  def generate_certificate_number
    "KODI-#{course.id[0..7].upcase}-#{student_profile.id[0..7].upcase}-#{Time.current.strftime('%Y%m%d')}"
  end
end
