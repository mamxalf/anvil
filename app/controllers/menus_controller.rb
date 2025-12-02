class MenusController < ApplicationController
  before_action :authenticate_user!
  before_action :set_menu, only: [ :show, :edit, :update, :destroy, :publish, :archive ]

  def index
    authorize Menu
    @menus = policy_scope(Menu)
              .includes(:target_group, :created_by)
              .ordered

    # Apply filters
    @menus = @menus.by_target_group(params[:target_group_id]) if params[:target_group_id].present?
    @menus = @menus.where(status: params[:status]) if params[:status].present?

    render inertia: "Menus/Index", props: {
      menus: @menus.as_json(include: {
        target_group: { only: [ :id, :name, :code ] },
        created_by: { only: [ :id, :name ] }
      }),
      target_groups: TargetGroup.ordered.as_json(only: [ :id, :name, :code ]),
      filters: {
        target_group_id: params[:target_group_id],
        status: params[:status]
      }
    }
  end

  def show
    authorize @menu
    render inertia: "Menus/Show", props: {
      menu: menu_json(@menu),
      nutrition_compliance: @menu.nutrition_compliance
    }
  end

  def new
    authorize Menu
    @menu = Menu.new
    render inertia: "Menus/Form", props: {
      menu: @menu.as_json,
      target_groups: TargetGroup.ordered.as_json(only: [ :id, :name, :code ]),
      food_items: FoodItem.ordered.as_json(methods: [ :category_name_id ]),
      is_edit: false
    }
  end

  def create
    authorize Menu
    @menu = current_user.created_menus.build(menu_params)

    if @menu.save
      flash[:success] = I18n.t("messages.created", resource: I18n.t("menus.singular"))
      redirect_to menu_path(@menu)
    else
      session[:errors] = @menu.errors.messages
      redirect_to new_menu_path
    end
  end

  def edit
    authorize @menu
    render inertia: "Menus/Form", props: {
      menu: menu_json(@menu),
      target_groups: TargetGroup.ordered.as_json(only: [ :id, :name, :code ]),
      food_items: FoodItem.ordered.as_json(methods: [ :category_name_id ]),
      is_edit: true
    }
  end

  def update
    authorize @menu
    if @menu.update(menu_params)
      flash[:success] = I18n.t("messages.updated", resource: I18n.t("menus.singular"))
      redirect_to menu_path(@menu)
    else
      session[:errors] = @menu.errors.messages
      redirect_to edit_menu_path(@menu)
    end
  end

  def destroy
    authorize @menu
    @menu.destroy
    flash[:success] = I18n.t("messages.deleted", resource: I18n.t("menus.singular"))
    redirect_to menus_path
  end

  def publish
    authorize @menu
    if @menu.update(status: :published)
      flash[:success] = I18n.t("menus.status.published")
      redirect_to menu_path(@menu)
    else
      flash[:error] = I18n.t("messages.error")
      redirect_to menu_path(@menu)
    end
  end

  def archive
    authorize @menu
    if @menu.update(status: :archived)
      flash[:success] = I18n.t("menus.status.archived")
      redirect_to menu_path(@menu)
    else
      flash[:error] = I18n.t("messages.error")
      redirect_to menu_path(@menu)
    end
  end

  private

  def set_menu
    @menu = Menu.includes(:target_group, :menu_items, :food_items).find(params[:id])
  end

  def menu_params
    params.require(:menu).permit(
      :name,
      :description,
      :target_group_id,
      :status,
      :day_number,
      menu_items_attributes: [ :id, :food_item_id, :portion_size, :portion_unit, :meal_type, :_destroy ]
    )
  end

  def menu_json(menu)
    menu.as_json(
      include: {
        target_group: { only: [ :id, :name, :code ], methods: [ :nutrition_requirements ] },
        created_by: { only: [ :id, :name ] },
        menu_items: {
          include: { food_item: { only: [ :id, :name, :category ], methods: [ :category_name_id ] } },
          methods: [ :energy, :protein, :fat, :carbohydrate, :fiber ]
        }
      },
      methods: [ :nutrition_summary, :meets_requirements? ]
    )
  end
end

