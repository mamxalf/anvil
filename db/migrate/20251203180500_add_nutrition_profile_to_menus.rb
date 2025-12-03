class AddNutritionProfileToMenus < ActiveRecord::Migration[7.1]
  def change
    add_reference :menus, :target_group_nutrition_requirement, type: :uuid, foreign_key: true
    add_index :menus, :target_group_nutrition_requirement_id, name: "index_menus_on_tg_nutrition_requirement_id"
  end
end



