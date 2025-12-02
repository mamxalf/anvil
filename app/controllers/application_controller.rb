# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include InertiaRails::Controller
  include Pundit::Authorization

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_sentry_context
  around_action :switch_locale

  # Pundit authorization
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # Share data to all Inertia pages
  inertia_share do
    {
      auth: {
        user: current_user&.as_json(only: [ :id, :name, :email, :role ])
      },
      flash: {
        success: flash[:success],
        error: flash[:error],
        notice: flash[:notice],
        alert: flash[:alert]
      },
      errors: session.delete(:errors) || {},
      locale: I18n.locale,
      translations: i18n_translations_for_namespaces(%w[auth dashboard common nav menus food_items institutions beneficiaries meal_distributions nutrition target_groups messages])
    }
  end

  # Add user_id to lograge
  def append_info_to_payload(payload)
    super
    payload[:user_id] = current_user&.id
    payload[:user_email] = current_user&.email if current_user
    payload[:request_id] = request.uuid
    payload[:host] = request.host
    payload[:remote_ip] = request.remote_ip
    payload[:ip] = request.ip
    payload[:x_forwarded_for] = request.headers["X-Forwarded-For"]
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :name ])
  end

  def switch_locale(&action)
    locale = params[:locale] || session[:locale] || I18n.default_locale
    locale = :en unless I18n.available_locales.include?(locale.to_sym)
    I18n.with_locale(locale, &action)
    session[:locale] = locale
  end

  def user_not_authorized
    flash[:alert] = I18n.t("pundit.not_authorized", default: "You are not authorized to perform this action.")
    redirect_to(request.referrer || root_path)
  end

  def set_sentry_context
    return unless defined?(Sentry)

    if user_signed_in?
      Sentry.set_user(
        id: current_user&.id,
        email: current_user&.email,
        username: current_user&.name
      )
    end
  end

  # Extract all translations for given namespaces
  # This recursively extracts all keys under the namespace
  def i18n_translations_for_namespaces(namespaces)
    result = {}
    namespaces.each do |namespace|
      result[namespace.to_sym] = extract_translations_for_namespace(namespace)
    end
    result
  end

  def extract_translations_for_namespace(namespace)
    translations = I18n.t(namespace, default: {})
    return {} unless translations.is_a?(Hash)

    # Recursively convert translations to a safe format for JSON
    deep_stringify_translations(translations)
  end

  def deep_stringify_translations(hash)
    return {} unless hash.is_a?(Hash)

    hash.each_with_object({}) do |(key, value), result|
      # Skip non-symbol/string keys
      next unless key.is_a?(Symbol) || key.is_a?(String)

      result[key.to_sym] = case value
      when Hash
        deep_stringify_translations(value)
      when String, Numeric, TrueClass, FalseClass, NilClass
        value
      else
        value.to_s
      end
    end
  end
end
