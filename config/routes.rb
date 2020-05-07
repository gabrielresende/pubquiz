Rails.application.routes.draw do
  root 'pages#temp_home'

  get '/me', to: 'users#me'
  patch '/me', to: 'users#update_me'

  # resources :questions
  # resources :categories
  resources :quizzes, path: '/admin/quizzes'
  
  resources :quizzes, only: [:show] do
    get 'play', on: :member
  end

  resources :users, path: '/admin/users'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
