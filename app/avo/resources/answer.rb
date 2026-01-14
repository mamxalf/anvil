class Avo::Resources::Answer < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :question_id, as: :text
    field :content, as: :textarea
    field :is_correct, as: :boolean
    field :position, as: :number
    field :question, as: :belongs_to
    field :quiz_responses, as: :has_many
  end
end
