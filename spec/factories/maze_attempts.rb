FactoryBot.define do
  factory :maze_attempt do
    association :lesson, :maze_activity
    association :student_profile

    status { :in_progress }
    blocks_used { 0 }
    time_elapsed_seconds { 0 }
    failed_runs { 0 }
    stars_earned { 0 }

    trait :completed do
      status { :completed }
      blocks_used { 5 }
      time_elapsed_seconds { 28 }
      stars_earned { 3 }
      completed_at { Time.current }
    end

    trait :abandoned do
      status { :abandoned }
    end
  end
end
