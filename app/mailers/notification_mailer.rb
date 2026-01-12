class NotificationMailer < ApplicationMailer
  helper_method :formatted_greeting

  def badge_earned(user, badge)
    @user = user
    @badge = badge
    mail(to: @user.email, subject: "You earned a new badge: #{@badge.name}!")
  end

  def course_completed(user, course)
    @user = user
    @course = course
    mail(to: @user.email, subject: "Course Completed: #{@course.title}")
  end

  def parent_progress(parent, child, activity)
    @parent = parent
    @child = child
    @activity = activity
    mail(to: @parent.email, subject: "Progress Update for #{@child.name}")
  end

  private

  def formatted_greeting
    "Hi #{@user&.name || 'Kodibot Learner'}"
  end
end
