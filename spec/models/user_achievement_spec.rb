require 'rails_helper'

RSpec.describe UserAchievement, type: :model do
  it "has a valid factory" do
    expect(build(:user_achievement)).to be_valid
  end
end
