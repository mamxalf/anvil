require 'rails_helper'

RSpec.describe "Courses (Instructor)", type: :request do
  let!(:instructor_user) { create(:user, :instructor) }
  let!(:course) { create(:course, title: "Intro to Python", slug: "intro-to-python", instructor_user: instructor_user) }
  let!(:student) { create(:user) }

  describe "Instructor access" do
    before { sign_in instructor_user, scope: :user }

    describe "GET /courses" do
      it "returns success" do
        get courses_path
        expect(response).to have_http_status(:success)
      end
    end
    # ...
  end

  describe "Student access" do
    before { sign_in student, scope: :user }
    # ...

    it "redirects index to student area" do
      get courses_path
      expect(response).to redirect_to(student_notifications_path)
    end

    it "redirects show to student area" do
      get course_path(course.slug)
      expect(response).to redirect_to(student_notifications_path)
    end
  end
end
