class SessionsController < ApplicationController 
    def create
        user = User.find_by(:email => params[:email])

        if user && user.authenticate(params[:password])
            render :json => user, :only => [:id, :email]
        else 
            render :json => { errors: "Something went wrong. Please try again." }
        end 
    end 
end 