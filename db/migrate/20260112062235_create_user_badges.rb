class CreateUserBadges < ActiveRecord::Migration[8.1]
  def change
    create_table :user_badges, id: :uuid do |t|
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.references :badge, null: false, foreign_key: true, type: :uuid
      t.datetime :earned_at, null: false

      t.timestamps
    end

    add_index :user_badges, [:student_profile_id, :badge_id], unique: true
  end
end
