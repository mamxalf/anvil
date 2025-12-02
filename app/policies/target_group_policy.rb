# frozen_string_literal: true

class TargetGroupPolicy < ApplicationPolicy
  def index?
    dietitian_or_admin?
  end

  def show?
    dietitian_or_admin?
  end

  def create?
    admin?
  end

  def update?
    admin?
  end

  def destroy?
    admin?
  end

  private

  def dietitian_or_admin?
    user&.admin? || user&.dietitian?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.all
    end
  end
end

