class Transaction < ApplicationRecord 
    belongs_to :budget

    # write validation -- it has to belong to the month of the budget
end 