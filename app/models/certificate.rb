class Certificate < ApplicationRecord
  belongs_to :course_enrollment

  has_one_attached :pdf_file

  # Validations
  validates :certificate_number, presence: true, uniqueness: true
  validates :issued_at, presence: true

  # Scopes
  scope :recent, -> { order(issued_at: :desc) }

  # Delegate course and student info
  delegate :course, :student_profile, to: :course_enrollment

  def student_name
    student_profile.user.name
  end

  def course_title
    course.title
  end

  # Generate PDF certificate
  def generate_pdf!
    # Use Prawn or similar for PDF generation
    # This is a placeholder - actual implementation would use a PDF library
    pdf = generate_certificate_pdf
    pdf_file.attach(
      io: StringIO.new(pdf),
      filename: "certificate_#{certificate_number}.pdf",
      content_type: "application/pdf"
    )
  end

  def pdf_url
    return nil unless pdf_file.attached?
    Rails.application.routes.url_helpers.rails_blob_path(pdf_file, only_path: true)
  end

  private

  def generate_certificate_pdf
    # Placeholder - would use Prawn or similar
    # Returns PDF content as string
    <<~PDF
      Certificate of Completion

      This certifies that #{student_name}
      has successfully completed the course
      #{course_title}

      Certificate Number: #{certificate_number}
      Issued on: #{issued_at.strftime("%B %d, %Y")}
    PDF
  end
end
