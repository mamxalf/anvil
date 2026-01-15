require 'rails_helper'

RSpec.describe "Student Leaderboard", type: :system do
  before do
    driven_by(:playwright)
  end

  let!(:student) { create(:user, role: 'student') }
  let!(:student_profile) { create(:student_profile, user: student, level: 5, total_points: 1500) }

  let!(:other_student) { create(:user, role: 'student', name: "Top Student") }
  let!(:other_profile) { create(:student_profile, user: other_student, total_points: 2000) }

  context "Positive Scenarios" do
    before do
      sign_in student, scope: :user
      visit student_leaderboard_path
    end

    it "loads the leaderboard page successfully" do
      expect(page).to have_content("Leaderboard")
      expect(page).to have_content("Top Learners")
    end

    it "displays top students" do
      expect(page).to have_content("Top Student")
      expect(page).to have_content("2000 XP")
    end

    it "displays current student ranking" do
      expect(page).to have_content(student.name)
      expect(page).to have_content("1500 XP")
      # Rank logic check if possible, or just presence
    end
  end

  context "Negative Scenarios" do
    it "redirects unauthenticated users to login" do
      visit student_leaderboard_path
      expect(current_path).to eq(new_user_session_path)
    end

    it "restricts access for parents" do
      parent = create(:user, :parent)
      sign_in parent, scope: :user
      visit student_leaderboard_path

      expect(current_path).to eq(parent_dashboard_path)
    end
  end
end
