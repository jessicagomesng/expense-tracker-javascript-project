class SessionsController < ApplicationController 
    def create
        user = User.find_by(:email => params[:email])

        if user && user.username == params[:username]
            render :json => user
        else 
        end 
    end 

    def destroy 
    end
end 