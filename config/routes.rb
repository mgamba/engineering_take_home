Rails.application.routes.draw do
  get "welcome/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  scope :format => true, :constraints => { :format => 'json' } do
    get "buildings/metadata", :format => /json/
    resources :buildings, only: [:index, :create, :update, :destroy, :show], :format => /json/
  end

  resources :sessions, only: [:create, :index]
  get "session" => "sessions#show"

  match "*path", to: "welcome#index", via: :all

  # Defines the root path route ("/")
  root "welcome#index"
end
