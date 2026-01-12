require "test_helper"

class CoursePolicyTest < ActiveSupport::TestCase
  def setup
    @admin = users(:admin)
    @instructor = users(:instructor)
    @other_instructor = users(:teacher_bot)
    @student = users(:student)
    @user = users(:parent)
    
    @course = courses(:ruby_course)
    @draft_course = courses(:draft_course)
  end

  test "index" do
    assert_permit @admin, Course, :index?
    assert_permit @instructor, Course, :index?
    assert_permit @student, Course, :index?
    assert_permit @user, Course, :index?
    refute_permit nil, Course, :index?
  end

  test "show" do
    # Published course
    assert_permit @admin, @course, :show?
    assert_permit @instructor, @course, :show?
    assert_permit @student, @course, :show?
    assert_permit @user, @course, :show?
    
    # Draft course
    assert_permit @admin, @draft_course, :show?
    assert_permit @instructor, @draft_course, :show?
    refute_permit @other_instructor, @draft_course, :show? if @other_instructor
    refute_permit @student, @draft_course, :show?
  end

  test "create" do
    assert_permit @admin, Course, :create?
    assert_permit @instructor, Course, :create?
    refute_permit @student, Course, :create?
    refute_permit @user, Course, :create?
  end

  test "update" do
    assert_permit @admin, @course, :update?
    assert_permit @instructor, @course, :update?
    refute_permit @other_instructor, @course, :update? if @other_instructor
    refute_permit @student, @course, :update?
  end

  test "destroy" do
    assert_permit @admin, @course, :destroy?
    assert_permit @instructor, @course, :destroy?
    refute_permit @other_instructor, @course, :destroy? if @other_instructor
    refute_permit @student, @course, :destroy?
  end

  test "enroll" do
    assert_permit @student, @course, :enroll?
    assert_permit @user, @course, :enroll?
    
    refute_permit @admin, @course, :enroll?
    refute_permit @instructor, @course, :enroll?
    refute_permit nil, @course, :enroll?
    
    refute_permit @student, @draft_course, :enroll?
  end

  private

  def assert_permit(user, record, action)
    assert CoursePolicy.new(user, record).send(action), "User #{user&.role} should be permitted to #{action} #{record}"
  end

  def refute_permit(user, record, action)
    refute CoursePolicy.new(user, record).send(action), "User #{user&.role} should NOT be permitted to #{action} #{record}"
  end
end
