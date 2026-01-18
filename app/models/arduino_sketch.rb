class ArduinoSketch < ApplicationRecord
  belongs_to :student_profile

  scope :published, -> { where(published: true) }

  validates :name, presence: true
  validates :code, presence: true
end
