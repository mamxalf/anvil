require 'rails_helper'

RSpec.describe CoursePolicy, type: :policy do
  let(:admin) { create(:user, :admin) }
  let(:instructor) { create(:user, :instructor) }
  let(:other_instructor) { create(:user, :instructor) }
  let(:student) { create(:user) }
  let(:parent) { create(:user, :parent) }

  let(:course) { create(:course, instructor_user: instructor, status: :published) }
  let(:draft_course) { create(:course, instructor_user: instructor, status: :draft) }

  subject { described_class }

  permissions :index? do
    it "grants access to admin" do
      expect(subject).to permit(admin, Course)
    end
    it "grants access to instructor" do
      expect(subject).to permit(instructor, Course)
    end
    it "grants access to student" do
      expect(subject).to permit(student, Course)
    end
    it "grants access to parent" do
      expect(subject).to permit(parent, Course)
    end
    it "denies access to nil (visitor)" do
      expect(subject).not_to permit(nil, Course)
    end
  end

  permissions :show? do
    context "published course" do
      it "grants access to everyone enrolled or not" do
        expect(subject).to permit(admin, course)
        expect(subject).to permit(instructor, course)
        expect(subject).to permit(student, course)
        expect(subject).to permit(parent, course)
      end
    end

    context "draft course" do
      it "grants access to admin" do
        expect(subject).to permit(admin, draft_course)
      end
      it "grants access to owner instructor" do
        expect(subject).to permit(instructor, draft_course)
      end
      it "denies access to other instructor" do
        expect(subject).not_to permit(other_instructor, draft_course)
      end
      it "denies access to student" do
        expect(subject).not_to permit(student, draft_course)
      end
    end
  end

  permissions :create? do
    it "grants access to admin" do
      expect(subject).to permit(admin, Course)
    end
    it "grants access to instructor" do
      expect(subject).to permit(instructor, Course)
    end
    it "denies access to student" do
      expect(subject).not_to permit(student, Course)
    end
    it "denies access to parent" do
      expect(subject).not_to permit(parent, Course)
    end
  end

  permissions :update? do
    it "grants access to admin" do
      expect(subject).to permit(admin, course)
    end
    it "grants access to owner instructor" do
      expect(subject).to permit(instructor, course)
    end
    it "denies access to other instructor" do
      expect(subject).not_to permit(other_instructor, course)
    end
    it "denies access to student" do
      expect(subject).not_to permit(student, course)
    end
  end

  permissions :destroy? do
    it "grants access to admin" do
      expect(subject).to permit(admin, course)
    end
    it "grants access to owner instructor" do
      expect(subject).to permit(instructor, course)
    end
    it "denies access to other instructor" do
      expect(subject).not_to permit(other_instructor, course)
    end
    it "denies access to student" do
      expect(subject).not_to permit(student, course)
    end
  end

  permissions :enroll? do
    it "grants access to student" do
      expect(subject).to permit(student, course)
    end
    it "grants access to parent" do
      expect(subject).to permit(parent, course)
    end
    it "denies access to admin" do
      expect(subject).not_to permit(admin, course)
    end
    it "denies access to instructor" do
      expect(subject).not_to permit(instructor, course)
    end
    it "denies access to nil" do
      expect(subject).not_to permit(nil, course)
    end
    it "denies access to draft course for student" do
      expect(subject).not_to permit(student, draft_course)
    end
  end
end
