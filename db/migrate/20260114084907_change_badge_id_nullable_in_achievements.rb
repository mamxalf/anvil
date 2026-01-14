class ChangeBadgeIdNullableInAchievements < ActiveRecord::Migration[8.1]
  def change
    change_column_null :achievements, :badge_id, true
  end
end
