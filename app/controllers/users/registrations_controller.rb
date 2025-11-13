class Users::RegistrationsController < Devise::RegistrationsController
  include InertiaRails::Controller

  def new
    if user_signed_in?
      redirect_to root_path
    else
      render inertia: "Auth/Register"
    end
  end

  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        redirect_to after_sign_up_path_for(resource), notice: I18n.t('devise.registrations.signed_up')
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        redirect_to after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      errors_hash = resource.errors.messages.to_h { |key, messages| [key, messages.first] }
      render inertia: "Auth/Register", props: {
        errors: errors_hash
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def after_sign_up_path_for(_resource)
    root_path
  end
end

