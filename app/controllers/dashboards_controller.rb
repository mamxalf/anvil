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
      redirect_to instructor_dashboard_path
    when "admin"
      # Admin stays on generic dashboard or goes to Avo
      render_admin_dashboard
    else
      redirect_to root_path, alert: "Unknown role"
    end
  end

  private

  def render_admin_dashboard
    authorize :dashboard

    render inertia: "Dashboard/Index", props: {
      user: current_user.as_json(only: [ :id, :name, :email, :role ])
    }
  end
end
