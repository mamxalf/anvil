require "application_system_test_case"

class ParentDashboardTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @parent = users(:parent)
    @child = users(:student)
    # Ensure link exists
    ParentChild.create!(parent: @parent, child: @child, notifications_enabled: true) unless ParentChild.exists?(parent: @parent, child: @child)
  end

  test "parent can view dashboard and children" do
    sign_in @parent
    
    visit dashboard_url
    
    assert_selector "h1", text: /Dashboard|Welcome/
    assert_text @parent.name
    
    # Check if child is listed
    assert_text @child.name
    
    # Check for "Learning Progress"
    assert_text "Learning Progress"
  end
end
