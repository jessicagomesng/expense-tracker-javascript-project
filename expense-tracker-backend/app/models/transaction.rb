class Transaction < ApplicationRecord 
    belongs_to :budget

    validates :date, :price, :description, :presence => true 
end 