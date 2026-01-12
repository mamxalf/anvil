require "test_helper"

class CourseTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(email: "instructor-#{Time.now.to_f}@test.com", password: "password", role: :instructor, name: "Dr. Code")
    @instructor = @user.instructor_profile
    @instructor.update!(bio: "Expert in Robotics")
    @course = Course.new(
      title: "Introduction to Robots",
      description: "Learn basics of robotics",
      instructor: @instructor,
      level: :beginner,
      subject: :robotics,
      enrollment_type: :free
    )
  end

  test "should be valid" do
    assert @course.valid?
  end

  test "should require a title" do
    @course.title = nil
    assert_not @course.valid?
  end

  test "should require an instructor" do
    @course.instructor = nil
    assert_not @course.valid?
  end

  test "should default status to draft" do
    @course.save!
    assert_equal "draft", @course.status
  end

  test "should have slug after save" do
    @course.save!
    assert_not_nil @course.slug
    assert_equal "introduction-to-robots", @course.slug
  end

  test "should generate unique slug" do
    @course.save!
    duplicate_course = @course.dup
    duplicate_course.slug = nil
    duplicate_course.save!
    assert_not_equal @course.slug, duplicate_course.slug
  end
end
