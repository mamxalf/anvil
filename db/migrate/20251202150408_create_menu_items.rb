class CreateMenuItems < ActiveRecord::Migration[8.1]
  def change
    create_table :menu_items, id: :uuid do |t|
      t.references :menu, null: false, foreign_key: true, type: :uuid
      t.references :food_item, null: false, foreign_key: true, type: :uuid
      t.decimal :portion_size, precision: 10, scale: 2, null: false
      t.string :portion_unit, null: false, default: "gram"
      t.integer :meal_type, null: false, default: 0

      t.timestamps
    end

    add_index :menu_items, :meal_type
  end
end
