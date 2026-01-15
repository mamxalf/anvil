class Student::MazeGameController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student_profile

  def complete
    points_awarded = 10

    # Award points
    current_user.student_profile.add_points(points_awarded)

    # Update activity streak
    current_user.student_profile.record_activity!

    # Check for achievements
    AchievementService.check_and_award(current_user.student_profile)

    render json: {
      success: true,
      points_earned: points_awarded,
      total_points: current_user.student_profile.total_points,
      level: current_user.student_profile.level
    }
  rescue => e
    render json: { success: false, error: e.message }, status: :unprocessable_entity
  end

  private

  def ensure_student_profile
    unless current_user.student_profile
      render json: { success: false, error: "Student profile not found" }, status: :forbidden
    end
  end
end
