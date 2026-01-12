class CreateCourseModules < ActiveRecord::Migration[8.1]
  def change
    create_table :course_modules, id: :uuid do |t|
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :description
      t.integer :position, default: 0, null: false
      t.uuid :unlock_after_module_id  # Self-referential, nullable

      t.timestamps
    end

    add_index :course_modules, [:course_id, :position]
    add_foreign_key :course_modules, :course_modules, column: :unlock_after_module_id
  end
end
