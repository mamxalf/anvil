class Avo::Resources::InstructorProfile < Avo::BaseResource
  self.title = :id
  self.includes = [:user]

  def fields
    field :id, as: :id
    field :user, as: :belongs_to
    field :bio, as: :textarea
    field :expertise, as: :tags
    field :verified_at, as: :date_time
    field :created_at, as: :date_time, sortable: true
    field :updated_at, as: :date_time, sortable: true
  end

  def actions
    action Avo::Actions::VerifyInstructor
  end
end
