class CreateStudentProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :student_profiles, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.date :birth_date
      t.string :grade_level
      t.integer :total_points, default: 0, null: false
      t.integer :current_streak, default: 0, null: false
      t.integer :longest_streak, default: 0, null: false
      t.integer :level, default: 1, null: false
      t.datetime :last_activity_at

      t.timestamps
    end
  end
end
