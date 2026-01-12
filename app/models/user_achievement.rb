class UserAchievement < ApplicationRecord
  belongs_to :student_profile
  belongs_to :achievement

  validates :student_profile_id, uniqueness: { scope: :achievement_id, message: "has already earned this achievement" }
end
