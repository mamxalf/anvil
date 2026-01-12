class EnrollmentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course

  def create
    authorize @course, :enroll?

    # Check if already enrolled
    if @course.course_enrollments.exists?(student_profile: current_user.student_profile)
      redirect_to learn_course_path(@course), notice: "You are already enrolled."
      return
    end

    # Create enrollment
    enrollment = @course.course_enrollments.build(student_profile: current_user.student_profile)

    if @course.paid?
      # Logic for payment would go here. For now, auto-enroll or redirect to payment.
      # Assuming free/beta for now:
      enrollment.save!
      redirect_to learn_course_path(@course), notice: "Welcome to the course! Let's start learning."
    else
      enrollment.save!
      redirect_to learn_course_path(@course), notice: "Successfully enrolled (Free)."
    end
  rescue Pundit::NotAuthorizedError
    redirect_to course_path(@course), alert: "You are not authorized to enroll in this course."
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  end
end
