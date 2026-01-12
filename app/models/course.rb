class Course < ApplicationRecord
  belongs_to :instructor, class_name: "InstructorProfile"

  has_many :course_modules, dependent: :destroy
  has_many :lessons, through: :course_modules
  has_many :course_enrollments, dependent: :destroy
  has_many :student_profiles, through: :course_enrollments
  has_many :scheduled_classes, dependent: :destroy

  has_one_attached :thumbnail

  # Enums
  enum :level, { beginner: 0, intermediate: 1, advanced: 2 }
  enum :subject, { coding: 0, robotics: 1 }
  enum :status, { draft: 0, published: 1, archived: 2 }
  enum :enrollment_type, { free: 0, paid: 1, subscription: 2 }

  # Validations
  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :min_age, :max_age, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validate :max_age_greater_than_min_age

  # Callbacks
  before_validation :generate_slug, on: :create

  # Scopes
  scope :published, -> { where(status: :published) }
  scope :for_age, ->(age) { where("min_age <= ? AND max_age >= ?", age, age) }
  scope :by_subject, ->(subject) { where(subject: subject) }
  scope :by_level, ->(level) { where(level: level) }

  # Calculate total lessons
  def total_lessons
    lessons.count
  end

  # Calculate total duration
  def total_duration_minutes
    lessons.sum(:duration_minutes)
  end

  # Check if student can enroll (age check)
  def age_appropriate?(age)
    return true if min_age.nil? && max_age.nil?
    age >= (min_age || 0) && age <= (max_age || 100)
  end

  # Get enrollment count
  def enrolled_count
    course_enrollments.active.count
  end

  private

  def generate_slug
    return if slug.present?
    base_slug = title.to_s.parameterize
    self.slug = base_slug
    counter = 1
    while Course.exists?(slug: slug)
      self.slug = "#{base_slug}-#{counter}"
      counter += 1
    end
  end

  def max_age_greater_than_min_age
    return unless min_age && max_age
    errors.add(:max_age, "must be greater than or equal to min_age") if max_age < min_age
  end
end
