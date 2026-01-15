FactoryBot.define do
  factory :achievement do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.sentence }
    icon_key { "icon_key" }
    criteria_type { 1 }
    criteria_value { 1 }
    xp_reward { 10 }
    # badge { nil } # attachment
  end

  factory :user_achievement do
    association :student_profile
    association :achievement
    earned_at { Time.current }
  end
end
