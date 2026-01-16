# frozen_string_literal: true

class Portfolio < ApplicationRecord
  belongs_to :student_profile

  # Active Storage for images
  has_many_attached :images

  # Validations
  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true,
                   format: { with: /\A[a-z0-9-]+\z/, message: "can only contain lowercase letters, numbers, and hyphens" }
  validates :theme, presence: true

  # Available themes
  THEMES = %w[modern creative minimal dark colorful].freeze

  validates :theme, inclusion: { in: THEMES }

  # Callbacks
  before_validation :generate_slug, on: :create

  # Scopes
  scope :published, -> { where(published: true) }

  private

  def generate_slug
    return if slug.present?

    base_slug = title.to_s.parameterize
    unique_slug = base_slug
    counter = 1

    while Portfolio.exists?(slug: unique_slug)
      unique_slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    self.slug = unique_slug
  end
end
