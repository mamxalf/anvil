class Avo::Resources::UserAchievement < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :student_profile, as: :belongs_to
    field :achievement, as: :belongs_to
    field :earned_at, as: :date_time
  end
end
