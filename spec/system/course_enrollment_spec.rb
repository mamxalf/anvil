require 'rails_helper'

RSpec.describe "Course Enrollment", type: :system do
  before do
    driven_by(:playwright)
  end

  it "student can enroll in a course" do
    student = create(:user, role: 'student')
    create(:student_profile, user: student)
    course = create(:course, status: :published)
    course_module = create(:course_module, course: course, title: "Module 1")
    create(:lesson, course_module: course_module, title: "Introduction")

    sign_in student, scope: :user
    visit student_courses_path

    expect(page).to have_content(course.title)
    click_link course.title

    expect(page).to have_content(course.title)

    if page.has_button?("Enroll Now")
      click_button "Enroll Now"
    elsif page.has_button?("Start Learning")
      click_button "Start Learning"
    end

    expect(page).to have_current_path(/learn/)
    expect(page).to have_content(/Module 1/i)
    expect(page).to have_content("Introduction")
  end
end
