class CreateTargetGroups < ActiveRecord::Migration[8.1]
  def change
    create_table :target_groups, id: :uuid do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.text :description
      t.decimal :min_energy, precision: 10, scale: 2, default: 0
      t.decimal :min_protein, precision: 10, scale: 2, default: 0
      t.decimal :min_fat, precision: 10, scale: 2, default: 0
      t.decimal :min_carbohydrate, precision: 10, scale: 2, default: 0
      t.decimal :min_fiber, precision: 10, scale: 2, default: 0
      t.decimal :min_vitamin_a, precision: 10, scale: 2, default: 0
      t.decimal :min_vitamin_b1, precision: 10, scale: 4, default: 0
      t.decimal :min_vitamin_b2, precision: 10, scale: 4, default: 0
      t.decimal :min_vitamin_b3, precision: 10, scale: 2, default: 0
      t.decimal :min_vitamin_b6, precision: 10, scale: 4, default: 0
      t.decimal :min_vitamin_b9, precision: 10, scale: 2, default: 0
      t.decimal :min_vitamin_b12, precision: 10, scale: 4, default: 0
      t.decimal :min_vitamin_c, precision: 10, scale: 2, default: 0
      t.decimal :min_vitamin_d, precision: 10, scale: 2, default: 0
      t.decimal :min_calcium, precision: 10, scale: 2, default: 0
      t.decimal :min_iron, precision: 10, scale: 2, default: 0
      t.decimal :min_zinc, precision: 10, scale: 2, default: 0
      t.decimal :min_iodine, precision: 10, scale: 2, default: 0
      t.decimal :min_selenium, precision: 10, scale: 2, default: 0
      t.integer :age_range_start
      t.integer :age_range_end

      t.timestamps
    end

    add_index :target_groups, :code, unique: true
  end
end
