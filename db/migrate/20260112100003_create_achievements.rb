class CreateAchievements < ActiveRecord::Migration[8.1]
  def change
    create_table :achievements, id: :uuid do |t|
      t.string :title
      t.text :description
      t.string :icon_key
      t.integer :criteria_type
      t.integer :criteria_value
      t.integer :xp_reward
      t.references :badge, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
