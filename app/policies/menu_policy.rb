# frozen_string_literal: true

class MenuPolicy < ApplicationPolicy
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
    dietitian_or_admin? && (admin? || record.created_by_id == user.id)
  end

  def destroy?
    admin? || (user&.dietitian? && record.created_by_id == user.id && record.status_draft?)
  end

  def publish?
    dietitian_or_admin? && record.status_draft?
  end

  def archive?
    admin?
  end

  private

  def dietitian_or_admin?
    user&.admin? || user&.dietitian?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user&.admin?
        scope.all
      elsif user&.dietitian?
        scope.all
      else
        scope.none
      end
    end
  end
end

