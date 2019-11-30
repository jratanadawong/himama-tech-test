Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'authenticate', to: 'authentication#authenticate'
      resources :users
      post '/entries/all', to: 'entries#all'
      resources :entries
    end
   end
   
   root 'landing#index'
   get '/*path', to: 'landing#index' 
end
