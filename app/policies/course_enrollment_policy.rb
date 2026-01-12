# frozen_string_literal: true

class CourseEnrollmentPolicy < ApplicationPolicy
  def index?
    authenticated?
  end

  def show?
    return true if admin?
    return true if record.student_profile.user == user
    return true if parent? && user.children.include?(record.student_profile.user)
    return true if instructor? && record.course.instructor == user.instructor_profile
    false
  end

  def create?
    return true if admin?
    return true if student? && user.student_profile == record.student_profile
    return true if parent? && user.children.include?(record.student_profile.user)
    false
  end

  def update?
    admin?
  end

  def destroy?
    return true if admin?
    return true if record.student_profile.user == user
    return true if parent? && user.children.include?(record.student_profile.user)
    false
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif instructor?
        scope.joins(:course).where(courses: { instructor_id: user.instructor_profile&.id })
      elsif parent?
        child_ids = user.children.pluck(:id)
        scope.joins(:student_profile).where(student_profiles: { user_id: child_ids })
      else
        scope.where(student_profile: user.student_profile)
      end
    end
  end
end
