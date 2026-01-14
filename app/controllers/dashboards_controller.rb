class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def index
    # Redirect to role-specific dashboard
    case current_user.role
    when "student"
      redirect_to student_dashboard_path
    when "parent"
      redirect_to parent_dashboard_path
    when "instructor"
      render_instructor_dashboard
    when "admin"
      # Admin stays on generic dashboard or goes to Avo
      render_admin_dashboard
    else
      redirect_to root_path, alert: "Unknown role"
    end
  end

  private

  def render_instructor_dashboard
    @courses = current_user.instructor_profile&.courses || []

    render inertia: "Dashboard/Index", props: {
      user: current_user.as_json(only: [ :id, :name, :email, :role ]),
      courses: @courses.map do |course|
        {
          id: course.id,
          title: course.title,
          status: course.status,
          enrollments_count: course.course_enrollments.count
        }
      end
    }
  end

  def render_admin_dashboard
    authorize :dashboard

    render inertia: "Dashboard/Index", props: {
      user: current_user.as_json(only: [ :id, :name, :email, :role ])
    }
  end
end
