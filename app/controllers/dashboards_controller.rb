class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize :dashboard

    # Calculate statistics
    stats = calculate_statistics
    recent_distributions = MealDistribution
                            .includes(:institution, :menu)
                            .ordered
                            .limit(5)
                            .as_json(
                              include: {
                                institution: { only: [ :id, :name ] },
                                menu: { only: [ :id, :name ] }
                              }
                            )

    # Target group distribution
    beneficiary_by_target = Beneficiary
                              .joins(:target_group)
                              .group("target_groups.name")
                              .count

    # Monthly distribution trend (last 6 months)
    monthly_trend = MealDistribution
                      .where("distribution_date >= ?", 6.months.ago.beginning_of_month)
                      .group_by_month(:distribution_date)
                      .sum(:recipient_count) rescue {}

    render inertia: "Dashboard/Index", props: {
      user: current_user.as_json(only: [ :id, :name, :email, :role ]),
      statistics: stats,
      recent_distributions: recent_distributions,
      beneficiary_by_target: beneficiary_by_target,
      monthly_trend: monthly_trend
    }
  end

  private

  def calculate_statistics
    current_month_start = Date.current.beginning_of_month
    current_month_end = Date.current.end_of_month

    {
      total_beneficiaries: Beneficiary.count,
      total_institutions: Institution.count,
      total_menus: Menu.count,
      published_menus: Menu.status_published.count,
      total_distributions: MealDistribution.count,
      distributions_this_month: MealDistribution.where(
        distribution_date: current_month_start..current_month_end
      ).count,
      recipients_this_month: MealDistribution.where(
        distribution_date: current_month_start..current_month_end
      ).sum(:recipient_count),
      target_groups_count: TargetGroup.count,
      food_items_count: FoodItem.count
    }
  end

  # Helper method to group by month - fallback if groupdate gem is not available
  def group_by_month(scope, column)
    scope.group("DATE_TRUNC('month', #{column})").order("DATE_TRUNC('month', #{column})")
  end
end
