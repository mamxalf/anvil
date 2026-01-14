class Avo::Resources::ClassRegistration < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :scheduled_class_id, as: :text
    field :student_profile_id, as: :text
    field :attended, as: :boolean
    field :reminder_sent, as: :boolean
    field :scheduled_class, as: :belongs_to
    field :student_profile, as: :belongs_to
  end
end
