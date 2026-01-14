Rails.application.routes.draw do
  # Devise routes with custom controllers
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions"
  }

  # Avo admin panel (only accessible to admins)
  authenticate :user, ->(u) { u.admin? } do
    mount_avo
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # ============================================
  # Student Namespace Routes
  # ============================================
  namespace :student do
    get "dashboard", to: "dashboards#index", as: :dashboard
    resources :courses, only: [ :index ]
    resources :achievements, only: [ :index ]
    get "leaderboard", to: "leaderboard#index", as: :leaderboard
  end

  # ============================================
  # Parent Namespace Routes
  # ============================================
  namespace :parent do
    get "dashboard", to: "dashboards#index", as: :dashboard
    resources :courses, only: [ :index ]
    resources :achievements, only: [ :index ]
    get "leaderboard", to: "leaderboard#index", as: :leaderboard
    resources :children, only: [ :index, :new, :create, :show ]
  end

  # ============================================
  # Instructor Namespace Routes
  # ============================================
  namespace :instructor do
    get "dashboard", to: "dashboards#index", as: :dashboard
    resources :courses, only: [ :index ]
  end

  # ============================================
  # Shared Resources (Course detail, enroll, learn)
  # ============================================
  resources :courses, only: [ :show, :new, :create, :edit, :update ] do
    member do
      get :curriculum
      get :learn
      post :enroll
    end
    resources :course_modules, only: [ :create, :update, :destroy ] do
      resources :lessons, only: [ :create, :update, :destroy ] do
        member do
          post :complete
        end
      end
    end
  end

  # ============================================
  # Other Shared Resources
  # ============================================
  resources :scheduled_classes, only: [ :index, :show ] do
    member do
      post :register
    end
  end

  resources :notifications, only: [ :index ] do
    member do
      post :mark_as_read
    end
    collection do
      post :mark_all_as_read
    end
  end

  # ============================================
  # Dashboard Redirect (Legacy support)
  # ============================================
  get "/dashboard", to: "dashboards#index", as: :dashboard

  # Root route - redirects based on user role
  root to: "dashboards#index"
end
