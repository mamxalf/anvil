class Answer < ApplicationRecord
  belongs_to :question

  has_many :quiz_responses, dependent: :nullify

  # Validations
  validates :content, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }

  # Scopes
  scope :ordered, -> { order(:position) }
  scope :correct, -> { where(is_correct: true) }
  scope :incorrect, -> { where(is_correct: false) }
end
