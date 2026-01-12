class Question < ApplicationRecord
  belongs_to :quiz

  has_many :answers, dependent: :destroy
  has_many :quiz_responses, dependent: :destroy

  # Question types
  enum :question_type, { multiple_choice: 0, true_false: 1, fill_in: 2 }

  # Validations
  validates :content, presence: true
  validates :points, numericality: { greater_than_or_equal_to: 0 }
  validates :position, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :ordered, -> { order(:position) }

  # Get the correct answer(s)
  def correct_answers
    answers.where(is_correct: true)
  end

  # Check if a given answer is correct
  def correct?(answer_or_text)
    case question_type
    when "multiple_choice", "true_false"
      return false unless answer_or_text.is_a?(Answer)
      answer_or_text.is_correct?
    when "fill_in"
      return false unless answer_or_text.is_a?(String)
      # Case-insensitive comparison with trim
      correct_answers.any? { |a| a.content.strip.downcase == answer_or_text.strip.downcase }
    end
  end

  # Build default answers for true/false
  def setup_true_false!(correct_answer:)
    return unless true_false?

    answers.create!(content: I18n.t("quiz.true"), is_correct: correct_answer == true, position: 0)
    answers.create!(content: I18n.t("quiz.false"), is_correct: correct_answer == false, position: 1)
  end
end
