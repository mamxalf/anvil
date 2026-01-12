# config/initializers/lograge.rb
Rails.application.configure do
  # Enable lograge
  config.lograge.enabled = true

  # Use JSON format (best for log aggregation tools)
  config.lograge.formatter = Lograge::Formatters::Json.new

  # Add custom data to logs
  config.lograge.custom_options = lambda do |event|
    {
      time: event.time,
      host: event.payload[:host],
      remote_ip: event.payload[:remote_ip],
      ip: event.payload[:ip],
      x_forwarded_for: event.payload[:x_forwarded_for],
      params: event.payload[:params]&.except("controller", "action", "format", "utf8", "authenticity_token"),
      user_id: event.payload[:user_id],
      request_id: event.payload[:request_id]
    }
  end

  # Keep original Rails.logger behavior for other logs
  config.lograge.keep_original_rails_log = false

  # Log to STDOUT (12-factor app best practice)
  config.lograge.logger = ActiveSupport::Logger.new($stdout)

  # Ignore certain requests (optional)
  config.lograge.ignore_actions = [ "HealthController#index" ]

  # Ignore requests by custom logic
  config.lograge.ignore_custom = lambda do |event|
    # Ignore asset requests
    event.payload[:path] =~ /^\/assets\//
  end
end
