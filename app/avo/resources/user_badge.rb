class Avo::Resources::UserBadge < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :student_profile_id, as: :text
    field :badge_id, as: :text
    field :earned_at, as: :date_time
    field :student_profile, as: :belongs_to
    field :badge, as: :belongs_to
  end
end
