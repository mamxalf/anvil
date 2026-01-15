require 'rails_helper'

RSpec.describe StudentProfile, type: :model do
  let(:user) { create(:user) }
  let(:profile) { user.student_profile }

  # Ensure profile exists since it is auto-created by User callbacks usually,
  # but here we might need to rely on the factory or setup.
  # Based on Minitest: @user = User.create; @profile = @user.student_profile
  # FactoryBot user factory might trigger profile creation if wired that way.
  # Let's assume user creation triggers it or we use the profile factory.

  # Actually, let's use the factory directly if possible, or follow the Minitest pattern if User handles it.
  # In Minitest, they did: @user = User.create!; @profile = @user.student_profile.
  # So let's stick to that for now to be safe, or use `create(:student_profile)`.

  before do
    profile.update!(birth_date: 10.years.ago, grade_level: 5)
  end

  it "is valid with valid attributes" do
    expect(profile).to be_valid
  end

  it "requires a user" do
    profile.user = nil
    expect(profile).not_to be_valid
  end

  it "has default values" do
    # Assuming Minitest asserts 0 for new profile
    # We need a fresh profile for this test maybe?
    # Or just check the current one if it hasn't been changed.
    # The setup updates birth_date but not points/streak.
    expect(profile.total_points).to eq(0)
    expect(profile.current_streak).to eq(0)
  end

  describe "#record_activity!" do
    it "increments streak if active today after activity yesterday" do
      profile.update!(last_activity_at: 1.day.ago)
      expect { profile.record_activity! }.to change { profile.reload.current_streak }.by(1)
      expect(profile.last_activity_at).to be > 1.minute.ago
    end

    it "resets streak if missed a day" do
      profile.update!(last_activity_at: 2.days.ago, current_streak: 5)
      profile.record_activity!
      expect(profile.reload.current_streak).to eq(1)
    end

    it "does not increment if already active today" do
      profile.update!(last_activity_at: Time.current, current_streak: 5)
      expect { profile.record_activity! }.not_to change { profile.reload.current_streak }
    end
  end

  describe "#add_points" do
    it "increases total points" do
      expect { profile.add_points(50) }.to change { profile.reload.total_points }.by(50)
    end
  end
end
