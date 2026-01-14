class Avo::Resources::LessonProgress < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :student_profile_id, as: :text
    field :lesson_id, as: :text
    field :started_at, as: :date_time
    field :completed_at, as: :date_time
    field :video_watch_percentage, as: :number
    field :xp_earned, as: :number
    field :student_profile, as: :belongs_to
    field :lesson, as: :belongs_to
  end
end
