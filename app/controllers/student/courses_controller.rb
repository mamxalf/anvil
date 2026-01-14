class Student::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!

  def index
    @courses = Course.published.includes(instructor: :user)

    render inertia: "Student/Courses/Index", props: {
      courses: @courses.map do |course|
        {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail: course.thumbnail.attached? ? url_for(course.thumbnail) : nil,
          level: course.level,
          subject: course.subject,
          instructor: {
            name: course.instructor.user.name
          }
        }
      end
    }
  end

  private

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
