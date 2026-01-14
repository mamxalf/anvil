class Instructor::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_instructor!

  def index
    profile = current_user.instructor_profile
    @courses = Course.where(instructor: profile).includes(:course_enrollments)

    render inertia: "Instructor/Courses/Index", props: {
      courses: @courses.map do |course|
        {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail.attached? ? url_for(course.thumbnail) : nil,
          status: course.status,
          enrolled_count: course.enrolled_count,
          updated_at: course.updated_at
        }
      end
    }
  end

  private

  def ensure_instructor!
    unless current_user.instructor? && current_user.instructor_profile
      redirect_to root_path, alert: "Access denied. Instructors only."
    end
  end
end
