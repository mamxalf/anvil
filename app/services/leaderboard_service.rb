class LeaderboardService
  def self.get_weekly_leaders(limit: 10)
    # Define week start (e.g., Monday)
    start_of_week = Time.current.beginning_of_week
    
    # Calculate points earned this week
    # This assumes we have a way to track points history.
    # Currently StudentProfile has total_points.
    # If we need weekly points, we might need a PointTransaction model.
    # For now, let's just return total points as a proxy or use LessonProgress.
    
    # Alternative: Use LessonProgress#updated_at to approximate activity, 
    # but calculating exact points from that is tricky if points vary.
    
    # Let's fallback to "Most Active Students (by lessons completed this week)"
    StudentProfile.joins(:lesson_progresses)
                  .where("lesson_progresses.completed_at >= ?", start_of_week)
                  .group(:id)
                  .select("student_profiles.*, COUNT(lesson_progresses.id) as weekly_lessons")
                  .order("weekly_lessons DESC")
                  .limit(limit)
  end

  def self.get_all_time_leaders(limit: 10)
    StudentProfile.includes(:user)
                  .order(total_points: :desc)
                  .limit(limit)
  end

  def self.get_student_rank(student_profile)
    # Count how many students have more points
    rank = StudentProfile.where("total_points > ?", student_profile.total_points).count + 1
    rank
  end
end
