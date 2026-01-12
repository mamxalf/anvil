class CreateUserAchievements < ActiveRecord::Migration[8.1]
  def change
    create_table :user_achievements, id: :uuid do |t|
      t.references :student_profile, null: false, foreign_key: true, type: :uuid
      t.references :achievement, null: false, foreign_key: true, type: :uuid
      t.datetime :earned_at

      t.timestamps
    end
  end
end
