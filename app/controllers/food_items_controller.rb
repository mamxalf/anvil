class FoodItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_food_item, only: [ :show, :edit, :update, :destroy ]

  def index
    authorize FoodItem
    @food_items = policy_scope(FoodItem).ordered

    # Apply filters
    @food_items = @food_items.by_category(params[:category]) if params[:category].present?
    @food_items = @food_items.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?

    render inertia: "FoodItems/Index", props: {
      food_items: @food_items.as_json(methods: [ :category_name_id ]),
      categories: FoodItem.categories.keys.map { |c| { value: c, label: I18n.t("food_items.categories.#{c}") } },
      filters: {
        category: params[:category],
        search: params[:search]
      }
    }
  end

  def show
    authorize @food_item
    render inertia: "FoodItems/Show", props: {
      food_item: @food_item.as_json(methods: [ :category_name_id ])
    }
  end

  def new
    authorize FoodItem
    @food_item = FoodItem.new
    render inertia: "FoodItems/Form", props: {
      food_item: @food_item.as_json,
      categories: FoodItem.categories.keys.map { |c| { value: c, label: I18n.t("food_items.categories.#{c}") } },
      is_edit: false
    }
  end

  def create
    authorize FoodItem
    @food_item = FoodItem.new(food_item_params)

    if @food_item.save
      flash[:success] = I18n.t("messages.created", resource: I18n.t("food_items.singular"))
      redirect_to food_item_path(@food_item)
    else
      session[:errors] = @food_item.errors.messages
      redirect_to new_food_item_path
    end
  end

  def edit
    authorize @food_item
    render inertia: "FoodItems/Form", props: {
      food_item: @food_item.as_json(methods: [ :category_name_id ]),
      categories: FoodItem.categories.keys.map { |c| { value: c, label: I18n.t("food_items.categories.#{c}") } },
      is_edit: true
    }
  end

  def update
    authorize @food_item
    if @food_item.update(food_item_params)
      flash[:success] = I18n.t("messages.updated", resource: I18n.t("food_items.singular"))
      redirect_to food_item_path(@food_item)
    else
      session[:errors] = @food_item.errors.messages
      redirect_to edit_food_item_path(@food_item)
    end
  end

  def destroy
    authorize @food_item
    @food_item.destroy
    flash[:success] = I18n.t("messages.deleted", resource: I18n.t("food_items.singular"))
    redirect_to food_items_path
  end

  private

  def set_food_item
    @food_item = FoodItem.find(params[:id])
  end

  def food_item_params
    params.require(:food_item).permit(
      :name,
      :code,
      :category,
      :description,
      :energy_per_100g,
      :protein_per_100g,
      :fat_per_100g,
      :carbohydrate_per_100g,
      :fiber_per_100g,
      :portion_size,
      :portion_unit,
      :urt_description
    )
  end
end

