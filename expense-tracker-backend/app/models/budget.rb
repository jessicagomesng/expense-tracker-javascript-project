class Budget < ApplicationRecord 
    belongs_to :user 
    has_many :transactions

    validates_uniqueness_of :name, { :message => "already has an existing budget." }
end 