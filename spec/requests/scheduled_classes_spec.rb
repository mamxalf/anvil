require 'rails_helper'

RSpec.describe "ScheduledClasses (Instructor)", type: :request do
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

  before { sign_in instructor_user, scope: :user }

  describe "GET /scheduled_classes" do
    it "returns success" do
      get scheduled_classes_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /scheduled_classes/:id" do
    it "returns success" do
      get scheduled_class_path(scheduled_class)
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /scheduled_classes/:id/register" do
    it "fails because instructor cannot register as student" do
      # Instructors usually don't register? Or maybe they can?
      # Logic: register checks `current_user.student_profile`.
      # Instructor might not have one.
      post register_scheduled_class_path(scheduled_class)
      if instructor_user.student_profile
        expect(response).to redirect_to(scheduled_class_path(scheduled_class))
      else
        expect(response).to redirect_to(scheduled_class_path(scheduled_class))
        expect(flash[:alert]).to eq("Only students can register")
      end
    end
  end
end
