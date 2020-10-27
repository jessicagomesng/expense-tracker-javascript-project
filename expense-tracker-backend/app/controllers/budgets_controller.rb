class BudgetsController < ApplicationController 
    def index 
        user = User.find_by_id(params[:user_id])
        budgets = user.budgets
        render :json => budgets
    end 

    def create 
        binding.pry 
    end 
end 