FactoryBot.define do
  factory :scheduled_class do
    association :course
    association :instructor_profile
    title { Faker::Educator.course_name }
    description { Faker::Lorem.paragraph }
    scheduled_at { Faker::Time.forward(days: 30) }
    duration_minutes { 60 }
    max_participants { 20 }
    meeting_url { Faker::Internet.url }

    trait :past do
      scheduled_at { Faker::Time.backward(days: 30) }
    end
  end

  factory :class_registration do
    association :scheduled_class
    association :student_profile
    attended { false }
    reminder_sent { false }
  end
end
