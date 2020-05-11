Rails.application.routes.draw do
  root 'pages#home'

  resources :quizzes do
    get 'play', on: :member
  end

  namespace :admin do
    resources :questions
    resources :categories
    resources :users
  end
end
