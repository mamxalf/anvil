require 'rails_helper'

RSpec.describe Achievement, type: :model do
  it "has a valid factory" do
    expect(build(:achievement)).to be_valid
  end
end
