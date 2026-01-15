FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { "password" }
    password_confirmation { "password" }
    role { "student" }

    trait :admin do
      role { "admin" }
    end

    trait :instructor do
      role { "instructor" }
    end

    trait :parent do
      role { "parent" }
    end
  end
end
