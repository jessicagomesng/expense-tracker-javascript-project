class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions do |t|
      t.integer :budget_id
      t.date :date
      t.decimal :price
      t.string :description
    end
  end
end
