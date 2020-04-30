Rails.application.routes.draw do
  root 'pages#home'

  get '/me', to: 'users#me'
  patch '/me', to: 'users#update_me'

  resources :questions
  resources :categories
  resources :quizzes do
    get 'play', on: :member
    get 'players', on: :member
  end
  resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
