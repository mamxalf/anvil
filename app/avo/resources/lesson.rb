class Avo::Resources::Lesson < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :course_module_id, as: :text
    field :title, as: :text
    field :content, as: :trix
    field :video_url, as: :text
    field :duration_minutes, as: :number
    field :position, as: :number
    field :xp_reward, as: :number
    field :course_module, as: :belongs_to
    field :quiz, as: :has_one
    field :resources, as: :has_many
    field :lesson_progresses, as: :has_many
  end
end
