class Student::LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_context

  def complete
    authorize @course, :show?

    progress = current_user.student_profile.lesson_progresses.find_or_initialize_by(lesson: @lesson)

    if progress.new_record? || !progress.completed?

      progress.completed_at = Time.current
      progress.xp_earned = @lesson.xp_reward || 10
      progress.save!

      current_user.student_profile.increment!(:total_points, progress.xp_earned)
      current_user.student_profile.record_activity!
    end

    next_lesson = @module.lessons.where("position > ?", @lesson.position).order(:position).first
    if next_lesson.nil?
      next_module = @course.course_modules.where("position > ?", @module.position).order(:position).first
      next_lesson = next_module&.lessons&.order(:position)&.first
    end

    if next_lesson
      redirect_to learn_student_course_path(@course, lesson_id: next_lesson.id), notice: "Great job! +#{progress.xp_earned} XP"
    else
      redirect_to learn_student_course_path(@course, done: true), notice: "Course completed! You are amazing!"
    end
  end

  private

  def set_context
    @course = Course.find(params[:course_id])
    @module = @course.course_modules.find(params[:course_module_id])
    @lesson = @module.lessons.find(params[:id])
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
