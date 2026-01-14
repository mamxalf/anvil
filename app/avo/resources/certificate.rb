class Avo::Resources::Certificate < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :course_enrollment_id, as: :text
    field :certificate_number, as: :text
    field :issued_at, as: :date_time
    field :pdf_file, as: :file
    field :course_enrollment, as: :belongs_to
  end
end
