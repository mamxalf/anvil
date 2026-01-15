require 'rails_helper'

RSpec.describe "Parent Dashboard", type: :feature do
  let!(:parent) { create(:user, :parent) }
  let!(:child) { create(:user) }

  before do
    # Create parent-child relationship (assuming factory or model logic)
    # ParentChild model
    ParentChild.create!(parent: parent, child: child, notifications_enabled: true)
    sign_in parent, scope: :user
  end

  it "parent can view dashboard and children" do
    visit parent_dashboard_path # Direct access or root_path depending on routing

    expect(page).to have_content(/Dashboard|Welcome/)
    expect(page).to have_content(parent.name)

    # Check if child is listed
    expect(page).to have_content(child.name)

    # Check for "Learning Progress"
    expect(page).to have_content("Learning Progress")
  end
end
