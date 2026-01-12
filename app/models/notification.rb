class Notification < ApplicationRecord
  belongs_to :user

  enum :notification_type, {
    general: 0,
    progress_update: 1,
    badge_earned: 2,
    course_completed: 3,
    quiz_passed: 4,
    streak_milestone: 5,
    weekly_summary: 6,
    daily_summary: 7,
    new_course: 8,
    scheduled_class_reminder: 9,
    enrollment_approved: 10
  }

  # Validations
  validates :title, presence: true

  # Scopes
  scope :unread, -> { where(read_at: nil) }
  scope :read, -> { where.not(read_at: nil) }
  scope :recent, -> { order(created_at: :desc) }
  scope :for_parent_digest, -> { where(notification_type: [ :progress_update, :badge_earned, :course_completed, :quiz_passed ]) }

  def read?
    read_at.present?
  end

  def mark_as_read!
    update!(read_at: Time.current) unless read?
  end

  # Class method to create notifications
  class << self
    def notify_badge_earned(user, badge)
      create!(
        user: user,
        title: I18n.t("notifications.badge_earned.title"),
        message: I18n.t("notifications.badge_earned.message", badge_name: badge.name),
        notification_type: :badge_earned,
        data: { badge_id: badge.id, badge_name: badge.name, badge_icon: badge.icon }
      )
    end

    def notify_course_completed(user, course)
      create!(
        user: user,
        title: I18n.t("notifications.course_completed.title"),
        message: I18n.t("notifications.course_completed.message", course_name: course.title),
        notification_type: :course_completed,
        data: { course_id: course.id, course_title: course.title }
      )
    end

    def notify_progress_update(parent, child, progress_data)
      create!(
        user: parent,
        title: I18n.t("notifications.progress_update.title", child_name: child.name),
        message: I18n.t("notifications.progress_update.message"),
        notification_type: :progress_update,
        data: { child_id: child.id, child_name: child.name }.merge(progress_data)
      )
    end
  end
end
