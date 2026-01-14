class Avo::Resources::QuizAttempt < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :student_profile_id, as: :text
    field :quiz_id, as: :text
    field :started_at, as: :date_time
    field :completed_at, as: :date_time
    field :score, as: :number
    field :passed, as: :boolean
    field :xp_earned, as: :number
    field :student_profile, as: :belongs_to
    field :quiz, as: :belongs_to
    field :quiz_responses, as: :has_many
  end
end
