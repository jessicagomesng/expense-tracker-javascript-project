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
        :name => "October 2020",
        :start_date => "2020-10-01",
        :end_date => "2020-10-31",
        :expected_income => 100.00,
        :spending_goal => 60.00,
        :savings_goal => 40.00
    },
    {
        :name => "September 2020",
        :start_date => "2020-09-01",
        :end_date => "2020-09-30",
        :expected_income => 100.00,
        :spending_goal => 60.00,
        :savings_goal => 40.00
    },
])

user.budgets << budgets 