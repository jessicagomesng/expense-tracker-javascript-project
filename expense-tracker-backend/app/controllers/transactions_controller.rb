class TransactionsController < ApplicationController 
    def index 
        user = User.find_by_id(params[:user_id])
        budget = user.budgets.find_by_id(params[:budget_id])
        transactions = budget.transactions 
        render :json => transactions
    end 

    def create 
    end 

    # need update, delete
end 