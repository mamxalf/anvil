class CreateClassRegistrations < ActiveRecord::Migration[8.1]
  def change
    create_table :class_registrations, id: :uuid do |t|
      t.references :scheduled_class, null: false, foreign_key: true, type: :uuid
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.boolean :attended, default: false, null: false
      t.boolean :reminder_sent, default: false, null: false

      t.timestamps
    end

    add_index :class_registrations, [ :scheduled_class_id, :student_profile_id ], unique: true, name: "idx_class_registrations_unique"
  end
end
