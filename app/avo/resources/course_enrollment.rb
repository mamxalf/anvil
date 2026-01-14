class Avo::Resources::CourseEnrollment < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :student_profile_id, as: :text
    field :course_id, as: :text
    field :enrolled_by_id, as: :text
    field :status, as: :select, enum: ::CourseEnrollment.statuses
    field :progress_percentage, as: :number
    field :trial_expires_at, as: :date_time
    field :completed_at, as: :date_time
    field :student_profile, as: :belongs_to
    field :course, as: :belongs_to
    field :enrolled_by, as: :belongs_to
    field :certificate, as: :has_one
  end
end
