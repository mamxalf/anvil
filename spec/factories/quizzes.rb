# frozen_string_literal: true

FactoryBot.define do
  factory :quiz do
    association :lesson
    title { "Quiz: #{Faker::Educator.subject}" }
    description { "Test your knowledge on this topic" }
    passing_score { 70 }
    time_limit_minutes { 10 }
    max_attempts { 3 }
    xp_reward { 25 }
  end

  factory :question do
    association :quiz
    content { Faker::Lorem.question }
    question_type { :multiple_choice }
    points { 10 }
    position { 0 }
  end

  factory :answer do
    association :question
    content { Faker::Lorem.sentence }
    is_correct { false }
    position { 0 }
  end

  factory :quiz_attempt do
    association :student_profile
    association :quiz
    started_at { Time.current }
    score { 0 }
    xp_earned { 0 }
  end

  factory :quiz_response do
    association :quiz_attempt
    association :question
    association :answer
    is_correct { false }
  end
end
