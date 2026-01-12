class CreateLessons < ActiveRecord::Migration[8.1]
  def change
    create_table :lessons, id: :uuid do |t|
      t.references :course_module, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :content
      t.string :video_url
      t.integer :duration_minutes, default: 0
      t.integer :position, default: 0, null: false
      t.integer :xp_reward, default: 10, null: false

      t.timestamps
    end

    add_index :lessons, [:course_module_id, :position]
  end
end
