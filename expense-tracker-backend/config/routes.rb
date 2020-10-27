Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, only: :create do 
    resources :budgets do
      resources :transactions 
    end 
  end 

  # resources :budgets do 
  #   resources :transactions 
  # end
  post '/login', to: 'sessions#create'
  # resources :sessions, only: [:create, :destroy]

  # get login/logout to sessions controller 
end
