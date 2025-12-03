# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_03_180500) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "beneficiaries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "allergies"
    t.datetime "created_at", null: false
    t.date "date_of_birth"
    t.integer "gender"
    t.uuid "institution_id", null: false
    t.string "name"
    t.text "special_needs"
    t.uuid "target_group_id", null: false
    t.datetime "updated_at", null: false
    t.index ["institution_id"], name: "index_beneficiaries_on_institution_id"
    t.index ["target_group_id"], name: "index_beneficiaries_on_target_group_id"
  end

  create_table "food_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "carbohydrate_per_100g", precision: 10, scale: 2, default: "0.0"
    t.integer "category", default: 0, null: false
    t.string "code"
    t.datetime "created_at", null: false
    t.text "description"
    t.decimal "energy_per_100g", precision: 10, scale: 2, default: "0.0"
    t.decimal "fat_per_100g", precision: 10, scale: 2, default: "0.0"
    t.decimal "fiber_per_100g", precision: 10, scale: 2, default: "0.0"
    t.string "name", null: false
    t.decimal "portion_size", precision: 10, scale: 2, default: "100.0"
    t.string "portion_unit", default: "gram"
    t.decimal "protein_per_100g", precision: 10, scale: 2, default: "0.0"
    t.datetime "updated_at", null: false
    t.string "urt_description"
    t.index ["category"], name: "index_food_items_on_category"
    t.index ["code"], name: "index_food_items_on_code", unique: true
  end

  create_table "institutions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "address"
    t.string "city"
    t.string "contact_person"
    t.datetime "created_at", null: false
    t.string "district"
    t.string "email"
    t.integer "institution_type", default: 0, null: false
    t.string "name", null: false
    t.string "phone"
    t.string "postal_code"
    t.string "province"
    t.integer "student_count", default: 0
    t.datetime "updated_at", null: false
    t.index ["city"], name: "index_institutions_on_city"
    t.index ["institution_type"], name: "index_institutions_on_institution_type"
    t.index ["province"], name: "index_institutions_on_province"
  end

  create_table "meal_distributions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "distributed_by_id", null: false
    t.date "distribution_date", null: false
    t.uuid "institution_id", null: false
    t.uuid "menu_id", null: false
    t.text "notes"
    t.integer "recipient_count", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["distributed_by_id"], name: "index_meal_distributions_on_distributed_by_id"
    t.index ["distribution_date"], name: "index_meal_distributions_on_distribution_date"
    t.index ["institution_id", "distribution_date"], name: "index_distributions_on_institution_and_date"
    t.index ["institution_id"], name: "index_meal_distributions_on_institution_id"
    t.index ["menu_id"], name: "index_meal_distributions_on_menu_id"
  end

  create_table "menu_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "food_item_id", null: false
    t.integer "meal_type", default: 0, null: false
    t.uuid "menu_id", null: false
    t.decimal "portion_size", precision: 10, scale: 2, null: false
    t.string "portion_unit", default: "gram", null: false
    t.datetime "updated_at", null: false
    t.index ["food_item_id"], name: "index_menu_items_on_food_item_id"
    t.index ["meal_type"], name: "index_menu_items_on_meal_type"
    t.index ["menu_id"], name: "index_menu_items_on_menu_id"
  end

  create_table "menus", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.uuid "created_by_id", null: false
    t.integer "day_number", default: 1
    t.text "description"
    t.string "name", null: false
    t.string "nutrition_profile", default: "standard", null: false
    t.integer "status", default: 0, null: false
    t.uuid "target_group_id", null: false
    t.decimal "total_carbohydrate", precision: 10, scale: 2, default: "0.0"
    t.decimal "total_energy", precision: 10, scale: 2, default: "0.0"
    t.decimal "total_fat", precision: 10, scale: 2, default: "0.0"
    t.decimal "total_fiber", precision: 10, scale: 2, default: "0.0"
    t.decimal "total_protein", precision: 10, scale: 2, default: "0.0"
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_menus_on_created_by_id"
    t.index ["day_number"], name: "index_menus_on_day_number"
    t.index ["nutrition_profile"], name: "index_menus_on_nutrition_profile"
    t.index ["status"], name: "index_menus_on_status"
    t.index ["target_group_id"], name: "index_menus_on_target_group_id"
  end

  create_table "target_group_nutrition_requirements", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.decimal "carbohydrate", precision: 10, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.decimal "energy", precision: 10, scale: 2, default: "0.0"
    t.decimal "fat", precision: 10, scale: 2, default: "0.0"
    t.decimal "fiber", precision: 10, scale: 2, default: "0.0"
    t.string "profile_key", default: "standard", null: false
    t.decimal "protein", precision: 10, scale: 2, default: "0.0"
    t.uuid "target_group_id", null: false
    t.datetime "updated_at", null: false
    t.index ["profile_key"], name: "index_target_group_nutrition_requirements_on_profile_key"
    t.index ["target_group_id", "profile_key"], name: "index_tgnr_on_target_group_and_profile", unique: true
  end

  create_table "target_groups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "age_range_end"
    t.integer "age_range_start"
    t.string "code", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.decimal "min_calcium", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_carbohydrate", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_energy", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_fat", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_fiber", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_iodine", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_iron", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_protein", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_selenium", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_vitamin_a", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_vitamin_b1", precision: 10, scale: 4, default: "0.0"
    t.decimal "min_vitamin_b12", precision: 10, scale: 4, default: "0.0"
    t.decimal "min_vitamin_b2", precision: 10, scale: 4, default: "0.0"
    t.decimal "min_vitamin_b3", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_vitamin_b6", precision: 10, scale: 4, default: "0.0"
    t.decimal "min_vitamin_b9", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_vitamin_c", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_vitamin_d", precision: 10, scale: 2, default: "0.0"
    t.decimal "min_zinc", precision: 10, scale: 2, default: "0.0"
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_target_groups_on_code", unique: true
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "beneficiaries", "institutions"
  add_foreign_key "beneficiaries", "target_groups"
  add_foreign_key "meal_distributions", "institutions"
  add_foreign_key "meal_distributions", "menus"
  add_foreign_key "meal_distributions", "users", column: "distributed_by_id"
  add_foreign_key "menu_items", "food_items"
  add_foreign_key "menu_items", "menus"
  add_foreign_key "menus", "target_groups"
  add_foreign_key "menus", "users", column: "created_by_id"
  add_foreign_key "target_group_nutrition_requirements", "target_groups"
end
