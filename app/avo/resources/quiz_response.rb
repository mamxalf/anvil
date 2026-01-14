class Avo::Resources::QuizResponse < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :quiz_attempt_id, as: :text
    field :question_id, as: :text
    field :answer_id, as: :text
    field :text_response, as: :textarea
    field :is_correct, as: :boolean
    field :quiz_attempt, as: :belongs_to
    field :question, as: :belongs_to
    field :answer, as: :belongs_to
  end
end
