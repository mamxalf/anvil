class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :role, { student: 0, parent: 1, instructor: 2, admin: 3 }

  # Profile associations
  has_one :student_profile, dependent: :destroy
  has_one :instructor_profile, dependent: :destroy

  # Parent-Child relationships
  has_many :parent_relationships, class_name: "ParentChild", foreign_key: :parent_id, dependent: :destroy
  has_many :children, through: :parent_relationships, source: :child

  has_many :child_relationships, class_name: "ParentChild", foreign_key: :child_id, dependent: :destroy
  has_many :parents, through: :child_relationships, source: :parent

  # Notifications
  has_many :notifications, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  # Callbacks
  after_create :create_profile_for_role

  # Scopes
  scope :students, -> { where(role: :student) }
  scope :parents, -> { where(role: :parent) }
  scope :instructors, -> { where(role: :instructor) }
  scope :admins, -> { where(role: :admin) }

  def display_name
    name.presence || email.split("@").first
  end

  def avatar_url
    if defined?(avatar) && avatar.respond_to?(:attached?) && avatar.attached?
      Rails.application.routes.url_helpers.rails_blob_url(avatar, only_path: true)
    elsif avatar.present? && avatar.is_a?(String)
      avatar
    else
      "/assets/profile-kodibot.png"
    end
  end

  private

  def create_profile_for_role
    case role
    when "student"
      create_student_profile!
    when "instructor"
      create_instructor_profile!
    end
  end
end
