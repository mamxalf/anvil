FactoryBot.define do
  factory :course_enrollment do
    association :student_profile
    association :course
    status { :active }
    progress_percentage { 0 }

    trait :completed do
      status { :completed }
      progress_percentage { 100 }
      completed_at { Time.current }
      after(:create) do |enrollment|
        create(:certificate, course_enrollment: enrollment)
      end
    end
  end
end
