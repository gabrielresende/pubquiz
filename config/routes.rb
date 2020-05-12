Rails.application.routes.draw do
  root 'pages#home'

  resources :quizzes, only: [:create, :destroy, :show] do
    get 'play', on: :member
  end

  namespace :admin do
    resources :questions
    resources :quizzes
    resources :categories
    resources :users
  end
end
