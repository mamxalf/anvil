class Student::LeaderboardController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!

  def index
    @weekly_leaders = LeaderboardService.get_weekly_leaders
    @all_time_leaders = LeaderboardService.get_all_time_leaders
    @current_rank = LeaderboardService.get_student_rank(current_user.student_profile)

    render inertia: "Student/Leaderboard/Index", props: {
      weeklyLeaders: @weekly_leaders.as_json(include: { user: { only: [ :name, :avatar ] } }),
      allTimeLeaders: @all_time_leaders.as_json(include: { user: { only: [ :name, :avatar ] } }),
      currentRank: @current_rank
    }
  end

  private

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
