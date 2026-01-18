class Avo::Resources::ArduinoSketch < Avo::BaseResource
  # self.includes = []
  # self.attachments = []
  # self.search = {
  #   query: -> { query.ransack(id_eq: q, m: "or").result(distinct: false) }
  # }

  def fields
    field :id, as: :id
    field :name, as: :text
    field :code, as: :textarea
    field :student, as: :belongs_to
  end
end
