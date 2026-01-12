class CreateCourseEnrollments < ActiveRecord::Migration[8.1]
  def change
    create_table :course_enrollments, id: :uuid do |t|
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.references :enrolled_by, foreign_key: { to_table: :users }, type: :uuid  # parent or self
      t.integer :status, default: 0, null: false  # active, completed, expired, cancelled
      t.decimal :progress_percentage, precision: 5, scale: 2, default: 0.0
      t.datetime :trial_expires_at
      t.datetime :completed_at

      t.timestamps
    end

    add_index :course_enrollments, [ :student_profile_id, :course_id ], unique: true
    add_index :course_enrollments, :status
  end
end
