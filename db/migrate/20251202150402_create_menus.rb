class CreateMenus < ActiveRecord::Migration[8.1]
  def change
    create_table :menus, id: :uuid do |t|
      t.string :name, null: false
      t.text :description
      t.references :target_group, null: false, foreign_key: true, type: :uuid
      t.integer :status, null: false, default: 0
      t.decimal :total_energy, precision: 10, scale: 2, default: 0
      t.decimal :total_protein, precision: 10, scale: 2, default: 0
      t.decimal :total_fat, precision: 10, scale: 2, default: 0
      t.decimal :total_carbohydrate, precision: 10, scale: 2, default: 0
      t.decimal :total_fiber, precision: 10, scale: 2, default: 0
      t.references :created_by, null: false, foreign_key: { to_table: :users }, type: :uuid
      t.integer :day_number, default: 1

      t.timestamps
    end

    add_index :menus, :status
    add_index :menus, :day_number
  end
end
