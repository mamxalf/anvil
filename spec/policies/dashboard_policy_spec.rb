require 'rails_helper'

RSpec.describe DashboardPolicy, type: :policy do
  let(:user) { create(:user) }
  let(:guest) { nil }

  subject { described_class }

  permissions :index? do
    it "grants access to authenticated user" do
      expect(subject).to permit(user, :dashboard)
    end

    it "denies access to guest" do
      expect(subject).not_to permit(guest, :dashboard)
    end
  end
end
