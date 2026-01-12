class AchievementsController < ApplicationController
  def index
    @profile = current_user.student_profile
    return redirect_to root_path, alert: "Only students can view achievements" unless @profile
    
    @earned_achievement_ids = @profile.achievements.pluck(:id)
    @all_achievements = Achievement.all.order(xp_reward: :asc)
    
    render inertia: "Achievements/Index", props: {
      achievements: @all_achievements,
      earnedIds: @earned_achievement_ids,
      stats: {
        totalXp: @profile.total_points,
        streak: @profile.current_streak,
        level: @profile.level
      }
    }
  end
end
