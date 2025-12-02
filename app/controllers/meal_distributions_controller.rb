class MealDistributionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_meal_distribution, only: [ :show, :edit, :update, :destroy ]

  def index
    authorize MealDistribution
    @distributions = policy_scope(MealDistribution)
                      .includes(:institution, :menu, :distributed_by)
                      .ordered

    # Apply filters
    @distributions = @distributions.by_institution(params[:institution_id]) if params[:institution_id].present?
    @distributions = @distributions.by_date(params[:date]) if params[:date].present?
    @distributions = @distributions.by_date_range(params[:start_date], params[:end_date]) if params[:start_date].present? && params[:end_date].present?

    # Calculate statistics
    start_date = params[:start_date] || Date.current.beginning_of_month
    end_date = params[:end_date] || Date.current.end_of_month
    stats = MealDistribution.distribution_stats(start_date, end_date)

    render inertia: "MealDistributions/Index", props: {
      distributions: @distributions.as_json(
        include: {
          institution: { only: [ :id, :name ] },
          menu: { only: [ :id, :name ] },
          distributed_by: { only: [ :id, :name ] }
        }
      ),
      institutions: Institution.ordered.as_json(only: [ :id, :name ]),
      menus: Menu.status_published.ordered.as_json(only: [ :id, :name ]),
      statistics: stats,
      filters: {
        institution_id: params[:institution_id],
        date: params[:date],
        start_date: start_date,
        end_date: end_date
      }
    }
  end

  def show
    authorize @distribution
    render inertia: "MealDistributions/Show", props: {
      distribution: @distribution.as_json(
        methods: [ :menu_name, :institution_name, :target_group_name, :nutrition_delivered ],
        include: {
          institution: { only: [ :id, :name ], methods: [ :institution_type_name_id ] },
          menu: {
            only: [ :id, :name ],
            include: { target_group: { only: [ :id, :name ] } }
          },
          distributed_by: { only: [ :id, :name ] }
        }
      )
    }
  end

  def new
    authorize MealDistribution
    @distribution = MealDistribution.new
    @distribution.distribution_date = Date.current
    @distribution.institution_id = params[:institution_id] if params[:institution_id].present?

    render inertia: "MealDistributions/Form", props: {
      distribution: @distribution.as_json,
      institutions: Institution.ordered.as_json(only: [ :id, :name, :student_count ]),
      menus: Menu.status_published.includes(:target_group).ordered.as_json(
        only: [ :id, :name ],
        include: { target_group: { only: [ :id, :name ] } }
      ),
      is_edit: false
    }
  end

  def create
    authorize MealDistribution
    @distribution = MealDistribution.new(meal_distribution_params)
    @distribution.distributed_by = current_user

    if @distribution.save
      flash[:success] = I18n.t("messages.created", resource: I18n.t("meal_distributions.singular"))
      redirect_to meal_distribution_path(@distribution)
    else
      session[:errors] = @distribution.errors.messages
      redirect_to new_meal_distribution_path
    end
  end

  def edit
    authorize @distribution
    render inertia: "MealDistributions/Form", props: {
      distribution: @distribution.as_json(
        include: {
          institution: { only: [ :id, :name ] },
          menu: { only: [ :id, :name ] }
        }
      ),
      institutions: Institution.ordered.as_json(only: [ :id, :name, :student_count ]),
      menus: Menu.status_published.includes(:target_group).ordered.as_json(
        only: [ :id, :name ],
        include: { target_group: { only: [ :id, :name ] } }
      ),
      is_edit: true
    }
  end

  def update
    authorize @distribution
    if @distribution.update(meal_distribution_params)
      flash[:success] = I18n.t("messages.updated", resource: I18n.t("meal_distributions.singular"))
      redirect_to meal_distribution_path(@distribution)
    else
      session[:errors] = @distribution.errors.messages
      redirect_to edit_meal_distribution_path(@distribution)
    end
  end

  def destroy
    authorize @distribution
    @distribution.destroy
    flash[:success] = I18n.t("messages.deleted", resource: I18n.t("meal_distributions.singular"))
    redirect_to meal_distributions_path
  end

  private

  def set_meal_distribution
    @distribution = MealDistribution.includes(:institution, :menu, :distributed_by).find(params[:id])
  end

  def meal_distribution_params
    params.require(:meal_distribution).permit(
      :institution_id,
      :menu_id,
      :distribution_date,
      :recipient_count,
      :notes
    )
  end
end

