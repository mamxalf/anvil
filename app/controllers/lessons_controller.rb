class LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_context
  before_action :set_lesson, only: [:update, :destroy]

  def create
    authorize @course, :update?
    @lesson = @module.lessons.build(lesson_params)
    @lesson.position = @module.lessons.count + 1
    
    if @lesson.save
      redirect_back fallback_location: curriculum_course_path(@course), notice: "Lesson created."
    else
      redirect_back fallback_location: curriculum_course_path(@course), alert: "Failed to create lesson: #{@lesson.errors.full_messages.join(', ')}"
    end
  end

  def update
    authorize @course, :update?
    if @lesson.update(lesson_params)
      redirect_back fallback_location: curriculum_course_path(@course), notice: "Lesson updated."
    else
      redirect_back fallback_location: curriculum_course_path(@course), alert: "Update failed."
    end
  end

  def complete
    authorize @course, :show? # Verify access

    # Record progress
    progress = current_user.student_profile.lesson_progresses.find_or_initialize_by(lesson: @lesson)
    
    if progress.new_record? || !progress.completed?
      progress.completed = true
      progress.completed_at = Time.current
      progress.xp_earned = @lesson.xp_reward || 10
      progress.save!
      
      # Award XP
      current_user.student_profile.increment!(:total_points, progress.xp_earned)
      # Check streaks (Logic can be in model callback)
      current_user.student_profile.update_streak!
    end

    # Find next lesson
    next_lesson = @module.lessons.where("position > ?", @lesson.position).order(:position).first
    if next_lesson.nil?
      next_module = @course.course_modules.where("position > ?", @module.position).order(:position).first
      next_lesson = next_module&.lessons&.order(:position)&.first
    end
    
    if next_lesson
      redirect_to learn_course_path(@course, lesson_id: next_lesson.id), notice: "Great job! +#{progress.xp_earned} XP"
    else
      redirect_to learn_course_path(@course), notice: "Course completed! You are amazing!"
    end
  end

  def destroy
    authorize @course, :update?
    @lesson.destroy
    redirect_back fallback_location: curriculum_course_path(@course), notice: "Lesson deleted."
  end

  private

  def set_context
    @course = Course.find(params[:course_id])
    @module = @course.course_modules.find(params[:course_module_id])
  end

  def set_lesson
    @lesson = @module.lessons.find(params[:id])
  end

  def lesson_params
    params.require(:lesson).permit(:title, :content, :video_url, :duration_minutes, :xp_reward, :free_preview)
  end
end
