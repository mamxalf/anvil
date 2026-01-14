class AchievementService
  # Call this after XP is awarded or activity is recorded.
  # It checks all achievements the student has not yet earned.
  def self.check_and_award(student_profile)
    earned_achievement_ids = student_profile.user_achievements.pluck(:achievement_id)

    Achievement.where.not(id: earned_achievement_ids).find_each do |achievement|
      if meets_criteria?(student_profile, achievement)
        award_achievement(student_profile, achievement)
      end
    end
  end

  private

  def self.meets_criteria?(student_profile, achievement)
    case achievement.criteria_type
    when "total_xp"
      student_profile.total_points >= achievement.criteria_value
    when "courses_completed"
      student_profile.course_enrollments.where(status: :completed).count >= achievement.criteria_value
    when "login_streak"
      student_profile.current_streak >= achievement.criteria_value
    when "quizzes_passed"
      student_profile.quiz_attempts.where("score >= passing_score").count >= achievement.criteria_value
    when "perfect_quiz_scores"
      student_profile.quiz_attempts.where("score = 100").count >= achievement.criteria_value
    else
      false
    end
  end

  def self.award_achievement(student_profile, achievement)
    UserAchievement.create!(student_profile: student_profile, achievement: achievement)

    # Award bonus XP from the achievement
    if achievement.xp_reward.to_i > 0
      student_profile.increment!(:total_points, achievement.xp_reward)
    end

    # Send notification
    Notification.create!(
      user: student_profile.user,
      notification_type: :achievement,
      title: "Achievement Unlocked!",
      message: "You earned: #{achievement.title}",
      data: { achievement_id: achievement.id }
    )
  rescue ActiveRecord::RecordInvalid => e
    # Already earned or other validation failed, skip
    Rails.logger.warn("AchievementService: Could not award achievement #{achievement.id} to #{student_profile.id}: #{e.message}")
  end
end
