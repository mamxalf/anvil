FactoryBot.define do
  factory :instructor_profile do
    association :user, factory: [ :user, :instructor ]

    initialize_with { user.instructor_profile || new }

    verified_at { Time.current }
    expertise { [ "ruby", "python" ] }
  end

  factory :student_profile do
    association :user, factory: [ :user ] # role defaults to student

    initialize_with { user.student_profile || new }

    level { 1 }
    total_points { 0 }
    birth_date { Faker::Date.birthday(min_age: 6, max_age: 18) }
  end
end
