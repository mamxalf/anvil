require 'rails_helper'

RSpec.describe "Student::Notifications", type: :request do
  let!(:student) { create(:user) }
  let!(:notification) { create(:notification, user: student) }

  before { sign_in student, scope: :user }

  describe "GET /student/notifications" do
    it "returns success" do
      get student_notifications_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /student/notifications/:id/mark_as_read" do
    it "marks as read" do
      post mark_as_read_student_notification_path(notification)
      expect(response).to redirect_to(student_notifications_path)
      expect(notification.reload).to be_read
    end
  end
end
