class CreateFoodItems < ActiveRecord::Migration[8.1]
  def change
    create_table :food_items, id: :uuid do |t|
      t.string :name, null: false
      t.string :code
      t.integer :category, null: false, default: 0
      t.text :description
      t.decimal :energy_per_100g, precision: 10, scale: 2, default: 0
      t.decimal :protein_per_100g, precision: 10, scale: 2, default: 0
      t.decimal :fat_per_100g, precision: 10, scale: 2, default: 0
      t.decimal :carbohydrate_per_100g, precision: 10, scale: 2, default: 0
      t.decimal :fiber_per_100g, precision: 10, scale: 2, default: 0
      t.decimal :portion_size, precision: 10, scale: 2, default: 100
      t.string :portion_unit, default: "gram"
      t.string :urt_description

      t.timestamps
    end

    add_index :food_items, :code, unique: true
    add_index :food_items, :category
  end
end
