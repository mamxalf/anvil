require 'rails_helper'

RSpec.describe "Student Dashboard", type: :system do
  before do
    driven_by(:playwright)
  end

  let!(:student) { create(:user, role: 'student') }
  let!(:student_profile) { create(:student_profile, user: student, level: 5, total_points: 100, current_streak: 3) }
  let!(:course) { create(:course, title: "Intro to Ruby") }
  let!(:enrollment) { create(:course_enrollment, student_profile: student_profile, course: course, progress_percentage: 50) }
  let!(:badge) { create(:badge, name: "First Steps", icon: "step_one") }

  before do
    create(:user_badge, student_profile: student_profile, badge: badge)
  end

  context "Positive Scenarios" do
    before do
       sign_in student, scope: :user
      visit student_dashboard_path
    end

    it "loads the dashboard successfully" do
      expect(page).to have_content("Dashboard")
      expect(page).to have_content("Hello, #{student.name}")
    end

    it "displays student profile information" do
      expect(page).to have_content("LEVEL 5")
      expect(page).to have_content("100 XP")
      expect(page).to have_content("3 Days")
    end

    it "displays enrolled courses with progress" do
      expect(page).to have_content("Intro to Ruby")
      expect(page).to have_content("50%")
    end

    it "displays recent badges" do
      expect(page).to have_content("First Steps")
    end
  end

  context "Negative Scenarios" do
    it "redirects unauthenticated users to login" do
      visit student_dashboard_path
      expect(current_path).to eq(new_user_session_path)
    end

    it "restricts access for parents" do
      parent = create(:user, :parent)
      sign_in parent, scope: :user
      visit student_dashboard_path

      expect(current_path).to eq(parent_dashboard_path)
    end

    it "restricts access for instructors" do
      instructor = create(:user, :instructor)
      sign_in instructor, scope: :user
      visit student_dashboard_path

      expect(current_path).to eq(root_path)
    end
  end
end
