# frozen_string_literal: true

class InstructorProfilePolicy < ApplicationPolicy
  def index?
    authenticated?
  end

  def show?
    authenticated?
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

  def verify?
    admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      else
        scope.verified # Only show verified instructors to public
      end
    end
  end
end
