class CreateQuizzes < ActiveRecord::Migration[8.1]
  def change
    create_table :quizzes, id: :uuid do |t|
      t.references :lesson, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :description
      t.integer :passing_score, default: 70, null: false
      t.integer :time_limit_minutes
      t.integer :max_attempts, default: 3
      t.integer :xp_reward, default: 25, null: false

      t.timestamps
    end
  end
end
