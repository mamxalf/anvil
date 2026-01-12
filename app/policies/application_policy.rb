# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  private

  # Role helpers
  def admin?
    user&.admin?
  end

  def instructor?
    user&.instructor?
  end

  def parent?
    user&.parent?
  end

  def student?
    user&.student?
  end

  def authenticated?
    user.present?
  end

  # Check if user owns the record (for instructors managing their content)
  def owner?
    return false unless user && record.respond_to?(:user_id)
    record.user_id == user.id
  end

  # Check if parent can access child's records
  def parent_of_student?
    return false unless parent? && record.respond_to?(:student_profile)
    user.children.include?(record.student_profile.user)
  end

  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NoMethodError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope

    def admin?
      user&.admin?
    end

    def instructor?
      user&.instructor?
    end

    def parent?
      user&.parent?
    end

    def student?
      user&.student?
    end
  end
end
