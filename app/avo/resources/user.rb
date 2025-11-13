class Avo::Resources::User < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :email, as: :text
    field :role, as: :select, options: { user: "user", admin: "admin" }
    field :created_at, as: :date_time
    field :updated_at, as: :date_time
  end
end
