require 'rails_helper'

RSpec.describe "Student::Achievements", type: :request do
  let!(:student) { create(:user) }
  let!(:achievement) { create(:achievement) }

  before do
    sign_in student, scope: :user
  end

  describe "GET /student/achievements" do
    it "returns success" do
      get student_achievements_path
      expect(response).to have_http_status(:success)
    end
  end
end
