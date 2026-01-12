class Resource < ApplicationRecord
  belongs_to :lesson

  has_one_attached :file

  enum :resource_type, { pdf: 0, worksheet: 1, image: 2, other: 3 }

  # Validations
  validates :title, presence: true

  # Scopes
  scope :by_type, ->(type) { where(resource_type: type) }

  # Increment download counter
  def record_download!
    increment!(:download_count)
  end

  # Get file URL for download
  def file_url
    return nil unless file.attached?
    Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)
  end

  # Get file size in human readable format
  def file_size
    return nil unless file.attached?
    file.byte_size
  end
end
