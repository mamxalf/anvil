class Avo::Resources::Badge < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :description, as: :textarea
    field :icon, as: :text
    field :criteria_type, as: :select, enum: ::Badge.criteria_types
    field :criteria_value, as: :number
    field :points_reward, as: :number
    field :rarity, as: :select, enum: ::Badge.rarities
    field :user_badges, as: :has_many
    field :student_profiles, as: :has_many, through: :user_badges
  end
end
