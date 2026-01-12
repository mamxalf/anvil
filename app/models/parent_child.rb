class ParentChild < ApplicationRecord
  belongs_to :parent, class_name: "User"
  belongs_to :child, class_name: "User"

  # Parental controls
  has_many :screen_time_limits, dependent: :destroy
  has_one :content_restriction, dependent: :destroy

  enum :email_frequency, { daily: 0, weekly: 1, both: 2 }

  # Validations
  validates :parent_id, uniqueness: { scope: :child_id, message: "is already linked to this child" }
  validate :parent_must_be_parent_role
  validate :child_must_be_student_role
  validate :cannot_be_same_user

  # Scopes
  scope :with_notifications, -> { where(notifications_enabled: true) }
  scope :daily_digest, -> { where(email_frequency: [ :daily, :both ]) }
  scope :weekly_digest, -> { where(email_frequency: [ :weekly, :both ]) }

  def child_name
    child.name
  end

  def child_progress
    child.student_profile
  end

  private

  def parent_must_be_parent_role
    errors.add(:parent, "must have parent role") unless parent&.parent?
  end

  def child_must_be_student_role
    errors.add(:child, "must have student role") unless child&.student?
  end

  def cannot_be_same_user
    errors.add(:base, "Parent and child cannot be the same user") if parent_id == child_id
  end
end
