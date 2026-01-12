class QuizResponse < ApplicationRecord
  belongs_to :quiz_attempt
  belongs_to :question
  belongs_to :answer, optional: true

  # Validations
  validates :question_id, uniqueness: { scope: :quiz_attempt_id }
  validate :answer_or_text_response_present

  # Delegate quiz access
  delegate :quiz, to: :quiz_attempt

  private

  def answer_or_text_response_present
    return if answer.present? || text_response.present?
    errors.add(:base, "Must provide either an answer or text response")
  end
end
