class Avo::Resources::LessonHint < Avo::BaseResource
  self.includes = []

  def fields
    field :id, as: :id
    field :lesson, as: :belongs_to
    field :tier, as: :select, enum: ::LessonHint.tiers
    field :content, as: :trix, name: "Hint Content"

    # Trigger config as code editor for JSON
    field :trigger_config, as: :code, name: "Trigger Config (JSON)",
          format_using: -> { value.pretty_inspect },
          help: <<~TEXT
          Configure when this hint should appear:
          - failed_runs_threshold: Show after N failed runs (default: 3)
          - time_threshold_seconds: Show after N seconds (default: 120)
          - show_immediately: Show on maze start (default: false)
          TEXT

    # Example trigger config
    field :trigger_example, as: :code, name: "Example Trigger Config", readonly: true do
      <<~JSON
      {
        "failed_runs_threshold": 3,
        "time_threshold_seconds": 120,
        "show_immediately": false
      }
      JSON
    end

    field :created_at, as: :date_time, name: "Created At"
    field :updated_at, as: :date_time, name: "Updated At"
  end
end
