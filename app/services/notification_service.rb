class NotificationService
  # Centralized service for sending notifications
  # This makes it easier to add email/push notifications later without cluttering models.

  def self.notify_badge_earned(user, badge)
    Notification.create!(
      user: user,
      title: "New Badge Earned!",
      message: "You earned the #{badge.name} badge!",
      notification_type: :badge_earned,
      data: { badge_id: badge.id, badge_name: badge.name, badge_icon: badge.icon }
    )
    
    NotificationMailer.badge_earned(user, badge).deliver_later
  end

  def self.notify_course_completed(user, course)
    Notification.create!(
      user: user,
      title: "Course Completed!",
      message: "Congratulations on completing #{course.title}!",
      notification_type: :course_completed,
      data: { course_id: course.id, course_title: course.title }
    )
    
    NotificationMailer.course_completed(user, course).deliver_later
    
    # Notify parents if any
    user.parents.each do |parent|
      notify_parent_progress(parent, user, "completed course #{course.title}")
    end
  end

  def self.notify_parent_progress(parent, child, activity)
    Notification.create!(
      user: parent,
      title: "Progress Update: #{child.name}",
      message: "#{child.name} has #{activity}.",
      notification_type: :progress_update,
      data: { child_id: child.id, child_name: child.name, activity: activity }
    )
    
    # Check if parent wants notifications for this child
    relation = ParentChild.find_by(parent: parent, child: child)
    if relation&.notifications_enabled?
      NotificationMailer.parent_progress(parent, child, activity).deliver_later
    end
  end

  private

  # Placeholder for realtime/pusher integration
  def self.trigger_realtime_event(user, notification)
    # ActionCable.server.broadcast "notifications_#{user.id}", notification
  end
end
