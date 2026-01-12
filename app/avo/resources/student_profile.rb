class Avo::Resources::StudentProfile < Avo::BaseResource
  self.title = :id
  self.includes = [:user, :badges]

  def fields
    field :id, as: :id
    field :user, as: :belongs_to
    field :birth_date, as: :date
    field :grade_level, as: :text
    field :total_points, as: :number
    field :current_streak, as: :number
    field :longest_streak, as: :number
    field :level, as: :number
    field :last_activity_at, as: :date_time
    field :created_at, as: :date_time, sortable: true
    field :updated_at, as: :date_time, sortable: true
  end
end
