class Budget < ApplicationRecord 
    belongs_to :user 
    has_many :transactions

    validates_uniqueness_of :name, { :message => "already has an existing budget." }
    validates :expected_income, :savings_goal, :spending_goal, :start_date, :end_date, :presence => true 
end 