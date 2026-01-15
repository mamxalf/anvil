require 'rails_helper'

RSpec.describe "Student Certificate", type: :system do
  before do
    driven_by(:playwright)
  end

  let(:student) { create(:user, role: 'student') }
  let(:student_profile) { create(:student_profile, user: student) }
  let(:course) { create(:course, title: "Ruby Basics", status: :published) }
  let(:course_module) { create(:course_module, course: course) }
  let!(:lesson) { create(:lesson, course_module: course_module, title: "Intro to Ruby") }

  describe "Certificate Display" do
    context "when course is completed with certificate" do
      let!(:enrollment) do
        create(:course_enrollment,
               student_profile: student_profile,
               course: course,
               status: :completed,
               progress_percentage: 100,
               completed_at: Time.current)
      end
      let!(:certificate) do
        create(:certificate,
               course_enrollment: enrollment,
               certificate_number: "KODI-TEST-1234-20260115",
               issued_at: Time.current)
      end

      it "displays download certificate button" do
        sign_in student, scope: :user
        visit student_course_path(course)

        expect(page).to have_content("Download Certificate")
        expect(page).to have_content("Relearn Course")
      end

      it "shows 100% progress" do
        sign_in student, scope: :user
        visit student_course_path(course)

        expect(page).to have_content("100%")
      end
    end

    context "when course is in progress without certificate" do
      let!(:enrollment) do
        create(:course_enrollment,
               student_profile: student_profile,
               course: course,
               status: :active,
               progress_percentage: 50)
      end

      it "displays continue learning button" do
        sign_in student, scope: :user
        visit student_course_path(course)

        expect(page).to have_content("Continue Learning")
        expect(page).not_to have_content("Download Certificate")
      end
    end
  end

  describe "Certificate Download" do
    context "when certificate exists" do
      let!(:enrollment) do
        create(:course_enrollment,
               student_profile: student_profile,
               course: course,
               status: :completed,
               progress_percentage: 100,
               completed_at: Time.current)
      end
      let!(:certificate) do
        create(:certificate,
               course_enrollment: enrollment,
               certificate_number: "KODI-TEST-5678-20260115",
               issued_at: Time.current)
      end

      it "has a download link on the course page", skip: "PDF download tested via request spec - Playwright can't handle file downloads" do
        sign_in student, scope: :user
        visit student_course_path(course)

        expect(page).to have_link("Download Certificate")
      end
    end
  end
end
