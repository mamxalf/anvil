require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# Initialize Sentry early
if defined?(Sentry)
  Sentry.init do |config|
    config.dsn = ENV["SENTRY_DSN"] if ENV["SENTRY_DSN"].present?
    config.enabled_environments = %w[production staging]
  end
end

module Anvil
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Configure UUID as primary key for all models
    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end

    # Configure i18n
    config.i18n.available_locales = [ :en, :id ]
    config.i18n.default_locale = :en
    config.i18n.fallbacks = true

    # Automatically load credentials into ENV variables
    # This makes credentials available as environment variables throughout the app
    # Only sets ENV if not already set (allows override via actual ENV)
    # Supports nested credentials: database: { username: "postgres" } -> ENV["DATABASE_USERNAME"]
    config.after_initialize do
      # Try environment-specific credentials first, then fall back to root level
      env_credentials = Rails.application.credentials[Rails.env.to_sym] || Rails.application.credentials

      if env_credentials.present?
        # Recursively flatten nested credentials into ENV variables
        flatten_credentials_to_env = lambda do |hash, prefix = nil|
          hash.each do |key, value|
            env_key = prefix ? "#{prefix}_#{key}".upcase : key.to_s.upcase

            if value.is_a?(Hash)
              # Recursively process nested hashes
              flatten_credentials_to_env.call(value, env_key)
            else
              # Set ENV variable (only if not already set)
              ENV[env_key] ||= value.to_s if value.present?
            end
          end
        end

        flatten_credentials_to_env.call(env_credentials)
      end
    end
  end
end
