# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_10_27_150018) do

  create_table "budgets", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.date "start_date"
    t.date "end_date"
    t.float "expected_income"
    t.float "spending_goal"
    t.float "savings_goal"
  end

  create_table "transactions", force: :cascade do |t|
    t.integer "budget_id"
    t.date "date"
    t.float "price"
    t.string "description"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
  end

end
