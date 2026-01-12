class CreateCourses < ActiveRecord::Migration[8.1]
  def change
    create_table :courses, id: :uuid do |t|
      t.references :instructor, null: false, foreign_key: { to_table: :instructor_profiles }, type: :uuid
      t.string :title, null: false
      t.text :description
      t.integer :level, default: 0, null: false      # beginner, intermediate, advanced
      t.integer :subject, default: 0, null: false    # coding, robotics
      t.integer :status, default: 0, null: false     # draft, published, archived
      t.integer :enrollment_type, default: 0, null: false  # free, paid, subscription
      t.integer :trial_days, default: 0
      t.integer :min_age, default: 5
      t.integer :max_age, default: 16
      t.decimal :estimated_hours, precision: 5, scale: 2
      t.string :thumbnail
      t.string :slug

      t.timestamps
    end

    add_index :courses, :slug, unique: true
    add_index :courses, :status
    add_index :courses, :subject
    add_index :courses, :level
  end
end
