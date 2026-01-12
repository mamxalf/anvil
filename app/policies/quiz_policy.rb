# frozen_string_literal: true

class QuizPolicy < ApplicationPolicy
  def index?
    authenticated?
  end

  def show?
    return true if admin?
    return true if instructor? && record.lesson.course.instructor == user.instructor_profile
    return true if student? && enrolled_in_course?
    false
  end

  def create?
    return true if admin?
    return true if instructor? && record.lesson.course.instructor == user.instructor_profile
    false
  end

  def update?
    create?
  end

  def destroy?
    create?
  end

  def attempt?
    return false unless student?
    return false unless enrolled_in_course?
    record.can_attempt?(user.student_profile)
  end

  private

  def enrolled_in_course?
    return false unless user.student_profile
    user.student_profile.course_enrollments.exists?(course: record.lesson.course)
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif instructor?
        scope.joins(lesson: { course_module: :course })
             .where(courses: { instructor_id: user.instructor_profile&.id })
      else
        scope.none
      end
    end
  end
end
