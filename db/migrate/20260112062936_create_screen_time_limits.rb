class CreateScreenTimeLimits < ActiveRecord::Migration[8.1]
  def change
    create_table :screen_time_limits, id: :uuid do |t|
      t.references :parent_child, null: false, foreign_key: true, type: :uuid
      t.integer :day_of_week, null: false  # 0=Sunday, 1=Monday, etc.
      t.integer :max_minutes, default: 60, null: false
      t.boolean :enabled, default: true, null: false

      t.timestamps
    end

    add_index :screen_time_limits, [:parent_child_id, :day_of_week], unique: true
  end
end
