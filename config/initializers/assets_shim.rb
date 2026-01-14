# Shim for Avo Icons in a Vite-only environment (no sprockets/propshaft)
# Avo Icons expects Rails.application.config.assets to exist.
if !Rails.application.config.respond_to?(:assets)
  Rails.application.config.assets = ActiveSupport::OrderedOptions.new
  Rails.application.config.assets.paths = []
  Rails.application.config.assets.precompile = []
  Rails.application.config.assets.prefix = "/assets"
end

if !Rails.application.respond_to?(:assets_manifest)
  require "ostruct"
  
  Rails::Application.class_eval do
    def assets_manifest
      OpenStruct.new(assets: {})
    end
  end
end
