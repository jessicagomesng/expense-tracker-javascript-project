class CreateBudgets < ActiveRecord::Migration[6.0]
  def change
    create_table :budgets do |t|
      t.integer :user_id
      t.string :name
      t.date :start_date
      t.date :end_date
      t.float :expected_income
      t.float :spending_goal
      t.float :savings_goal
    end
  end
end
