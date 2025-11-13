# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include InertiaRails::Controller

  # Share data to all Inertia pages
  inertia_share do
    {
      auth: {
        user: current_user&.as_json(only: [ :id, :name, :email ])
      },
      flash: {
        success: flash[:success],
        error: flash[:error],
        notice: flash[:notice],
        alert: flash[:alert]
      },
      errors: session.delete(:errors) || {}
    }
  end

  # Helper for current user (implement later with auth)
  def current_user
    nil # TODO: Implement authentication
  end
end
