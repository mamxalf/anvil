class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :role, { user: 0, admin: 1, dietitian: 2 }

  has_many :created_menus, class_name: "Menu", foreign_key: :created_by_id, dependent: :restrict_with_error
  has_many :meal_distributions, foreign_key: :distributed_by_id, dependent: :restrict_with_error

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  scope :dietitians, -> { where(role: :dietitian) }
  scope :admins, -> { where(role: :admin) }

  def can_manage_menus?
    admin? || dietitian?
  end

  def can_manage_institutions?
    admin? || dietitian?
  end

  def can_manage_distributions?
    admin? || dietitian?
  end

  def display_role
    I18n.t("users.roles.#{role}")
  end
end
