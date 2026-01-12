require "test_helper"

class NotificationMailerTest < ActionMailer::TestCase
  def setup
    @student = users(:student)
    @parent = users(:parent)
    @badge = badges(:coder_badge) rescue nil || Badge.create!(name: "Coder", icon: "code", criteria_type: :total_points, criteria_value: 100)
    @course = courses(:ruby_course) rescue nil || Course.first
  end

  test "badge_earned" do
    email = NotificationMailer.badge_earned(@student, @badge)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal [ "from@example.com" ], email.from # Update if config differs
    assert_equal [ @student.email ], email.to
    assert_equal "You earned a new badge: #{@badge.name}!", email.subject
    assert_match "Congratulations", email.body.encoded
    assert_match @badge.name, email.body.encoded
  end

  test "course_completed" do
    email = NotificationMailer.course_completed(@student, @course)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal [ @student.email ], email.to
    assert_equal "Course Completed: #{@course.title}", email.subject
    assert_match "Awesome job", email.body.encoded
    assert_match @course.title, email.body.encoded
  end

  test "parent_progress" do
    activity = "completed course #{@course.title}"
    email = NotificationMailer.parent_progress(@parent, @student, activity)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal [ @parent.email ], email.to
    assert_equal "Progress Update for #{@student.name}", email.subject
    assert_match "Here is a quick update", email.body.encoded
    assert_match activity, email.body.encoded
  end
end
