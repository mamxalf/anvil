class Avo::Resources::Lesson < Avo::BaseResource
  self.includes = []

  def fields
    field :id, as: :id
    field :title, as: :text, link_to_record: true
    field :position, as: :number
    field :duration_minutes, as: :number, name: "Duration (minutes)"
    field :xp_reward, as: :number, name: "XP Reward"

    # Activity system fields
    field :activity_type, as: :select, enum: ::Lesson.activity_types
    field :activity_config, as: :code, name: "Activity Config (JSON)",
          format_using: -> { value.pretty_inspect },
          help: "JSON configuration for the activity. See example below for maze activities."

    # Example maze config (shown only for maze activities)
    field :maze_example, as: :heading, label: "Maze Activity Config Example" do
      show_if -> { record.activity_type == "maze" }
    end

    field :maze_config_example, as: :code, name: "Example Maze Config", readonly: true do
      if record.activity_type == "maze"
        <<~JSON
          {
            "maze_level": 1,
            "grid_size": [5, 5],
            "start_pos": [0, 0],
            "goal_pos": [4, 4],
            "obstacles": [[2, 2]],
            "optimal_blocks": 5,
            "optimal_time_seconds": 30,
            "available_blocks": ["forward", "turn_left", "turn_right", "repeat"],
            "character": "rabbit",
            "goal_item": "carrot"
          }
        JSON
      else
        "N/A (select 'maze' as activity type to see example)"
      end
    end

    # Rich text content
    field :content, as: :trix, name: "Lesson Content"

    # Video URL
    field :video_url, as: :text, name: "Video URL"

    # Course module relation
    field :course_module, as: :belongs_to
    field :course, as: :has_one, through: :course_module
    field :course_module_id, as: :text

    # Quiz and resources
    field :quiz, as: :has_one
    field :resources, as: :has_many
    field :lesson_progresses, as: :has_many, name: "Progress"

    # Hints relation (only for maze activities)
    field :lesson_hints, as: :has_many, name: "Hints" do
      show_if -> { record.activity_type == "maze" }
    end

    # Maze attempts (read-only)
    field :maze_attempts, as: :has_many, name: "Maze Attempts" do
      show_if -> { record.activity_type == "maze" }
      hide_on :index
    end
  end
end
