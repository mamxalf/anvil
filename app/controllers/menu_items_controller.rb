class MenuItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_menu
  before_action :set_menu_item, only: [ :update, :destroy ]

  def create
    authorize @menu, :update?
    @menu_item = @menu.menu_items.build(menu_item_params)

    if @menu_item.save
      flash[:success] = I18n.t("messages.created", resource: I18n.t("menu_items.singular", default: "Item Menu"))
      redirect_to menu_path(@menu)
    else
      session[:errors] = @menu_item.errors.messages
      redirect_to menu_path(@menu)
    end
  end

  def update
    authorize @menu, :update?
    if @menu_item.update(menu_item_params)
      flash[:success] = I18n.t("messages.updated", resource: I18n.t("menu_items.singular", default: "Item Menu"))
      redirect_to menu_path(@menu)
    else
      session[:errors] = @menu_item.errors.messages
      redirect_to menu_path(@menu)
    end
  end

  def destroy
    authorize @menu, :update?
    @menu_item.destroy
    flash[:success] = I18n.t("messages.deleted", resource: I18n.t("menu_items.singular", default: "Item Menu"))
    redirect_to menu_path(@menu)
  end

  private

  def set_menu
    @menu = Menu.find(params[:menu_id])
  end

  def set_menu_item
    @menu_item = @menu.menu_items.find(params[:id])
  end

  def menu_item_params
    params.require(:menu_item).permit(
      :food_item_id,
      :portion_size,
      :portion_unit,
      :meal_type
    )
  end
end

