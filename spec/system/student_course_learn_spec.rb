require 'rails_helper'

RSpec.describe "Student Course Learn Page", type: :system do
  before do
    driven_by(:playwright)
  end

  describe "Positive Scenarios" do
    it "loads the learn page for enrolled student" do
      student = create(:user, role: 'student')
      profile = create(:student_profile, user: student)
      course = create(:course, title: "Python Course", status: :published)
      mod = create(:course_module, course: course, title: "Module 1")
      create(:lesson, course_module: mod, title: "Lesson 1", content: "Welcome to Python")
      create(:course_enrollment, student_profile: profile, course: course)

      sign_in student, scope: :user
      visit learn_student_course_path(course)

      expect(page).to have_content("Python Course")
      expect(page).to have_content("Lesson 1")
    end

    it "displays lesson content" do
      student = create(:user, role: 'student')
      profile = create(:student_profile, user: student)
      course = create(:course, title: "Ruby Course", status: :published)
      mod = create(:course_module, course: course, title: "Intro")
      create(:lesson, course_module: mod, title: "Getting Started", content: "Ruby is fun")
      create(:course_enrollment, student_profile: profile, course: course)

      sign_in student, scope: :user
      visit learn_student_course_path(course)

      expect(page).to have_content("Getting Started")
      expect(page).to have_content("Ruby is fun")
    end
  end

  describe "Negative Scenarios" do
    it "redirects unauthenticated users to login" do
      course = create(:course, status: :published)
      visit learn_student_course_path(course)
      expect(page).to have_current_path(new_user_session_path)
    end
  end
end
