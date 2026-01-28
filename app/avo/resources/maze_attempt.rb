class Avo::Resources::MazeAttempt < Avo::BaseResource
  self.includes = [ :lesson, :student_profile ]

  def fields
    field :id, as: :id
    field :lesson, as: :belongs_to
    field :student_profile, as: :belongs_to, name: "Student"

    field :status, as: :select, enum: ::MazeAttempt.statuses

    # Performance stats
    field :blocks_used, as: :number, name: "Blocks Used"
    field :time_elapsed_seconds, as: :number, name: "Time (seconds)"
    field :failed_runs, as: :number, name: "Failed Runs"
    field :stars_earned, as: :number, name: "Stars Earned"

    # Timestamps
    field :created_at, as: :date_time, name: "Started At"
    field :completed_at, as: :date_time, name: "Completed At"
    field :updated_at, as: :date_time, name: "Updated At"
  end
end
