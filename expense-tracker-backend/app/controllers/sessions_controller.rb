class SessionsController < ApplicationController 
    def create
        user = User.find_or_create_by(:email => params[:email])

        render :json => user 
    end 

    def destroy 
    end
end 