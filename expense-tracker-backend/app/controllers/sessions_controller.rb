class SessionsController < ApplicationController 
    def create
        user = User.find_or_create_by(:email => params[:email])

        render :json => user 
        # if user 
        #     render :json => user
        # end 
    end 

    def destroy 
    end
end 