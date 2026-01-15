require 'rails_helper'

RSpec.describe "Student::ScheduledClasses", type: :request do
  let!(:student) { create(:user) }
  let!(:instructor_user) { create(:user, :instructor) }
  let!(:course) { create(:course, instructor_user: instructor_user) }

  let!(:scheduled_class) do
    ScheduledClass.create!(
      course: course,
      instructor_profile: instructor_user.instructor_profile,
      title: "Live Session",
      scheduled_at: 1.day.from_now,
      duration_minutes: 60,
      description: "Live",
      max_participants: 20
    )
  end

  before { sign_in student, scope: :user }

  describe "GET /student/scheduled_classes" do
    it "returns success" do
      get student_scheduled_classes_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /student/scheduled_classes/:id" do
    it "returns success" do
      get student_scheduled_class_path(scheduled_class)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /student/scheduled_classes/:id/register" do
    it "registers for class" do
      expect {
        post register_student_scheduled_class_path(scheduled_class)
      }.to change(ClassRegistration, :count).by(1)
      expect(response).to redirect_to(student_scheduled_class_path(scheduled_class))
      expect(flash[:notice]).to eq("Successfully registered!")
    end
  end
end
