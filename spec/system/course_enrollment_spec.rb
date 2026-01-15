require 'rails_helper'

RSpec.describe "Course Enrollment", type: :feature do
  let!(:student) { create(:user) }
  # Create course with modules and lessons to ensure content appears
  let!(:instructor_user) { create(:user, :instructor) }
  let!(:course) { create(:course, instructor_user: instructor_user, status: :published) }
  let!(:course_module) { create(:course_module, course: course, title: "Module 1") }
  let!(:lesson) { create(:lesson, course_module: course_module, title: "Introduction") }

  before do
    sign_in student, scope: :user
  end

  it "student can enroll in a course" do
    # Visit Student Courses index (since root is restricted)
    visit student_courses_path

    expect(page).to have_content("Course Catalog") # or whatever header is there
    expect(page).to have_content(course.title)

    # Click on the course card
    click_on course.title

    # Expect to be on Student Course Show page
    expect(page).to have_content(course.title)

    # Click "Start Learning" or "Enroll"
    if page.has_button?("Start Learning")
      click_on "Start Learning"
    elsif page.has_button?("Enroll Now")
      click_on "Enroll Now"
    elsif page.has_button?("Enroll")
      click_on "Enroll"
    else
      # Fallback for debugging (or maybe it's a link?)
      click_on "Enroll"
    end

    # Expect to be redirected to Learn page (first lesson)
    # The URL should contain /learn
    expect(page).to have_current_path(/learn/)

    expect(page).to have_content(/Module 1/i)
    expect(page).to have_content("Introduction")
  end
end
