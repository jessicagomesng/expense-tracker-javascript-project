class UsersController < ApplicationController 
    def create 
        user = User.new(:email => params[:email], :password => params[:password], :password_confirmation => params[:password_confirmation])

        if user.save 
            render :json => user, only: [:id, :email]
        else 
            render :json => { errors: user.errors.full_messages }
        end 
    end 
end 