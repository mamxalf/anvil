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
  # API Namespace Routes
  # ============================================
  namespace :api do
    post "arduino/compile", to: "arduino_compiler#compile"

    resources :maze_attempts, only: [ :create, :show, :update ] do
      member do
        post :complete
        post :sync
      end

      collection do
        get :active
      end
    end

    resources :lessons, only: [] do
      resources :hints, only: [ :index ], controller: "lesson_hints"
    end
  end

  # ============================================
  # Student Namespace Routes
  # ============================================
  namespace :student do
    get "dashboard", to: "dashboards#index", as: :dashboard
    resources :courses, only: [ :index, :show ] do
      member do
        get :curriculum
        get :learn
        post :enroll
      end
      resources :course_modules, only: [] do
        resources :lessons, only: [] do
          member do
            post :complete
          end
        end
      end
    end
    resources :achievements, only: [ :index ]
    get "leaderboard", to: "leaderboard#index", as: :leaderboard
    get "playground", to: "playground#index", as: :playground
    get "playground/maze", to: "playground#maze", as: :playground_maze
    get "playground/platformer", to: "playground#platformer", as: :playground_platformer
    post "maze_game/complete", to: "maze_game#complete"
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

    # Quiz routes
    resources :quizzes, only: [] do
      resources :quiz_attempts, only: [ :create ]
    end
    resources :quiz_attempts, only: [ :show ] do
      member do
        post :submit_answer
        post :complete
      end
    end

    # Certificate routes
    resources :enrollments, only: [] do
      resource :certificate, only: [ :show ]
    end

    # Portfolio routes
    resources :portfolios do
      resources :assets, controller: "portfolio_assets", only: [ :create, :destroy ]
    end

    # AI Lab
    get "ai_lab", to: "ai_lab#index", as: :ai_lab

    # Arduino Playground (under playground namespace)
    get "playground/arduino", to: "arduino_playground#index", as: :playground_arduino
    resources :arduino_sketches, only: [ :index, :show, :create, :update, :destroy ] do
      member do
        post :publish
        post :unpublish
      end
    end
    resources :community, only: [ :index, :show ]
  end

  # ============================================
  # Public Portfolio Route
  # ============================================
  get "p/:slug", to: "public_portfolios#show", as: :public_portfolio


  # ============================================
  # Parent Namespace Routes
  # ============================================
  namespace :parent do
    get "dashboard", to: "dashboards#index", as: :dashboard
    resources :courses, only: [ :index, :show ] do
      member do
        get :curriculum
      end
    end
    resources :achievements, only: [ :index ]
    get "leaderboard", to: "leaderboard#index", as: :leaderboard
    resources :children, only: [ :index, :new, :create, :show ]
    resources :scheduled_classes, only: [ :index, :show ]
    resources :notifications, only: [ :index ] do
      member do
        post :mark_as_read
      end
      collection do
        post :mark_all_as_read
      end
    end
  end

  # ============================================
  # Primary Resources (Admin/Instructor)
  # ============================================
  resources :courses do
    member do
      get :curriculum
      get :learn
      post :enroll
    end
    resources :course_modules do
      resources :lessons do
        member do
          post :complete
        end
      end
    end
  end

  resources :scheduled_classes do
    member do
      post :register
    end
  end

  resources :notifications do
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
