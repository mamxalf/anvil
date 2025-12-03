Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Devise routes with custom controllers
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions"
  }

  # Avo admin panel (authentication handled in avo.rb initializer)
  mount Avo::Engine, at: Avo.configuration.root_path

  # Dashboard routes (protected)
  get "/dashboard", to: "dashboards#index", as: :dashboard

  # MBG Resources (for dietitians and admins)
  get "/nutrition_profiles", to: "nutrition_profiles#index", as: :nutrition_profiles
  resources :target_groups, only: [ :index, :show ] do
    member do
      patch :nutrition_profiles, to: "target_groups#update_nutrition_profiles"
      delete :nutrition_profile, to: "target_groups#destroy_nutrition_profile"
    end
  end
  resources :food_items
  resources :menus do
    member do
      patch :publish
      patch :archive
    end
  end
  resources :institutions
  resources :beneficiaries
  resources :meal_distributions

  # Menu Items (nested under menus)
  resources :menus do
    resources :menu_items, only: [ :create, :update, :destroy ]
  end

  # Locale switching
  get "/locale/:locale", to: "locales#switch", as: :switch_locale

  # Root route points to dashboard (redirects to login if not authenticated)
  root to: "dashboards#index"
end
