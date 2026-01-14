class Avo::Resources::ScheduledClass < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :course_id, as: :text
    field :instructor_profile_id, as: :text
    field :title, as: :text
    field :description, as: :textarea
    field :scheduled_at, as: :date_time
    field :duration_minutes, as: :number
    field :meeting_url, as: :text
    field :max_participants, as: :number
    field :course, as: :belongs_to
    field :instructor_profile, as: :belongs_to
    field :class_registrations, as: :has_many
    field :student_profiles, as: :has_many, through: :class_registrations
  end
end
