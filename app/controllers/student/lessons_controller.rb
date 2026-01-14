class Student::LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_context

  def complete
    authorize @course, :show?

    # Delegate to model method - it handles duplicate completion checks internally
    # Returns XP earned (0 if already completed)
    xp_earned = @lesson.complete!(current_user.student_profile)

    # Check for new achievements only if XP was earned (means lesson was newly completed)
    AchievementService.check_and_award(current_user.student_profile) if xp_earned.positive?

    next_lesson = @module.lessons.where("position > ?", @lesson.position).order(:position).first
    if next_lesson.nil?
      next_module = @course.course_modules.where("position > ?", @module.position).order(:position).first
      next_lesson = next_module&.lessons&.order(:position)&.first
    end

    if next_lesson
      redirect_to learn_student_course_path(@course, lesson_id: next_lesson.id), notice: "Great job! +#{xp_earned} XP"
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
