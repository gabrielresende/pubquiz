Rails.application.routes.draw do
  root 'pages#home'

  get '/me', to: 'users#me'
  patch '/me', to: 'users#update_me'

  resources :quizzes do
    get 'play', on: :member
  end
  
  scope '/admin' do
    resources :questions
    resources :categories
    resources :users
  end
end
