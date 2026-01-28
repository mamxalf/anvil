module Api
  class MazeAttemptsController < ApplicationController
    skip_before_action :verify_authenticity_token

    before_action :authenticate_user!

    before_action :set_lesson, only: [ :create ]
    before_action :set_attempt, only: [ :show, :update, :complete, :sync ]

    # POST /api/maze_attempts
    def create
      @attempt = MazeAttempt.find_or_initialize_by(
        lesson: @lesson,
        student_profile: current_user.student_profile,
        status: :in_progress
      )

      if @attempt.save
        render json: @attempt, status: :created
      else
        render json: { errors: @attempt.errors }, status: :unprocessable_entity
      end
    end

    # GET /api/maze_attempts/active?lesson_id=:lesson_id
    def active
      @attempt = current_user.student_profile.maze_attempts
        .find_by(lesson_id: params[:lesson_id], status: :in_progress)

      if @attempt
        render json: @attempt
      else
        render json: { active_attempt: nil }, status: :ok
      end
    end

    # GET /api/maze_attempts/:id
    def show
      render json: @attempt
    end

    # POST /api/maze_attempts/:id/complete
    def complete
      if @attempt.update(attempt_params)
        @attempt.calculate_stars!
        @attempt.update!(status: :completed, completed_at: Time.current)

        # Award XP
        xp_multiplier = @attempt.stars_earned
        total_xp = @attempt.lesson.xp_reward * xp_multiplier
        current_user.student_profile.add_points(total_xp)
        current_user.student_profile.record_activity!

        render json: {
          attempt: @attempt,
          xp_earned: total_xp,
          lesson_completed: true
        }
      else
        render json: { errors: @attempt.errors }, status: :unprocessable_entity
      end
    end

    # POST /api/maze_attempts/:id/sync
    def sync
      if @attempt.update(attempt_params)
        render json: @attempt
      else
        render json: { errors: @attempt.errors }, status: :unprocessable_entity
      end
    end

    private

    def set_lesson
      lesson_id = params[:lesson_id] || params.dig(:maze_attempt, :lesson_id)

      @lesson = Lesson.where(id: lesson_id).first

      return if @lesson

      render json: { error: "Lesson not found", lesson_id: lesson_id }, status: :not_found
    end

    def set_attempt
      @attempt = current_user.student_profile.maze_attempts.find(params[:id])
    end

    def attempt_params
      params.require(:maze_attempt).permit(:lesson_id, :blocks_used, :time_elapsed_seconds, :failed_runs)
    end
  end
end
