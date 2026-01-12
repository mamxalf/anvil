class Avo::Resources::Notification < Avo::BaseResource
  self.title = :title
  self.includes = [ :user ]

  def fields
    field :id, as: :id
    field :user, as: :belongs_to
    field :title, as: :text
    field :message, as: :textarea
    field :notification_type, as: :select, enum: ::Notification.notification_types
    field :read_at, as: :date_time
    field :data, as: :code, language: "json"
    field :created_at, as: :date_time, sortable: true
  end
end
