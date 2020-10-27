# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create(:username => "peetypeluso", :email => "greatestdogalive@peety.com")

budgets = Budget.create( [
    {
        :start_date => 
    }
])
events = Event.create([ 
    { 
        :producer_id => 2, 
        :location_id => 2, 
        :name => "Sunday in the Park with George", 
        :price => 200.25, 
        :start_date => DateTime.new(2021, 6, 27, 19, 30), 
        :end_date => DateTime.new(2021, 6, 27, 22, 30),
        :maximum_capacity => 1100 }, 
    { 
        :producer_id => 2, 
        :location_id => 2, 
        :name => "Miss Saigon", 
        :price => 150.00, 
        :start_date => DateTime.new(2021, 7, 8, 19, 30), 
        :end_date => DateTime.new(2021, 7, 8, 22, 30),
        :maximum_capacity => 1000,
        :minimum_age => 10 } 
])