require 'rails_helper'

RSpec.describe "Notifications (Instructor)", type: :request do
  let!(:instructor_user) { create(:user, :instructor) }
  let!(:notification) { create(:notification, user: instructor_user) }

  before { sign_in instructor_user, scope: :user }

  describe "GET /notifications" do
    it "returns success" do
      get notifications_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /notifications/:id/mark_as_read" do
    it "marks as read" do
      post mark_as_read_notification_path(notification)
      expect(response).to redirect_to(notifications_path)
      expect(notification.reload).to be_read
    end
  end
end
