class Avo::Resources::ContentRestriction < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :parent_child_id, as: :text
    field :max_course_level, as: :number
    field :allowed_subjects, as: :text
    field :require_approval_for_enrollment, as: :boolean
    field :parent_child, as: :belongs_to
  end
end
