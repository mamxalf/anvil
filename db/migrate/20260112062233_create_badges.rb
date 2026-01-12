class CreateBadges < ActiveRecord::Migration[8.1]
  def change
    create_table :badges, id: :uuid do |t|
      t.string :name, null: false
      t.text :description
      t.string :icon
      t.integer :criteria_type, default: 0, null: false
      t.integer :criteria_value, default: 1, null: false
      t.integer :points_reward, default: 0, null: false
      t.integer :rarity, default: 0, null: false  # common, rare, epic, legendary

      t.timestamps
    end

    add_index :badges, :criteria_type
    add_index :badges, :rarity
  end
end
