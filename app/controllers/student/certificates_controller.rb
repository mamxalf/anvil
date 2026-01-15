class Student::CertificatesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_certificate

  def show
    authorize @certificate.course_enrollment, :show?

    respond_to do |format|
      format.html { render layout: false }
      format.pdf do
        render pdf: "certificate_#{@certificate.certificate_number}",
               template: "student/certificates/show",
               formats: [ :html ],
               layout: "layouts/pdf",
               disposition: "attachment",
               page_size: "A4",
               orientation: "Landscape",
               margin: { top: 0, bottom: 0, left: 0, right: 0 },
               disable_smart_shrinking: true,
               zoom: 1,
               dpi: 96
      end
    end
  end

  private

  def set_certificate
    @certificate = current_user.student_profile.course_enrollments
                              .joins(:certificate)
                              .find(params[:enrollment_id])
                              .certificate
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
