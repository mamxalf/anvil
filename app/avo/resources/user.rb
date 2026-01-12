class Avo::Resources::User < Avo::BaseResource
  self.title = :name
  self.includes = [:student_profile, :instructor_profile]
  self.search = {
    query: -> { query.ransack(name_cont: params[:q], email_cont: params[:q], m: "or").result(distinct: false) }
  }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :email, as: :text
    field :role, as: :select, enum: ::User.roles
    field :avatar, as: :text
    field :locale, as: :select, options: { id: "Indonesia", en: "English" }
    field :phone, as: :text
    field :last_seen_at, as: :date_time
    field :created_at, as: :date_time, sortable: true
    field :updated_at, as: :date_time, sortable: true

    # Associations
    field :student_profile, as: :has_one
    field :instructor_profile, as: :has_one
    field :notifications, as: :has_many
  end
end
