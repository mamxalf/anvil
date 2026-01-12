class CreateContentRestrictions < ActiveRecord::Migration[8.1]
  def change
    create_table :content_restrictions, id: :uuid do |t|
      t.references :parent_child, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.integer :max_course_level, default: 2  # 0=beginner, 1=intermediate, 2=advanced (no restriction)
      t.string :allowed_subjects, array: true, default: ["coding", "robotics"]
      t.boolean :require_approval_for_enrollment, default: false, null: false

      t.timestamps
    end
  end
end
