class User < ApplicationRecord 
    has_many :budgets
    has_many :transactions, through: :budgets

    validates :email, :password, :presence => true 
    validates :password, confirmation: { case_sensitive: true }
    validates :email, :uniqueness => true 

    has_secure_password 
end 