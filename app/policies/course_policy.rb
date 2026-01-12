# frozen_string_literal: true

class CoursePolicy < ApplicationPolicy
  def index?
    authenticated?
  end

  def show?
    return true if admin?
    return true if record.published?
    return true if instructor? && record.instructor == user.instructor_profile
    false
  end

  def create?
    admin? || instructor?
  end

  def update?
    return true if admin?
    return true if instructor? && record.instructor == user.instructor_profile
    false
  end

  def destroy?
    return true if admin?
    return true if instructor? && record.instructor == user.instructor_profile
    false
  end

  def publish?
    update?
  end

  def enroll?
    return false unless authenticated?
    return false if admin? || instructor?
    return false unless record.published?
    true
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif instructor?
        # Instructors see their own courses + all published courses
        scope.where(instructor_id: user.instructor_profile&.id)
             .or(scope.published)
      else
        # Everyone else sees only published courses
        scope.published
      end
    end
  end
end
