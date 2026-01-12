class CourseModule < ApplicationRecord
  belongs_to :course
  belongs_to :unlock_after_module, class_name: "CourseModule", optional: true

  has_many :lessons, dependent: :destroy
  has_many :dependent_modules, class_name: "CourseModule", foreign_key: :unlock_after_module_id

  # Validations
  validates :title, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :ordered, -> { order(:position) }

  # Check if module is unlocked for a student
  def unlocked_for?(student_profile)
    return true if unlock_after_module.nil?

    # Check if prerequisite module is completed
    unlock_after_module.completed_by?(student_profile)
  end

  def completed_by?(student_profile)
    return false if lessons.empty?

    completed_lesson_ids = student_profile.lesson_progresses
                                          .where(lesson_id: lessons.pluck(:id))
                                          .where.not(completed_at: nil)
                                          .pluck(:lesson_id)

    lessons.pluck(:id).all? { |id| completed_lesson_ids.include?(id) }
  end

  def progress_for(student_profile)
    return 0 if lessons.empty?

    completed = student_profile.lesson_progresses
                               .where(lesson_id: lessons.pluck(:id))
                               .where.not(completed_at: nil)
                               .count

    (completed.to_f / lessons.count * 100).round
  end
end
