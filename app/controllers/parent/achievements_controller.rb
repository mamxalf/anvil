class Parent::AchievementsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_parent!

  def index
    @children = current_user.children.includes(student_profile: :achievements)
    @all_achievements = Achievement.all.order(xp_reward: :asc)

    children_data = @children.map do |child|
      profile = child.student_profile
      earned_ids = profile&.achievements&.pluck(:id) || []
      {
        id: child.id,
        name: child.name,
        avatar_url: child.avatar_url,
        earnedCount: earned_ids.size,
        totalXp: profile&.total_points || 0,
        level: profile&.level || 0,
        earnedIds: earned_ids
      }
    end

    render inertia: "Parent/Achievements/Index", props: {
      achievements: @all_achievements,
      children: children_data,
      totalAchievements: @all_achievements.size
    }
  end

  private

  def ensure_parent!
    unless current_user.parent?
      redirect_to root_path, alert: "Access denied. Parents only."
    end
  end
end
