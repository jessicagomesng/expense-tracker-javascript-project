class BudgetsController < ApplicationController 
    def index 
        user = User.find_by_id(params[:user_id])
        budgets = user.budgets
        render :json => budgets
    end 

    def create 
        budget = Budget.new(:user_id => params[:user_id])
        budget.expected_income = params[:expected_income]
        budget.spending_goal = params[:spending_goal]
        budget.savings_goal = params[:savings_goal]
        set_dates_and_name(params[:month], budget)
        budget.save

        render :json => budget
        # need update, delete
    end 

    private
    def set_dates_and_name(month, budget)

        budget.name = "#{month} #{Date.today.year}"

        case month
        when "January"
            budget.start_date = "#{Date.today.year}-01-01"
            budget.end_date = "#{Date.today.year}-01-31"
        when "February"
            budget.start_date = "#{Date.today.year}-02-01"
            budget.end_date = "#{Date.today.year}-02-28"
        when "March"
            budget.start_date = "#{Date.today.year}-03-01"
            budget.end_date = "#{Date.today.year}-03-31"
        when "April"
            budget.start_date = "#{Date.today.year}-04-01"
            budget.end_date = "#{Date.today.year}-04-30"
        when "May" 
            budget.start_date = "#{Date.today.year}-05-01"
            budget.end_date = "#{Date.today.year}-05-31"
        when "June"
            budget.start_date = "#{Date.today.year}-06-01"
            budget.end_date = "#{Date.today.year}-06-30"
        when "July"
            budget.start_date = "#{Date.today.year}-07-01"
            budget.end_date = "#{Date.today.year}-07-31"
        when "August"
            budget.start_date = "#{Date.today.year}-08-01"
            budget.end_date = "#{Date.today.year}-08-31"
        when "September"
            budget.start_date = "#{Date.today.year}-09-01"
            budget.end_date = "#{Date.today.year}-09-30"
        when "October"
            budget.start_date = "#{Date.today.year}-10-01"
            budget.end_date = "#{Date.today.year}-10-31"
        when "November"
            budget.start_date = "#{Date.today.year}-11-01"
            budget.end_date = "#{Date.today.year}-11-30"
        when "December"
            budget.start_date = "#{Date.today.year}-12-01"
            budget.end_date = "#{Date.today.year}-12-31"
        end 
    end 
end 