require "test_helper"

class NotificationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "notify-#{Time.now.to_f}@test.com", password: "password", role: :student, name: "Notify User")
    sign_in @user, scope: :user

    @notification = Notification.create!(
      user: @user,
      title: "Welcome",
      message: "Welcome to Kodilearn",
      notification_type: :general
    )
  end

  test "should get index" do
    get notifications_path
    assert_response :success
    # assert_inertia_component "Notifications/Index"
  end

  test "should mark as read" do
    post mark_as_read_notification_path(@notification)
    assert_redirected_to notifications_path
    assert @notification.reload.read?
  end

  test "should mark all as read" do
    Notification.create!(user: @user, title: "Another", message: "Test", notification_type: :general)

    post mark_all_as_read_notifications_path
    assert_redirected_to notifications_path
    assert_equal 0, @user.notifications.unread.count
  end
end
