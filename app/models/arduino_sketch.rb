class ArduinoSketch < ApplicationRecord
  belongs_to :student_profile

  validates :name, presence: true
  validates :code, presence: true
end
