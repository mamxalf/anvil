class Student::NotificationsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!

  def index
    @notifications = current_user.notifications.recent.limit(50)

    render inertia: "Student/Notifications/Index", props: {
      notifications: @notifications
    }
  end

  def mark_as_read
    @notification = current_user.notifications.find(params[:id])
    @notification.mark_as_read!
    redirect_back(fallback_location: student_notifications_path)
  end

  def mark_all_as_read
    current_user.notifications.unread.update_all(read_at: Time.current)
    redirect_back(fallback_location: student_notifications_path)
  end

  private

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
