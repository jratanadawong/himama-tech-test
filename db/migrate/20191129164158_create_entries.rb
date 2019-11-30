class CreateEntries < ActiveRecord::Migration[6.0]
  def change
    create_table :entries do |t|
      t.string :clock_in
      t.string :clock_out
      t.date :date

      t.timestamps
    end
  end
end
