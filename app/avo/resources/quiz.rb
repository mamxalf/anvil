class Avo::Resources::Quiz < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :lesson_id, as: :text
    field :title, as: :text
    field :description, as: :textarea
    field :passing_score, as: :number
    field :time_limit_minutes, as: :number
    field :max_attempts, as: :number
    field :xp_reward, as: :number
    field :lesson, as: :belongs_to
    field :questions, as: :has_many
    field :quiz_attempts, as: :has_many
  end
end
