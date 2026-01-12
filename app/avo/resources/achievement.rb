class Avo::Resources::Achievement < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :title, as: :text
    field :description, as: :textarea
    field :icon_key, as: :text
    field :criteria_type, as: :number
    field :criteria_value, as: :number
    field :xp_reward, as: :number
    field :badge, as: :belongs_to
  end
end
