class Student::AchievementsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!

  def index
    @profile = current_user.student_profile
    @earned_achievement_ids = @profile.achievements.pluck(:id)
    @all_achievements = Achievement.all.order(xp_reward: :asc)

    render inertia: "Student/Achievements/Index", props: {
      achievements: @all_achievements,
      earnedIds: @earned_achievement_ids,
      stats: {
        totalXp: @profile.total_points,
        streak: @profile.current_streak,
        level: @profile.level
      }
    }
  end

  private

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
