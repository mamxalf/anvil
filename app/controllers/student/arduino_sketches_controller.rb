module Student
  class ArduinoSketchesController < ApplicationController
    before_action :authenticate_user!
    before_action :require_student
    before_action :set_sketch, only: [ :show, :update, :destroy ]

    def index
      sketches = current_student_profile.arduino_sketches.order(updated_at: :desc)
      render json: sketches.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml, :updated_at ])
    end

    def show
      render json: @sketch.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml, :updated_at ])
    end

    def create
      sketch = current_student_profile.arduino_sketches.build(sketch_params)

      if sketch.save
        render json: sketch.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml, :updated_at ]), status: :created
      else
        render json: { errors: sketch.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @sketch.update(sketch_params)
        render json: @sketch.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml, :updated_at ])
      else
        render json: { errors: @sketch.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @sketch.destroy
      head :no_content
    end

    private

    def require_student
      redirect_to root_path, alert: "Access denied" unless current_user&.student?
    end

    def current_student_profile
      current_user.student_profile
    end

    def set_sketch
      @sketch = current_student_profile.arduino_sketches.find(params[:id])
    end

    def sketch_params
      params.require(:arduino_sketch).permit(:name, :code, :board_type, :blocks_xml, modules: [ :id, :type, :pin, :name ])
    end
  end
end
