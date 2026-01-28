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

ActiveRecord::Schema[8.1].define(version: 2026_01_27_013152) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "achievements", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "badge_id"
    t.datetime "created_at", null: false
    t.integer "criteria_type"
    t.integer "criteria_value"
    t.text "description"
    t.string "icon_key"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "xp_reward"
    t.index [ "badge_id" ], name: "index_achievements_on_badge_id"
  end

  create_table "action_text_rich_texts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "body"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.uuid "record_id", null: false
    t.string "record_type", null: false
    t.datetime "updated_at", null: false
    t.index [ "record_type", "record_id", "name" ], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.uuid "record_id", null: false
    t.string "record_type", null: false
    t.index [ "blob_id" ], name: "index_active_storage_attachments_on_blob_id"
    t.index [ "record_type", "record_id", "name", "blob_id" ], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index [ "key" ], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index [ "blob_id", "variation_digest" ], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "answers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.boolean "is_correct", default: false, null: false
    t.integer "position", default: 0, null: false
    t.uuid "question_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "question_id", "position" ], name: "index_answers_on_question_id_and_position"
    t.index [ "question_id" ], name: "index_answers_on_question_id"
  end

  create_table "arduino_sketches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "blocks_xml"
    t.string "board_type", default: "uno"
    t.text "code"
    t.datetime "created_at", null: false
    t.jsonb "modules", default: []
    t.string "name"
    t.boolean "published", default: false
    t.datetime "published_at"
    t.uuid "student_profile_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "published" ], name: "index_arduino_sketches_on_published"
    t.index [ "student_profile_id" ], name: "index_arduino_sketches_on_student_profile_id"
  end

  create_table "badges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "criteria_type", default: 0, null: false
    t.integer "criteria_value", default: 1, null: false
    t.text "description"
    t.string "icon"
    t.string "name", null: false
    t.integer "points_reward", default: 0, null: false
    t.integer "rarity", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index [ "criteria_type" ], name: "index_badges_on_criteria_type"
    t.index [ "rarity" ], name: "index_badges_on_rarity"
  end

  create_table "certificates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "certificate_number", null: false
    t.uuid "course_enrollment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "issued_at", null: false
    t.datetime "updated_at", null: false
    t.index [ "certificate_number" ], name: "index_certificates_on_certificate_number", unique: true
    t.index [ "course_enrollment_id" ], name: "index_certificates_on_course_enrollment_id"
  end

  create_table "class_registrations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "attended", default: false, null: false
    t.datetime "created_at", null: false
    t.boolean "reminder_sent", default: false, null: false
    t.uuid "scheduled_class_id", null: false
    t.uuid "student_profile_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "scheduled_class_id", "student_profile_id" ], name: "idx_class_registrations_unique", unique: true
    t.index [ "scheduled_class_id" ], name: "index_class_registrations_on_scheduled_class_id"
    t.index [ "student_profile_id" ], name: "index_class_registrations_on_student_profile_id"
  end

  create_table "content_restrictions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "allowed_subjects", default: [ "coding", "robotics" ], array: true
    t.datetime "created_at", null: false
    t.integer "max_course_level", default: 2
    t.uuid "parent_child_id", null: false
    t.boolean "require_approval_for_enrollment", default: false, null: false
    t.datetime "updated_at", null: false
    t.index [ "parent_child_id" ], name: "index_content_restrictions_on_parent_child_id", unique: true
  end

  create_table "course_enrollments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "completed_at"
    t.uuid "course_id", null: false
    t.datetime "created_at", null: false
    t.uuid "enrolled_by_id"
    t.decimal "progress_percentage", precision: 5, scale: 2, default: "0.0"
    t.integer "status", default: 0, null: false
    t.uuid "student_profile_id", null: false
    t.datetime "trial_expires_at"
    t.datetime "updated_at", null: false
    t.index [ "course_id" ], name: "index_course_enrollments_on_course_id"
    t.index [ "enrolled_by_id" ], name: "index_course_enrollments_on_enrolled_by_id"
    t.index [ "status" ], name: "index_course_enrollments_on_status"
    t.index [ "student_profile_id", "course_id" ], name: "index_course_enrollments_on_student_profile_id_and_course_id", unique: true
    t.index [ "student_profile_id" ], name: "index_course_enrollments_on_student_profile_id"
  end

  create_table "course_modules", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "course_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "position", default: 0, null: false
    t.string "title", null: false
    t.uuid "unlock_after_module_id"
    t.datetime "updated_at", null: false
    t.index [ "course_id", "position" ], name: "index_course_modules_on_course_id_and_position"
    t.index [ "course_id" ], name: "index_course_modules_on_course_id"
  end

  create_table "courses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "enrollment_type", default: 0, null: false
    t.decimal "estimated_hours", precision: 5, scale: 2
    t.uuid "instructor_id", null: false
    t.integer "level", default: 0, null: false
    t.integer "max_age", default: 16
    t.integer "min_age", default: 5
    t.string "slug"
    t.integer "status", default: 0, null: false
    t.integer "subject", default: 0, null: false
    t.string "thumbnail"
    t.string "title", null: false
    t.integer "trial_days", default: 0
    t.datetime "updated_at", null: false
    t.index [ "instructor_id" ], name: "index_courses_on_instructor_id"
    t.index [ "level" ], name: "index_courses_on_level"
    t.index [ "slug" ], name: "index_courses_on_slug", unique: true
    t.index [ "status" ], name: "index_courses_on_status"
    t.index [ "subject" ], name: "index_courses_on_subject"
  end

  create_table "holograms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "config_json"
    t.datetime "created_at", null: false
    t.string "title"
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index [ "user_id" ], name: "index_holograms_on_user_id"
  end

  create_table "instructor_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "expertise", default: [], array: true
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.datetime "verified_at"
    t.index [ "user_id" ], name: "index_instructor_profiles_on_user_id", unique: true
  end

  create_table "lesson_hints", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.uuid "lesson_id", null: false
    t.integer "tier", null: false
    t.jsonb "trigger_config", default: {}
    t.datetime "updated_at", null: false
    t.index [ "lesson_id", "tier" ], name: "index_lesson_hints_on_lesson_id_and_tier", unique: true
    t.index [ "lesson_id" ], name: "index_lesson_hints_on_lesson_id"
  end

  create_table "lesson_progresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.uuid "lesson_id", null: false
    t.datetime "started_at"
    t.uuid "student_profile_id", null: false
    t.datetime "updated_at", null: false
    t.decimal "video_watch_percentage", precision: 5, scale: 2, default: "0.0"
    t.integer "xp_earned", default: 0, null: false
    t.index [ "lesson_id" ], name: "index_lesson_progresses_on_lesson_id"
    t.index [ "student_profile_id", "lesson_id" ], name: "index_lesson_progresses_on_student_profile_id_and_lesson_id", unique: true
    t.index [ "student_profile_id" ], name: "index_lesson_progresses_on_student_profile_id"
  end

  create_table "lessons", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.jsonb "activity_config", default: {}
    t.integer "activity_type", default: 0, null: false
    t.text "content"
    t.uuid "course_module_id", null: false
    t.datetime "created_at", null: false
    t.integer "duration_minutes", default: 0
    t.integer "position", default: 0, null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.string "video_url"
    t.integer "xp_reward", default: 10, null: false
    t.index [ "course_module_id", "position" ], name: "index_lessons_on_course_module_id_and_position"
    t.index [ "course_module_id" ], name: "index_lessons_on_course_module_id"
  end

  create_table "maze_attempts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "blocks_used", default: 0, null: false
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.integer "failed_runs", default: 0, null: false
    t.uuid "lesson_id", null: false
    t.integer "stars_earned", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.uuid "student_profile_id", null: false
    t.integer "time_elapsed_seconds", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index [ "lesson_id", "student_profile_id", "status" ], name: "index_maze_attempts_unique_active", where: "(status = 0)"
    t.index [ "lesson_id" ], name: "index_maze_attempts_on_lesson_id"
    t.index [ "student_profile_id" ], name: "index_maze_attempts_on_student_profile_id"
  end

  create_table "notifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "data", default: {}
    t.text "message"
    t.integer "notification_type", default: 0, null: false
    t.datetime "read_at"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index [ "notification_type" ], name: "index_notifications_on_notification_type"
    t.index [ "user_id", "read_at" ], name: "index_notifications_on_user_id_and_read_at"
    t.index [ "user_id" ], name: "index_notifications_on_user_id"
  end

  create_table "parent_children", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "child_id", null: false
    t.datetime "created_at", null: false
    t.integer "email_frequency", default: 0, null: false
    t.boolean "notifications_enabled", default: true, null: false
    t.uuid "parent_id", null: false
    t.string "relationship_type", default: "parent"
    t.datetime "updated_at", null: false
    t.index [ "child_id" ], name: "index_parent_children_on_child_id"
    t.index [ "parent_id", "child_id" ], name: "index_parent_children_on_parent_id_and_child_id", unique: true
    t.index [ "parent_id" ], name: "index_parent_children_on_parent_id"
  end

  create_table "portfolios", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.jsonb "content", default: [], null: false
    t.datetime "created_at", null: false
    t.boolean "published", default: false, null: false
    t.string "slug", null: false
    t.uuid "student_profile_id", null: false
    t.string "theme", default: "modern", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index [ "slug" ], name: "index_portfolios_on_slug", unique: true
    t.index [ "student_profile_id" ], name: "index_portfolios_on_student_profile_id"
  end

  create_table "questions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.text "hint"
    t.integer "points", default: 10, null: false
    t.integer "position", default: 0, null: false
    t.integer "question_type", default: 0, null: false
    t.uuid "quiz_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "quiz_id", "position" ], name: "index_questions_on_quiz_id_and_position"
    t.index [ "quiz_id" ], name: "index_questions_on_quiz_id"
  end

  create_table "quiz_attempts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.boolean "passed", default: false, null: false
    t.uuid "quiz_id", null: false
    t.integer "score", default: 0, null: false
    t.datetime "started_at", null: false
    t.uuid "student_profile_id", null: false
    t.datetime "updated_at", null: false
    t.integer "xp_earned", default: 0, null: false
    t.index [ "quiz_id" ], name: "index_quiz_attempts_on_quiz_id"
    t.index [ "student_profile_id", "quiz_id" ], name: "index_quiz_attempts_on_student_profile_id_and_quiz_id"
    t.index [ "student_profile_id" ], name: "index_quiz_attempts_on_student_profile_id"
  end

  create_table "quiz_responses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "answer_id"
    t.datetime "created_at", null: false
    t.boolean "is_correct", default: false, null: false
    t.uuid "question_id", null: false
    t.uuid "quiz_attempt_id", null: false
    t.text "text_response"
    t.datetime "updated_at", null: false
    t.index [ "answer_id" ], name: "index_quiz_responses_on_answer_id"
    t.index [ "question_id" ], name: "index_quiz_responses_on_question_id"
    t.index [ "quiz_attempt_id", "question_id" ], name: "index_quiz_responses_on_quiz_attempt_id_and_question_id", unique: true
    t.index [ "quiz_attempt_id" ], name: "index_quiz_responses_on_quiz_attempt_id"
  end

  create_table "quizzes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.uuid "lesson_id", null: false
    t.integer "max_attempts", default: 3
    t.integer "passing_score", default: 70, null: false
    t.integer "time_limit_minutes"
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "xp_reward", default: 25, null: false
    t.index [ "lesson_id" ], name: "index_quizzes_on_lesson_id"
  end

  create_table "resources", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "download_count", default: 0, null: false
    t.uuid "lesson_id", null: false
    t.integer "resource_type", default: 0, null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index [ "lesson_id" ], name: "index_resources_on_lesson_id"
  end

  create_table "scheduled_classes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "course_id", null: false
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "duration_minutes", default: 60, null: false
    t.uuid "instructor_profile_id", null: false
    t.integer "max_participants"
    t.string "meeting_url"
    t.datetime "scheduled_at", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index [ "course_id", "scheduled_at" ], name: "index_scheduled_classes_on_course_id_and_scheduled_at"
    t.index [ "course_id" ], name: "index_scheduled_classes_on_course_id"
    t.index [ "instructor_profile_id" ], name: "index_scheduled_classes_on_instructor_profile_id"
    t.index [ "scheduled_at" ], name: "index_scheduled_classes_on_scheduled_at"
  end

  create_table "screen_time_limits", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "day_of_week", null: false
    t.boolean "enabled", default: true, null: false
    t.integer "max_minutes", default: 60, null: false
    t.uuid "parent_child_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "parent_child_id", "day_of_week" ], name: "index_screen_time_limits_on_parent_child_id_and_day_of_week", unique: true
    t.index [ "parent_child_id" ], name: "index_screen_time_limits_on_parent_child_id"
  end

  create_table "student_profiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "birth_date"
    t.datetime "created_at", null: false
    t.integer "current_streak", default: 0, null: false
    t.string "grade_level"
    t.datetime "last_activity_at"
    t.integer "level", default: 1, null: false
    t.integer "longest_streak", default: 0, null: false
    t.integer "total_points", default: 0, null: false
    t.datetime "updated_at", null: false
    t.uuid "user_id", null: false
    t.index [ "user_id" ], name: "index_student_profiles_on_user_id", unique: true
  end

  create_table "user_achievements", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "achievement_id", null: false
    t.datetime "created_at", null: false
    t.datetime "earned_at"
    t.uuid "student_profile_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "achievement_id" ], name: "index_user_achievements_on_achievement_id"
    t.index [ "student_profile_id" ], name: "index_user_achievements_on_student_profile_id"
  end

  create_table "user_badges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "badge_id", null: false
    t.datetime "created_at", null: false
    t.datetime "earned_at", null: false
    t.uuid "student_profile_id", null: false
    t.datetime "updated_at", null: false
    t.index [ "badge_id" ], name: "index_user_badges_on_badge_id"
    t.index [ "student_profile_id", "badge_id" ], name: "index_user_badges_on_student_profile_id_and_badge_id", unique: true
    t.index [ "student_profile_id" ], name: "index_user_badges_on_student_profile_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "avatar"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "last_seen_at"
    t.string "locale", default: "id"
    t.string "name", null: false
    t.string "phone"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "role", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index [ "email" ], name: "index_users_on_email", unique: true
    t.index [ "reset_password_token" ], name: "index_users_on_reset_password_token", unique: true
    t.index [ "role" ], name: "index_users_on_role"
  end

  add_foreign_key "achievements", "badges"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "answers", "questions"
  add_foreign_key "arduino_sketches", "student_profiles"
  add_foreign_key "certificates", "course_enrollments"
  add_foreign_key "class_registrations", "scheduled_classes"
  add_foreign_key "class_registrations", "student_profiles"
  add_foreign_key "content_restrictions", "parent_children"
  add_foreign_key "course_enrollments", "courses"
  add_foreign_key "course_enrollments", "student_profiles"
  add_foreign_key "course_enrollments", "users", column: "enrolled_by_id"
  add_foreign_key "course_modules", "course_modules", column: "unlock_after_module_id"
  add_foreign_key "course_modules", "courses"
  add_foreign_key "courses", "instructor_profiles", column: "instructor_id"
  add_foreign_key "holograms", "users"
  add_foreign_key "instructor_profiles", "users"
  add_foreign_key "lesson_hints", "lessons"
  add_foreign_key "lesson_progresses", "lessons"
  add_foreign_key "lesson_progresses", "student_profiles"
  add_foreign_key "lessons", "course_modules"
  add_foreign_key "maze_attempts", "lessons"
  add_foreign_key "maze_attempts", "student_profiles"
  add_foreign_key "notifications", "users"
  add_foreign_key "parent_children", "users", column: "child_id"
  add_foreign_key "parent_children", "users", column: "parent_id"
  add_foreign_key "portfolios", "student_profiles"
  add_foreign_key "questions", "quizzes"
  add_foreign_key "quiz_attempts", "quizzes"
  add_foreign_key "quiz_attempts", "student_profiles"
  add_foreign_key "quiz_responses", "answers"
  add_foreign_key "quiz_responses", "questions"
  add_foreign_key "quiz_responses", "quiz_attempts"
  add_foreign_key "quizzes", "lessons"
  add_foreign_key "resources", "lessons"
  add_foreign_key "scheduled_classes", "courses"
  add_foreign_key "scheduled_classes", "instructor_profiles"
  add_foreign_key "screen_time_limits", "parent_children"
  add_foreign_key "student_profiles", "users"
  add_foreign_key "user_achievements", "achievements"
  add_foreign_key "user_achievements", "student_profiles"
  add_foreign_key "user_badges", "badges"
  add_foreign_key "user_badges", "student_profiles"
end
