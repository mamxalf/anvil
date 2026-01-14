class Instructor::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_instructor!

  def index
    authorize :dashboard

    profile = current_user.instructor_profile

    props = {
      user: current_user.as_json(only: [ :id, :name, :email, :role ]),
      instructorProfile: profile.as_json(only: [ :bio, :expertise ]),
      courses: Course.where(instructor: profile).includes(:course_enrollments).map do |course|
        {
          id: course.id,
          title: course.title,
          status: course.status,
          enrolled_count: course.enrolled_count
        }
      end
    }

    render inertia: "Instructor/Dashboard/Index", props: props
  end

  private

  def ensure_instructor!
    unless current_user.instructor? && current_user.instructor_profile
      redirect_to root_path, alert: "Access denied. Instructors only."
    end
  end
end
