class Avo::Resources::Question < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :quiz_id, as: :text
    field :content, as: :textarea
    field :question_type, as: :select, enum: ::Question.question_types
    field :points, as: :number
    field :position, as: :number
    field :hint, as: :textarea
    field :quiz, as: :belongs_to
    field :answers, as: :has_many
    field :quiz_responses, as: :has_many
  end
end
