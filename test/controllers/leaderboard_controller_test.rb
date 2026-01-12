require "test_helper"

class LeaderboardControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: "leader-#{Time.now.to_f}@test.com", password: "password", role: :student, name: "Leader User")
    @profile = @user.student_profile
    @profile.update!(total_points: 100)
    sign_in @user, scope: :user
  end

  test "should get index" do
    get leaderboard_path
    assert_response :success
    # assert_inertia_component "Leaderboard/Index"
  end
end
