class CreateQuizAttempts < ActiveRecord::Migration[8.1]
  def change
    create_table :quiz_attempts, id: :uuid do |t|
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.references :quiz, null: false, foreign_key: true, type: :uuid
      t.datetime :started_at, null: false
      t.datetime :completed_at
      t.integer :score, default: 0, null: false
      t.boolean :passed, default: false, null: false
      t.integer :xp_earned, default: 0, null: false

      t.timestamps
    end

    add_index :quiz_attempts, [ :student_profile_id, :quiz_id ]
  end
end
