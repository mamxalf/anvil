# frozen_string_literal: true

class StudentProfilePolicy < ApplicationPolicy
  def index?
    admin? || instructor?
  end

  def show?
    return true if admin?
    return true if record.user == user # Own profile
    return true if instructor? && student_enrolled_in_instructor_course?
    return true if parent? && user.children.include?(record.user)
    false
  end

  def create?
    admin?
  end

  def update?
    admin? || record.user == user
  end

  def destroy?
    admin?
  end

  # Custom actions
  def view_progress?
    show?
  end

  def manage_enrollments?
    admin? || record.user == user || (parent? && user.children.include?(record.user))
  end

  private

  def student_enrolled_in_instructor_course?
    return false unless instructor? && user.instructor_profile
    user.instructor_profile.courses.joins(:course_enrollments)
        .where(course_enrollments: { student_profile_id: record.id }).exists?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif instructor?
        # Instructors see students enrolled in their courses
        scope.joins(course_enrollments: :course)
             .where(courses: { instructor_id: user.instructor_profile&.id })
             .distinct
      elsif parent?
        # Parents see their children's profiles
        scope.joins(user: :child_relationships)
             .where(parent_children: { parent_id: user.id })
      else
        # Students see only their own profile
        scope.where(user_id: user&.id)
      end
    end
  end
end
