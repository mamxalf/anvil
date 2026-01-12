class CreateQuestions < ActiveRecord::Migration[8.1]
  def change
    create_table :questions, id: :uuid do |t|
      t.references :quiz, null: false, foreign_key: true, type: :uuid
      t.text :content, null: false
      t.integer :question_type, default: 0, null: false  # multiple_choice, true_false, fill_in
      t.integer :points, default: 10, null: false
      t.integer :position, default: 0, null: false
      t.text :hint

      t.timestamps
    end

    add_index :questions, [:quiz_id, :position]
  end
end
