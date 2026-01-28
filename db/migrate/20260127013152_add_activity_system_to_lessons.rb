class AddActivitySystemToLessons < ActiveRecord::Migration[8.1]
  def change
    # Add activity system to lessons
    add_column :lessons, :activity_type, :integer, default: 0, null: false
    add_column :lessons, :activity_config, :jsonb, default: {}

    # Create lesson_hints table
    create_table :lesson_hints, id: :uuid do |t|
      t.references :lesson, type: :uuid, null: false, foreign_key: true
      t.integer :tier, null: false
      t.text :content, null: false
      t.jsonb :trigger_config, default: {}

      t.timestamps
    end

    add_index :lesson_hints, [ :lesson_id, :tier ], unique: true

    # Create maze_attempts table
    create_table :maze_attempts, id: :uuid do |t|
      t.references :lesson, type: :uuid, null: false, foreign_key: true
      t.references :student_profile, type: :uuid, null: false, foreign_key: true

      t.integer :status, default: 0, null: false
      t.integer :blocks_used, default: 0, null: false
      t.integer :time_elapsed_seconds, default: 0, null: false
      t.integer :failed_runs, default: 0, null: false
      t.integer :stars_earned, default: 0, null: false

      t.datetime :completed_at

      t.timestamps

      t.index [ :lesson_id, :student_profile_id, :status ], name: 'index_maze_attempts_unique_active', where: "(status = 0)"
    end
  end
end
