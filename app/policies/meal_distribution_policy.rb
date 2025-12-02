# frozen_string_literal: true

class MealDistributionPolicy < ApplicationPolicy
  def index?
    dietitian_or_admin?
  end

  def show?
    dietitian_or_admin?
  end

  def create?
    dietitian_or_admin?
  end

  def update?
    dietitian_or_admin?
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
      if dietitian_or_admin?
        scope.all
      else
        scope.none
      end
    end

    private

    def dietitian_or_admin?
      user&.admin? || user&.dietitian?
    end
  end
end

