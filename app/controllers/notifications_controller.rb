class NotificationsController < ApplicationController
  def index
    @notifications = current_user.notifications.recent.limit(50)

    render inertia: "Notifications/Index", props: {
      notifications: @notifications
    }
  end

  def mark_as_read
    @notification = current_user.notifications.find(params[:id])
    @notification.mark_as_read!
    redirect_back(fallback_location: notifications_path)
  end

  def mark_all_as_read
    current_user.notifications.unread.update_all(read_at: Time.current)
    redirect_back(fallback_location: notifications_path)
  end
end
