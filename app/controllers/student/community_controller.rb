module Student
  class CommunityController < ApplicationController
    before_action :authenticate_user!
    before_action :require_student

    def index
      @published_sketches = ArduinoSketch.published
                                       .includes(:student_profile)
                                       .order(published_at: :desc)
                                       .page(params[:page])
                                       .per(12)

      props = {
        sketches: @published_sketches.map do |sketch|
          {
            id: sketch.id,
            name: sketch.name,
            board_type: sketch.board_type,
            published_at: sketch.published_at,
            author_name: sketch.student_profile.user.name,
            author_avatar: sketch.student_profile.user.avatar.present? ? url_for(sketch.student_profile.user.avatar) : nil
          }
        end,
        pagination: {
          current_page: @published_sketches.current_page,
          total_pages: @published_sketches.total_pages,
          prev_page: @published_sketches.prev_page,
          next_page: @published_sketches.next_page
        }
      }

      render inertia: "Student/Community/Index", props: props
    end

    def show
      @sketch = ArduinoSketch.published.find(params[:id])

      props = {
        sketch: @sketch.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml, :published_at ]),
        author: {
          name: @sketch.student_profile.user.name,
          avatar: @sketch.student_profile.user.avatar.present? ? url_for(@sketch.student_profile.user.avatar) : nil
        }
      }

      render inertia: "Student/Community/Show", props: props
    end

    private

    def require_student
      redirect_to root_path, alert: "Access denied" unless current_user&.student?
    end
  end
end
