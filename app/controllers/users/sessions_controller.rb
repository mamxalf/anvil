class Users::SessionsController < Devise::SessionsController
  include InertiaRails::Controller

  def new
    if user_signed_in?
      redirect_to root_path
    else
      render inertia: "Auth/Login"
    end
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in) if is_flashing_format?
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  rescue => e
    clean_up_passwords resource
    render inertia: "Auth/Login", props: {
      errors: { email: I18n.t("devise.failure.invalid") }
    }, status: :unprocessable_entity
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    respond_to_on_destroy
  end

  private

  def respond_to_on_destroy
    redirect_to new_user_session_path
  end

  def after_sign_in_path_for(_resource)
    root_path
  end
end
