class Parent::LeaderboardController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_parent!

  def index
    @children = current_user.children.includes(:student_profile)
    @weekly_leaders = LeaderboardService.get_weekly_leaders
    @all_time_leaders = LeaderboardService.get_all_time_leaders

    children_ranks = @children.map do |child|
      profile = child.student_profile
      {
        id: child.id,
        name: child.name,
        avatar_url: child.avatar_url,
        rank: profile ? LeaderboardService.get_student_rank(profile) : nil,
        totalPoints: profile&.total_points || 0
      }
    end

    render inertia: "Parent/Leaderboard/Index", props: {
      weeklyLeaders: @weekly_leaders.as_json(include: { user: { only: [ :name, :avatar ] } }),
      allTimeLeaders: @all_time_leaders.as_json(include: { user: { only: [ :name, :avatar ] } }),
      childrenRanks: children_ranks
    }
  end

  private

  def ensure_parent!
    unless current_user.parent?
      redirect_to root_path, alert: "Access denied. Parents only."
    end
  end
end
