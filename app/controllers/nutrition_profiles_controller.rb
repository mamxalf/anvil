class NutritionProfilesController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize TargetGroup, :manage_nutrition_profiles?

    target_groups = policy_scope(TargetGroup).ordered

    render inertia: "NutritionProfiles/Index", props: {
      target_groups: target_groups.as_json(
        only: [ :id, :name, :code, :description, :min_energy, :min_protein, :min_fat, :min_carbohydrate, :min_fiber ],
        methods: [ :nutrition_profiles, :nutrition_requirements ]
      )
    }
  end
end


