require "test_helper"

class AchievementsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "student-#{Time.now.to_f}@test.com", password: "password", role: :student, name: "Achiever")
    @profile = @user.student_profile
    sign_in @user, scope: :user

    @badge = Badge.create!(name: "First Login", icon: "login", criteria_type: :first_badge, criteria_value: 1, points_reward: 10)

    @achievement = Achievement.create!(
      title: "First Login",
      description: "Log in for the first time",
      criteria_type: :login_streak,
      criteria_value: 1,
      xp_reward: 10,
      badge: @badge
    )
  end

  test "should get index" do
    get achievements_path
    assert_response :success
    # assert_inertia_component "Achievements/Index"
  end
end
