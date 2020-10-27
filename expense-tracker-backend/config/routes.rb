Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, only: :create
  resources :budgets do 
    resources :transactions 
  end

  # get login/logout to sessions controller 
end
