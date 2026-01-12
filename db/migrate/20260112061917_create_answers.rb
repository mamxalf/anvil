class CreateAnswers < ActiveRecord::Migration[8.1]
  def change
    create_table :answers, id: :uuid do |t|
      t.references :question, null: false, foreign_key: true, type: :uuid
      t.text :content, null: false
      t.boolean :is_correct, default: false, null: false
      t.integer :position, default: 0, null: false

      t.timestamps
    end

    add_index :answers, [ :question_id, :position ]
  end
end
