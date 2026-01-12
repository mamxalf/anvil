require "application_system_test_case"

class CourseEnrollmentTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @student = users(:student)
    @course = courses(:ruby_course) # Ensure it's published and available
    @course.update!(status: :published)
  end

  test "student can enroll in a course" do
    sign_in @student

    visit courses_url

    assert_selector "h1", text: "Explore Courses"
    assert_text @course.title

    # Click on the course card
    click_on @course.title

    # Expect to be on Course Show page
    assert_selector "h1", text: @course.title

    # Click "Start Learning" or "Enroll"
    # Button text might depend on implementation. Assuming "Start Learning" for now based on previous components.
    # If already enrolled, it might say "Continue".
    # Since this is a new enrollment test, ensure NOT enrolled in setup?
    # Fixtures might not enroll.

    if has_button?("Start Learning")
      click_on "Start Learning"
    elsif has_button?("Enroll Now")
      click_on "Enroll Now"
    end

    # Expect to be redirected to Learn page (first lesson)
    # The URL should contain /learn
    assert_current_path %r{/courses/#{@course.slug}/learn}

    assert_text "Module 1" # Assuming fixtures have modules
  end
end
