# frozen_string_literal: true

# Sentry will only initialize if SENTRY_DSN is set
if ENV["SENTRY_DSN"].present?
  Sentry.init do |config|
    # Sentry DSN from environment variable
    config.dsn = ENV["SENTRY_DSN"]

    # Set traces_sample_rate to capture transactions for performance monitoring
    # Adjust this value in production (0.0 to 1.0)
    config.traces_sample_rate = ENV.fetch("SENTRY_TRACES_SAMPLE_RATE", "0.1").to_f

    # Set profiles_sample_rate to profile sampled transactions
    config.profiles_sample_rate = ENV.fetch("SENTRY_PROFILES_SAMPLE_RATE", "0.1").to_f

    # Set environment
    config.environment = Rails.env

    # Breadcrumbs logging
    config.breadcrumbs_logger = [ :active_support_logger, :http_logger ]

    # Set release version (useful for tracking deployments)
    config.release = ENV["SENTRY_RELEASE"] if ENV["SENTRY_RELEASE"].present?

    # Filter sensitive data before sending
    config.before_send = lambda do |event, _hint|
      if event.request && event.request.data
        event.request.data = filter_sensitive_data(event.request.data)
      end
      event
    end

    # Only send errors in production and staging
    config.enabled_environments = %w[production staging]
  end
end

def filter_sensitive_data(data)
  sensitive_keys = %w[password password_confirmation token secret api_key]
  return data unless data.is_a?(Hash)

  data.transform_keys(&:to_s).transform_values do |value|
    if value.is_a?(Hash)
      filter_sensitive_data(value)
    elsif data.keys.any? { |key| sensitive_keys.include?(key.to_s) }
      "[FILTERED]"
    else
      value
    end
  end
end
