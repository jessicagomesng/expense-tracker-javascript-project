class CreateBudgets < ActiveRecord::Migration[6.0]
  def change
    create_table :budgets do |t|
      t.integer :user_id
      t.date :start_date
      t.date :end_date
      t.decimal :expected_income
      t.decimal :spending_goal
      t.decimal :savings_goal
    end
  end
end
