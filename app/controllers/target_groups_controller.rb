class TargetGroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_target_group, only: [ :show, :update_nutrition_profiles, :destroy_nutrition_profile ]

  def index
    authorize TargetGroup
    @target_groups = policy_scope(TargetGroup).ordered

    render inertia: "TargetGroups/Index", props: {
      target_groups: @target_groups.as_json(methods: [ :nutrition_requirements, :nutrition_profiles ])
    }
  end

  def show
    authorize @target_group
    render inertia: "TargetGroups/Show", props: {
      target_group: @target_group.as_json(methods: [ :nutrition_requirements, :nutrition_profiles ])
    }
  end

  def update_nutrition_profiles
    authorize @target_group, :manage_nutrition_profiles?

    profiles_params.each do |profile_key, attrs|
      if ActiveModel::Type::Boolean.new.cast(attrs["delete"])
        profile = @target_group.nutrition_requirement_profiles.find_by(profile_key: profile_key)
        profile&.destroy
      else
        cleaned_attrs = attrs.except("delete")
        profile = @target_group.nutrition_requirement_profiles.find_or_initialize_by(profile_key: profile_key)
        profile.assign_attributes(cleaned_attrs)
        profile.save!
      end
    end

    redirect_to target_group_path(@target_group), notice: I18n.t("messages.updated", resource: I18n.t("target_groups.plural", default: "Target groups"))
  end

  def destroy_nutrition_profile
    authorize @target_group, :manage_nutrition_profiles?

    profile_key = params[:profile_key].to_s
    profile = @target_group.nutrition_requirement_profiles.find_by(profile_key: profile_key)

    if profile
      begin
        profile.destroy
        flash[:success] = I18n.t("messages.deleted", resource: I18n.t("nutrition_profiles.singular", default: "Profil gizi"))
      rescue ActiveRecord::InvalidForeignKey
        flash[:error] = I18n.t("nutrition_profiles.in_use", default: "Profil ini digunakan oleh menu dan tidak dapat dihapus.")
      end
    else
      flash[:error] = I18n.t("nutrition_profiles.not_found", default: "Profil tidak ditemukan.")
    end

    redirect_back fallback_location: nutrition_profiles_path
  end

  private

  def set_target_group
    @target_group = TargetGroup.find(params[:id])
  end

  def profiles_params
    raw = params.require(:profiles).to_unsafe_h
    raw.transform_values do |attrs|
      attrs.slice("energy", "protein", "fat", "carbohydrate", "fiber", "delete")
    end
  end
end

