class TransactionsController < ApplicationController 
    def index 
        user = User.find_by_id(params[:user_id])
        budget = user.budgets.find_by_id(params[:budget_id])
        transactions = budget.transactions 
        render :json => transactions
    end 

    def create 
        transaction = Transaction.new(:budget_id => params[:budget_id])
        transaction.date = params[:date]
        transaction.price = params[:price]
        transaction.description = params[:description]
        if transaction.save 
            render :json => transaction 
        else 
            render :json => { errors: transaction.errors.full_messages }
        end 
    end 

    def update 
        transaction = Transaction.find_by_id(params[:id])
        if transaction.update(:price => params[:price], :description => params[:description])
            render :json => transaction
        else 
            render :json => { errors: transaction.errors.full_messages }
        end 
    end 

    def destroy 
        transaction = Transaction.find_by_id(params[:transaction_id]).destroy
        render :json => transaction
    end 

    # need update, delete
end 