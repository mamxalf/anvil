class CreateTargetGroupNutritionRequirements < ActiveRecord::Migration[7.1]
  def change
    create_table :target_group_nutrition_requirements, id: :uuid, default: "gen_random_uuid()" do |t|
      t.uuid :target_group_id, null: false
      t.string :profile_key, null: false, default: "standard"
      t.decimal :energy, precision: 10, scale: 2, default: 0
      t.decimal :protein, precision: 10, scale: 2, default: 0
      t.decimal :fat, precision: 10, scale: 2, default: 0
      t.decimal :carbohydrate, precision: 10, scale: 2, default: 0
      t.decimal :fiber, precision: 10, scale: 2, default: 0

      t.timestamps
    end

    add_index :target_group_nutrition_requirements, :profile_key
    add_index :target_group_nutrition_requirements, [:target_group_id, :profile_key],
              unique: true,
              name: "index_tgnr_on_target_group_and_profile"
    add_foreign_key :target_group_nutrition_requirements, :target_groups
  end
end


