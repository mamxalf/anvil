require "test_helper"

class StudentProfileTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(email: "student-#{Time.now.to_f}@test.com", password: "password", role: :student, name: "Test Student")
    @profile = @user.student_profile
    @profile.update!(birth_date: 10.years.ago, grade_level: 5)
  end

  test "should be valid" do
    assert @profile.valid?
  end

  test "should require a user" do
    @profile.user = nil
    assert_not @profile.valid?
  end

  test "should have default values" do
    assert_equal 0, @profile.total_points
    assert_equal 0, @profile.current_streak
  end

  test "record_activity! should increment streak if active today" do
    # Simulate activity yesterday
    @profile.update!(last_activity_at: 1.day.ago)

    assert_difference -> { @profile.reload.current_streak }, 1 do
      @profile.record_activity!
    end

    assert @profile.last_activity_at > 1.minute.ago
  end

  test "record_activity! should reset streak if missed a day" do
    # Simulate activity 2 days ago
    @profile.update!(last_activity_at: 2.days.ago, current_streak: 5)

    @profile.record_activity!

    assert_equal 1, @profile.reload.current_streak
  end

  test "record_activity! should not increment if already active today" do
    # Simulate activity today
    @profile.update!(last_activity_at: Time.current, current_streak: 5)

    assert_no_difference -> { @profile.reload.current_streak } do
      @profile.record_activity!
    end
  end

  test "add_points should increase total points" do
    assert_difference -> { @profile.reload.total_points }, 50 do
      @profile.add_points(50)
    end
  end
end
