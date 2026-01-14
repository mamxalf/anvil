class Parent::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_parent!

  def index
    authorize :dashboard

    props = {
      user: current_user.as_json(only: [ :id, :name, :email, :role ]),
      children_profiles: current_user.children.includes(:student_profile).map do |child|
        profile = child.student_profile
        {
          id: child.id,
          name: child.name,
          level: profile&.level || 0,
          points: profile&.total_points || 0,
          avatar_url: child.avatar_url
        }
      end
    }

    render inertia: "Parent/Dashboard/Index", props: props
  end

  private

  def ensure_parent!
    unless current_user.parent?
      redirect_to root_path, alert: "Access denied. Parents only."
    end
  end
end
