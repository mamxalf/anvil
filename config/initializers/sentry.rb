# frozen_string_literal: true

Sentry.init do |config|
  config.dsn = ENV["SENTRY_DSN"] if ENV["SENTRY_DSN"].present?
  config.enabled_environments = %w[production staging]
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  # Set traces_sample_rate to capture performance data
  # Adjust this value in production as needed
  config.traces_sample_rate = 1.0

  # Skip assets paths to avoid unnecessary noise
  config.excluded_exceptions += ["ActionController::RoutingError"]
end
