class UserBadge < ApplicationRecord
  belongs_to :student_profile
  belongs_to :badge

  # Validations
  validates :student_profile_id, uniqueness: { scope: :badge_id, message: "already has this badge" }
  validates :earned_at, presence: true

  # Scopes
  scope :recent, -> { order(earned_at: :desc) }
  scope :by_rarity, ->(rarity) { joins(:badge).where(badges: { rarity: rarity }) }

  # Delegate badge info
  delegate :name, :description, :icon, :rarity, :points_reward, to: :badge, prefix: true
end
