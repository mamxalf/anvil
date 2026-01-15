# frozen_string_literal: true

class Student::QuizAttemptsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_quiz, only: [:create]
  before_action :set_quiz_attempt, only: [:show, :submit_answer, :complete]

  # POST /student/quizzes/:quiz_id/quiz_attempts
  def create
    if @quiz.can_attempt?(current_student_profile)
      @attempt = @quiz.start_attempt!(current_student_profile)
      render json: quiz_attempt_json(@attempt), status: :created
    else
      render json: { error: I18n.t("quiz.no_attempts_remaining") }, status: :unprocessable_entity
    end
  end

  # GET /student/quiz_attempts/:id
  def show
    render json: quiz_attempt_json(@attempt)
  end

  # POST /student/quiz_attempts/:id/submit_answer
  def submit_answer
    question = @attempt.quiz.questions.find(params[:question_id])

    if @attempt.quiz_responses.exists?(question: question)
      render json: { error: I18n.t("quiz.already_answered") }, status: :unprocessable_entity
      return
    end

    if params[:answer_id].present?
      answer = question.answers.find(params[:answer_id])
      @attempt.submit_answer!(question, answer: answer)
    else
      @attempt.submit_answer!(question, text_response: params[:text_response])
    end

    render json: { success: true, is_correct: question.correct?(answer || params[:text_response]) }
  end

  # POST /student/quiz_attempts/:id/complete
  def complete
    if @attempt.completed?
      render json: { error: I18n.t("quiz.already_completed") }, status: :unprocessable_entity
      return
    end

    @attempt.complete!

    render json: {
      success: true,
      score: @attempt.score,
      passed: @attempt.passed,
      xp_earned: @attempt.xp_earned,
      passing_score: @attempt.quiz.passing_score
    }
  end

  private

  def set_quiz
    @quiz = Quiz.find(params[:quiz_id])
  end

  def set_quiz_attempt
    @attempt = current_student_profile.quiz_attempts.find(params[:id])
  end

  def current_student_profile
    current_user.student_profile
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      render json: { error: "Access denied. Students only." }, status: :forbidden
    end
  end

  def quiz_attempt_json(attempt)
    {
      id: attempt.id,
      quiz_id: attempt.quiz_id,
      started_at: attempt.started_at,
      completed_at: attempt.completed_at,
      score: attempt.score,
      passed: attempt.passed,
      xp_earned: attempt.xp_earned,
      remaining_time_seconds: attempt.remaining_time_seconds,
      quiz: {
        id: attempt.quiz.id,
        title: attempt.quiz.title,
        description: attempt.quiz.description,
        passing_score: attempt.quiz.passing_score,
        time_limit_minutes: attempt.quiz.time_limit_minutes,
        xp_reward: attempt.quiz.xp_reward,
        questions: attempt.quiz.questions.ordered.map do |q|
          answered_response = attempt.quiz_responses.find_by(question: q)
          {
            id: q.id,
            content: q.content,
            question_type: q.question_type,
            points: q.points,
            hint: q.hint,
            answered: answered_response.present?,
            selected_answer_id: answered_response&.answer_id,
            answers: q.answers.ordered.map do |a|
              {
                id: a.id,
                content: a.content
              }
            end
          }
        end
      }
    }
  end
end
