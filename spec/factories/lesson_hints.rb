FactoryBot.define do
  factory :lesson_hint do
    association :lesson
    tier { :beginner }
    content { "Use forward blocks to move the character" }

    trigger_config do
      {
        failed_runs_threshold: 3,
        time_threshold_seconds: 120,
        show_immediately: false
      }
    end

    trait :intermediate do
      tier { :intermediate }
      content { "Try using 3 forward blocks" }
    end

    trait :advanced do
      tier { :advanced }
      content { "Solution: Use 3 forward blocks in a row" }
    end
  end
end
