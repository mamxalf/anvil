module Api
  class LessonHintsController < ApplicationController
    skip_before_action :verify_authenticity_token

    before_action :authenticate_user!
    before_action :set_lesson

    # GET /api/lessons/:lesson_id/hints
    def index
      @hints = @lesson.lesson_hints.ordered
      render json: @hints
    end

    private

    def set_lesson
      @lesson = Lesson.where(id: params[:lesson_id]).first

      return if @lesson

      render json: { error: "Lesson not found" }, status: :not_found
    end
  end
end
