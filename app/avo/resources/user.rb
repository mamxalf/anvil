class Avo::Resources::User < Avo::BaseResource
  self.title = :name
  self.includes = []
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], email_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :email, as: :text
    field :role, as: :select, enum: ::User.roles, display_value: true
    field :created_menus, as: :has_many
    field :meal_distributions, as: :has_many
    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end
