require "test_helper"

class ScheduledClassesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "student-cal-#{Time.now.to_f}@test.com", password: "password", role: :student, name: "Calendar Student")
    @profile = @user.student_profile
    sign_in @user, scope: :user

    @instructor_user = User.create!(email: "instructor-cal-#{Time.now.to_f}@test.com", password: "password", role: :instructor, name: "Teacher")
    @instructor = @instructor_user.instructor_profile

    @course = Course.create!(title: "Math 101", description: "Basics", instructor: @instructor, level: :beginner, subject: :coding)

    @scheduled_class = ScheduledClass.create!(
      course: @course,
      instructor_profile: @instructor,
      title: "Live Math Session",
      scheduled_at: 1.day.from_now,
      duration_minutes: 60,
      description: "Live calculation",
      max_participants: 20
    )
  end

  test "should get index" do
    get scheduled_classes_path
    assert_response :success
    # assert_inertia_component "Calendar/Index"
  end

  test "should get show" do
    get scheduled_class_path(@scheduled_class)
    assert_response :success
    # assert_inertia_component "Calendar/Show"
  end

  test "should register for class" do
    assert_difference -> { ClassRegistration.count }, 1 do
      post register_scheduled_class_path(@scheduled_class)
    end
    assert_redirected_to scheduled_class_path(@scheduled_class)
    assert_equal "Successfully registered!", flash[:notice]
  end
end
