class Avo::Resources::ParentChild < Avo::BaseResource
  self.title = :id
  self.includes = [ :parent, :child ]

  def fields
    field :id, as: :id
    field :parent, as: :belongs_to
    field :child, as: :belongs_to
    field :relationship_type, as: :text
    field :notifications_enabled, as: :boolean
    field :email_frequency, as: :select, enum: ::ParentChild.email_frequencies
    field :created_at, as: :date_time, sortable: true
    field :updated_at, as: :date_time, sortable: true
  end
end
