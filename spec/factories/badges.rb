FactoryBot.define do
  factory :badge do
    name { Faker::Game.title }
    icon { "icon_key" }
    description { Faker::Lorem.sentence }
    criteria_type { 0 }
    criteria_value { 1 }
    points_reward { 50 }
    rarity { 0 }
  end
end
