class InstructorProfile < ApplicationRecord
  belongs_to :user

  # Courses created by this instructor
  has_many :courses, foreign_key: :instructor_id, dependent: :destroy
  has_many :scheduled_classes, dependent: :destroy

  # Validations
  validates :user_id, uniqueness: true

  # Scopes
  scope :verified, -> { where.not(verified_at: nil) }
  scope :unverified, -> { where(verified_at: nil) }

  def verified?
    verified_at.present?
  end

  def verify!
    update!(verified_at: Time.current)
  end

  def expertise_list
    expertise || []
  end

  def add_expertise(skill)
    self.expertise = (expertise_list + [ skill ]).uniq
    save!
  end

  def total_students
    courses.joins(:course_enrollments).distinct.count("course_enrollments.student_profile_id")
  end

  def total_courses
    courses.published.count
  end
end
