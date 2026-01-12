class CreateLessonProgresses < ActiveRecord::Migration[8.1]
  def change
    create_table :lesson_progresses, id: :uuid do |t|
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.references :lesson, null: false, foreign_key: true, type: :uuid
      t.datetime :started_at
      t.datetime :completed_at
      t.decimal :video_watch_percentage, precision: 5, scale: 2, default: 0.0
      t.integer :xp_earned, default: 0, null: false

      t.timestamps
    end

    add_index :lesson_progresses, [:student_profile_id, :lesson_id], unique: true
  end
end
