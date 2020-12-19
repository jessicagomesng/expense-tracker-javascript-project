class AddStarredToBudgets < ActiveRecord::Migration[6.0]
  def change
    add_column :budgets, :starred, :boolean, :default => false 
  end
end
