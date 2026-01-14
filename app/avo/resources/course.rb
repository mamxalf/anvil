class Avo::Resources::Course < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :instructor_id, as: :text
    field :title, as: :text
    field :description, as: :textarea
    field :level, as: :select, enum: ::Course.levels
    field :subject, as: :select, enum: ::Course.subjects
    field :status, as: :select, enum: ::Course.statuses
    field :enrollment_type, as: :select, enum: ::Course.enrollment_types
    field :trial_days, as: :number
    field :min_age, as: :number
    field :max_age, as: :number
    field :estimated_hours, as: :number
    field :thumbnail, as: :file
    field :slug, as: :text
    field :instructor, as: :belongs_to
    field :course_modules, as: :has_many
    field :lessons, as: :has_many, through: :course_modules
    field :course_enrollments, as: :has_many
    field :student_profiles, as: :has_many, through: :course_enrollments
    field :scheduled_classes, as: :has_many
  end
end
