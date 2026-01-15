FactoryBot.define do
  factory :notification do
    association :user
    title { Faker::Lorem.sentence(word_count: 3) }
    message { Faker::Lorem.paragraph }
    notification_type { "general" } # Enum: general: 0, etc.

    trait :read do
      read_at { Time.current }
    end
  end
end
