class TargetGroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_target_group, only: [ :show ]

  def index
    authorize TargetGroup
    @target_groups = policy_scope(TargetGroup).ordered

    render inertia: "TargetGroups/Index", props: {
      target_groups: @target_groups.as_json(methods: [ :nutrition_requirements ])
    }
  end

  def show
    authorize @target_group
    render inertia: "TargetGroups/Show", props: {
      target_group: @target_group.as_json(methods: [ :nutrition_requirements ])
    }
  end

  private

  def set_target_group
    @target_group = TargetGroup.find(params[:id])
  end
end

