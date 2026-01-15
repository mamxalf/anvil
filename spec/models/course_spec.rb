require 'rails_helper'

RSpec.describe Course, type: :model do
  let(:course) { build(:course) }

  it "is valid with valid attributes" do
    expect(course).to be_valid
  end

  it "requires a title" do
    course.title = nil
    expect(course).not_to be_valid
  end

  it "requires an instructor" do
    course.instructor = nil
    expect(course).not_to be_valid
  end

  it "defaults status to draft" do
    # Create manually to avoid FactoryBot setting the value
    c = Course.new(
      title: "Test Course",
      instructor: create(:user, :instructor).instructor_profile
    )
    c.save!
    expect(c.status).to eq("draft")
  end

  it "generates a slug after save" do
    course.slug = nil
    course.save!
    expect(course.slug).to be_present
  end

  it "generates a unique slug" do
    course.slug = nil
    course.save!
    duplicate_course = course.dup
    duplicate_course.slug = nil
    duplicate_course.save!
    expect(duplicate_course.slug).not_to eq(course.slug)
  end
end
