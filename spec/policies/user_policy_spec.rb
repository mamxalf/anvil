require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  subject { described_class }

  permissions :index? do
    it "grants access to admin" do
      expect(subject).to permit(admin, User)
    end
    it "denies access to regular user" do
      expect(subject).not_to permit(user, User)
    end
  end

  permissions :show? do
    it "grants access to admin" do
      expect(subject).to permit(admin, user)
    end
    it "grants access to self" do
      expect(subject).to permit(user, user)
    end
    it "denies access to other user" do
      expect(subject).not_to permit(other_user, user)
    end
  end

  permissions :create? do
    it "grants access to admin" do
      expect(subject).to permit(admin, User)
    end
    it "denies access to regular user" do
      expect(subject).not_to permit(user, User)
    end
  end

  permissions :update? do
    it "grants access to admin" do
      expect(subject).to permit(admin, user)
    end
    it "grants access to self" do
      expect(subject).to permit(user, user)
    end
    it "denies access to other user" do
      expect(subject).not_to permit(other_user, user)
    end
  end

  permissions :destroy? do
    it "grants access to admin" do
      expect(subject).to permit(admin, user)
    end
    it "denies access to regular user" do
      expect(subject).not_to permit(user, user)
    end
  end
end
