require 'rails_helper'

RSpec.describe "Student::Courses", type: :request do
  let!(:student) { create(:user) }
  let!(:course) { create(:course) }

  before { sign_in student, scope: :user }

  describe "GET /student/courses" do
    it "returns success" do
      get student_courses_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /student/courses/:id" do
    it "returns success" do
      get student_course_path(course.slug)
      expect(response).to have_http_status(:success)
    end
  end
end
