FactoryBot.define do
  factory :certificate do
    association :course_enrollment
    certificate_number { "KODI-#{SecureRandom.hex(4).upcase}-#{Time.current.strftime('%Y%m%d')}" }
    issued_at { Time.current }
  end
end
