class LocalesController < ApplicationController
  def switch
    locale = params[:locale]
    if I18n.available_locales.include?(locale.to_sym)
      session[:locale] = locale
    end
    redirect_back(fallback_location: root_path)
  end
end

