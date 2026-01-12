Rails.application.routes.draw do
  resources :scheduled_classes, only: [:index, :show] do
    member do
      post :register
    end
  end
  resources :notifications, only: [:index] do
    member do
      post :mark_as_read
    end
    collection do
      post :mark_all_as_read
    end
  end
  get "achievements", to: "achievements#index"
  get "leaderboard", to: "leaderboard#index"
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

  # Avo admin panel (only accessible to admins)
  authenticate :user, ->(u) { u.admin? } do
    mount_avo
  end

  # Course Resources
  resources :courses do
    member do
      get :curriculum
      get :learn
      post :enroll
    end
    resources :course_modules, only: [:create, :update, :destroy] do
      resources :lessons, only: [:create, :update, :destroy] do
        member do
          post :complete
        end
      end
    end
  end

  # Parent Resources
  namespace :parent do
    resources :children, only: [:index, :new, :create, :show]
  end

  # Dashboard routes (protected)
  get "/dashboard", to: "dashboards#index", as: :dashboard

  # Root route points to dashboard (redirects to login if not authenticated)
  root to: "dashboards#index"
end
