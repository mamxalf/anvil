class Avo::Resources::ScreenTimeLimit < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :parent_child_id, as: :text
    field :day_of_week, as: :number
    field :max_minutes, as: :number
    field :enabled, as: :boolean
    field :parent_child, as: :belongs_to
  end
end
