FactoryBot.define do
  factory :user_badge do
    association :student_profile
    association :badge
    earned_at { Time.current }
  end
end
