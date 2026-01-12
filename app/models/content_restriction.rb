class ContentRestriction < ApplicationRecord
  belongs_to :parent_child

  # Validations
  validates :parent_child_id, uniqueness: true

  # Check if a course is allowed for the child
  def course_allowed?(course)
    return true if max_course_level.nil? || max_course_level >= 2 # No restriction

    # Check level restriction
    level_ok = Course.levels[course.level] <= max_course_level

    # Check subject restriction
    subject_ok = allowed_subjects.blank? || allowed_subjects.include?(course.subject)

    level_ok && subject_ok
  end

  # Check if enrollment needs parent approval
  def needs_approval_for?(course)
    require_approval_for_enrollment
  end

  # Get list of blocked subjects
  def blocked_subjects
    Course.subjects.keys - (allowed_subjects || [])
  end

  # Human-readable max level
  def max_level_name
    return "No restriction" if max_course_level.nil? || max_course_level >= 2
    Course.levels.key(max_course_level).to_s.titleize
  end
end
