# frozen_string_literal: true

class NotificationPolicy < ApplicationPolicy
  def index?
    authenticated?
  end

  def show?
    admin? || record.user == user
  end

  def create?
    admin? # Only system/admin can create notifications
  end

  def update?
    admin? || record.user == user # Users can mark as read
  end

  def destroy?
    admin? || record.user == user
  end

  def mark_as_read?
    record.user == user
  end

  def mark_all_as_read?
    authenticated?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if admin?
        scope.all
      else
        scope.where(user_id: user&.id)
      end
    end
  end
end
