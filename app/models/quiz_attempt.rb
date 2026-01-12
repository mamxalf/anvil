class QuizAttempt < ApplicationRecord
  belongs_to :student_profile
  belongs_to :quiz

  has_many :quiz_responses, dependent: :destroy

  # Validations
  validates :started_at, presence: true
  validates :score, numericality: { greater_than_or_equal_to: 0 }
  validates :xp_earned, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :completed, -> { where.not(completed_at: nil) }
  scope :in_progress, -> { where(completed_at: nil) }
  scope :passed, -> { where(passed: true) }
  scope :recent, -> { order(created_at: :desc) }

  def completed?
    completed_at.present?
  end

  def in_progress?
    completed_at.nil?
  end

  # Submit an answer for a question
  def submit_answer!(question, answer: nil, text_response: nil)
    return if completed?

    is_correct = question.correct?(answer || text_response)

    quiz_responses.create!(
      question: question,
      answer: answer,
      text_response: text_response,
      is_correct: is_correct
    )
  end

  # Calculate and finalize the quiz attempt
  def complete!
    return if completed?

    total_points = quiz.total_points
    earned_points = quiz_responses.where(is_correct: true)
                                  .joins(:question)
                                  .sum("questions.points")

    percentage_score = total_points > 0 ? (earned_points.to_f / total_points * 100).round : 0
    is_passed = percentage_score >= quiz.passing_score

    xp = is_passed ? quiz.xp_reward : (quiz.xp_reward * 0.25).to_i # 25% XP for failing

    update!(
      completed_at: Time.current,
      score: percentage_score,
      passed: is_passed,
      xp_earned: xp
    )

    # Award XP to student
    student_profile.add_points(xp)
    student_profile.record_activity!

    # Notify about passing
    if is_passed
      Notification.create!(
        user: student_profile.user,
        title: I18n.t("notifications.quiz_passed.title"),
        message: I18n.t("notifications.quiz_passed.message", quiz_name: quiz.title, score: percentage_score),
        notification_type: :quiz_passed,
        data: { quiz_id: quiz.id, score: percentage_score }
      )

      # Also complete the lesson if quiz passed
      quiz.lesson.complete!(student_profile) unless quiz.lesson.completed_by?(student_profile)
    end
  end

  # Check if time limit exceeded
  def time_limit_exceeded?
    return false if quiz.time_limit_minutes.nil?
    return false if completed?

    Time.current > started_at + quiz.time_limit_minutes.minutes
  end

  # Remaining time in seconds
  def remaining_time_seconds
    return nil if quiz.time_limit_minutes.nil?
    return 0 if completed?

    remaining = (started_at + quiz.time_limit_minutes.minutes) - Time.current
    [remaining.to_i, 0].max
  end
end
