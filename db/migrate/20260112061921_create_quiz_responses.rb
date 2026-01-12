class CreateQuizResponses < ActiveRecord::Migration[8.1]
  def change
    create_table :quiz_responses, id: :uuid do |t|
      t.references :quiz_attempt, null: false, foreign_key: true, type: :uuid
      t.references :question, null: false, foreign_key: true, type: :uuid
      t.references :answer, foreign_key: true, type: :uuid  # Nullable for fill_in questions
      t.text :text_response  # For fill_in questions
      t.boolean :is_correct, default: false, null: false

      t.timestamps
    end

    add_index :quiz_responses, [ :quiz_attempt_id, :question_id ], unique: true
  end
end
