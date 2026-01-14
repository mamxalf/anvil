class Avo::Resources::CourseModule < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :course_id, as: :text
    field :title, as: :text
    field :description, as: :textarea
    field :position, as: :number
    field :unlock_after_module_id, as: :text
    field :course, as: :belongs_to
    field :unlock_after_module, as: :belongs_to
    field :lessons, as: :has_many
    field :dependent_modules, as: :has_many
  end
end
