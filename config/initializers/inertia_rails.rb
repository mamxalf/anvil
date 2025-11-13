# config/initializers/inertia_rails.rb
InertiaRails.configure do |config|
  # Inertia version (for cache busting)
  config.version = ViteRuby.digest

  # Set default layout
  config.layout = "application"
end
