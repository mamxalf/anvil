FactoryBot.define do
  factory :course do
    title { Faker::Educator.course_name }
    sequence(:slug) { |n| "course-#{n}-#{SecureRandom.hex(4)}" }
    description { Faker::Lorem.paragraph }
    level { "beginner" }
    subject { "coding" }
    status { "published" }

    transient do
      instructor_user { create(:user, :instructor) }
    end

    instructor { instructor_user.instructor_profile }

    trait :draft do
      status { "draft" }
    end
  end

  factory :course_module do
    association :course
    title { Faker::Lorem.sentence }
    sequence(:position) { |n| n }
    description { Faker::Lorem.sentence }
  end

  factory :lesson do
    association :course_module
    title { Faker::Lorem.sentence }
    sequence(:position) { |n| n }
    duration_minutes { rand(5..60) }
    xp_reward { 10 }
    content { Faker::Lorem.paragraphs.join("\n\n") }
    video_url { "https://www.youtube.com/embed/dQw4w9WgXcQ" }
  end
end
