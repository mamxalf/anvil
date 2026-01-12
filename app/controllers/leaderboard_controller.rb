class LeaderboardController < ApplicationController
  def index
    @weekly_leaders = LeaderboardService.get_weekly_leaders
    @all_time_leaders = LeaderboardService.get_all_time_leaders
    @current_rank = current_user.student_profile ? LeaderboardService.get_student_rank(current_user.student_profile) : nil

    render inertia: "Leaderboard/Index", props: {
      weeklyLeaders: @weekly_leaders.as_json(include: { user: { only: [ :name, :avatar ] } }),
      allTimeLeaders: @all_time_leaders.as_json(include: { user: { only: [ :name, :avatar ] } }),
      currentRank: @current_rank
    }
  end
end
