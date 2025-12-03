class TargetGroupNutritionRequirement < ApplicationRecord
  belongs_to :target_group

  validates :profile_key, presence: true
  validates :energy, :protein, :fat, :carbohydrate, :fiber,
            numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  def to_profile_hash
    {
      energy: energy,
      protein: protein,
      fat: fat,
      carbohydrate: carbohydrate,
      fiber: fiber
    }
  end
end


