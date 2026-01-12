# frozen_string_literal: true

class ParentChildPolicy < ApplicationPolicy
  def index?
    admin? || parent?
  end

  def show?
    admin? || record.parent == user
  end

  def create?
    admin? || parent?
  end

  def update?
    admin? || record.parent == user
  end

  def destroy?
    admin? || record.parent == user
  end

  # Custom actions
  def manage_screen_time?
    admin? || record.parent == user
  end

  def manage_content_restrictions?
    admin? || record.parent == user
  end

  def view_child_progress?
    admin? || record.parent == user
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      elsif parent?
        scope.where(parent_id: user.id)
      else
        scope.none
      end
    end
  end
end
