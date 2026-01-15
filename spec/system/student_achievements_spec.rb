require 'rails_helper'

RSpec.describe "Student Achievements", type: :system do
  before do
    driven_by(:playwright)
  end

  let!(:student) { create(:user, role: 'student') }
  let!(:student_profile) { create(:student_profile, user: student, level: 5, total_points: 100) }
  let!(:achievement_earned) { create(:achievement, title: "Speed Demon", description: "Complete a lesson in 5 minutes", xp_reward: 50) }
  let!(:achievement_locked) { create(:achievement, title: "Master Coder", description: "Complete 10 courses", xp_reward: 500) }

  before do
    create(:user_achievement, student_profile: student_profile, achievement: achievement_earned)
  end

  context "Positive Scenarios" do
    before do
      sign_in student, scope: :user
      visit student_achievements_path
    end

    it "loads the achievements page successfully" do
      expect(page).to have_content("Achievements")
      expect(page).to have_content("Your Progress")
    end

    it "displays earned achievements" do
      expect(page).to have_content("Speed Demon")
      expect(page).to have_content("Complete a lesson in 5 minutes")
      # Earned achievements should be fully visible/colored
      # We can check for a specific class or check that it doesn't have a 'locked' class if applicable
      # For now, just content.
    end

    it "displays locked achievements" do
      expect(page).to have_content("Master Coder")
      expect(page).to have_content("Complete 10 courses")
      # Locked achievements might appear different
    end

    it "shows XP rewards" do
      expect(page).to have_content("50 XP")
      expect(page).to have_content("500 XP")
    end
  end

  context "Negative Scenarios" do
    it "redirects unauthenticated users to login" do
      visit student_achievements_path
      expect(current_path).to eq(new_user_session_path)
    end

    it "restricts access for parents" do
      parent = create(:user, :parent)
      sign_in parent, scope: :user
      visit student_achievements_path

      expect(current_path).to eq(parent_dashboard_path)
    end
  end
end
