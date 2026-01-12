class CreateInstructorProfiles < ActiveRecord::Migration[8.1]
  def change
    create_table :instructor_profiles, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid, index: { unique: true }
      t.text :bio
      t.string :expertise, array: true, default: []
      t.datetime :verified_at

      t.timestamps
    end
  end
end
