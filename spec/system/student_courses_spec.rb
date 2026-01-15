require 'rails_helper'

RSpec.describe "Student Courses", type: :system do
  before do
    driven_by(:playwright)
  end

  describe "Positive Scenarios" do
    it "loads the courses page successfully" do
      student = create(:user, role: 'student')
      create(:student_profile, user: student)
      create(:course, title: "Test Course", status: :published)

      sign_in student, scope: :user
      visit student_courses_path

      expect(page).to have_content("Explore & Learn")
      expect(page).to have_content("Test Course")
    end

    it "displays published courses only" do
      student = create(:user, role: 'student')
      create(:student_profile, user: student)
      create(:course, title: "Published Course", status: :published)
      create(:course, title: "Draft Course", status: :draft)

      sign_in student, scope: :user
      visit student_courses_path

      expect(page).to have_content("Published Course")
      expect(page).not_to have_content("Draft Course")
    end

    it "can navigate to course details" do
      student = create(:user, role: 'student')
      create(:student_profile, user: student)
      course = create(:course, title: "Ruby Basics", status: :published)

      sign_in student, scope: :user
      visit student_courses_path

      click_link "Ruby Basics"

      expect(page).to have_current_path(student_course_path(course))
    end
  end

  describe "Course Enrollment" do
    it "allows a student to enroll in a course" do
      student = create(:user, role: 'student')
      create(:student_profile, user: student)
      course = create(:course, title: "Python Course", status: :published)
      mod = create(:course_module, course: course)
      create(:lesson, course_module: mod, title: "Lesson 1")

      sign_in student, scope: :user
      visit student_course_path(course)

      click_button "Enroll Now"

      # After enrollment, should be on learn page or show enrolled status
      expect(page).to have_content("Lesson 1").or have_content("Continue Learning")
    end
  end

  describe "Negative Scenarios" do
    it "redirects unauthenticated users to login" do
      visit student_courses_path
      expect(page).to have_current_path(new_user_session_path)
    end

    it "restricts access for parents" do
      parent = create(:user, :parent)
      sign_in parent, scope: :user
      visit student_courses_path

      expect(page).to have_current_path(parent_dashboard_path)
    end
  end
end
