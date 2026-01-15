require 'rails_helper'

RSpec.describe User, type: :model do
  it 'has a valid factory' do
    expect(build(:user)).to be_valid
  end

  it 'can be saved' do
    user = create(:user)
    expect(user).to be_persisted
  end
end
