require 'rails_helper'

RSpec.describe "Parent Dashboard", type: :system do
  before do
    driven_by(:playwright)
  end

  it "parent can view dashboard" do
    parent = create(:user, :parent)
    sign_in parent, scope: :user

    visit parent_dashboard_path

    expect(page).to have_content(/Dashboard|Welcome/)
    expect(page).to have_content(parent.name)
  end

  it "parent can view linked children" do
    parent = create(:user, :parent)
    child = create(:user, role: 'student')
    create(:student_profile, user: child)
    ParentChild.create!(parent: parent, child: child, notifications_enabled: true)

    sign_in parent, scope: :user
    visit parent_dashboard_path

    expect(page).to have_content(child.name)
  end
end
