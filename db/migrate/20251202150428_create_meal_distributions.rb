class CreateMealDistributions < ActiveRecord::Migration[8.1]
  def change
    create_table :meal_distributions, id: :uuid do |t|
      t.references :institution, null: false, foreign_key: true, type: :uuid
      t.references :menu, null: false, foreign_key: true, type: :uuid
      t.date :distribution_date, null: false
      t.integer :recipient_count, null: false, default: 0
      t.text :notes
      t.references :distributed_by, null: false, foreign_key: { to_table: :users }, type: :uuid

      t.timestamps
    end

    add_index :meal_distributions, :distribution_date
    add_index :meal_distributions, [ :institution_id, :distribution_date ], name: "index_distributions_on_institution_and_date"
  end
end
