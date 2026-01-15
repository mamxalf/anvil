require 'rails_helper'

RSpec.describe "Student::Leaderboard", type: :request do
  let!(:student) { create(:user) }

  before do
    student.student_profile.update!(total_points: 100)
    sign_in student, scope: :user
  end

  describe "GET /student/leaderboard" do
    it "returns success" do
      get student_leaderboard_path
      expect(response).to have_http_status(:success)
    end
  end
end
