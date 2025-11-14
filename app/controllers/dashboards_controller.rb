class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize :dashboard
    render inertia: "Dashboard/Index", props: {
      user: current_user
    }
  end
end
