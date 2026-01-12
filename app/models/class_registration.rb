class ClassRegistration < ApplicationRecord
  belongs_to :scheduled_class
  belongs_to :student_profile

  # Validations
  validates :student_profile_id, uniqueness: { scope: :scheduled_class_id, message: "is already registered for this class" }

  # Scopes
  scope :attended, -> { where(attended: true) }
  scope :pending, -> { where(attended: false) }
  scope :reminder_needed, -> { where(reminder_sent: false) }

  # Delegate class info
  delegate :title, :scheduled_at, :meeting_url, :course, to: :scheduled_class, prefix: true

  def mark_attended!
    update!(attended: true)
  end

  def send_reminder!
    return if reminder_sent?
    return if scheduled_class.past?

    # Create notification for the student
    Notification.create!(
      user: student_profile.user,
      title: I18n.t("notifications.class_reminder.title"),
      message: I18n.t("notifications.class_reminder.message", class_name: scheduled_class.title, time: scheduled_class.scheduled_at.strftime("%H:%M")),
      notification_type: :scheduled_class_reminder,
      data: { scheduled_class_id: scheduled_class.id }
    )

    update!(reminder_sent: true)
  end
end
