class CreateScheduledClasses < ActiveRecord::Migration[8.1]
  def change
    create_table :scheduled_classes, id: :uuid do |t|
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.references :instructor_profile, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :description
      t.datetime :scheduled_at, null: false
      t.integer :duration_minutes, default: 60, null: false
      t.string :meeting_url
      t.integer :max_participants

      t.timestamps
    end

    add_index :scheduled_classes, :scheduled_at
    add_index :scheduled_classes, [ :course_id, :scheduled_at ]
  end
end
