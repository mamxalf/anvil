class Parent::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_parent!

  def index
    @courses = Course.published.includes(instructor: :user)

    # Get children info to show which courses they're enrolled in
    @children = current_user.children.includes(:student_profile)
    children_enrollments = CourseEnrollment.where(student_profile: @children.map(&:student_profile).compact)
                                           .pluck(:course_id, :student_profile_id)
                                           .group_by(&:first)
                                           .transform_values { |v| v.map(&:last) }

    render inertia: "Parent/Courses/Index", props: {
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
          },
          enrolled_children_count: children_enrollments[course.id]&.size || 0
        }
      end,
      children: @children.map { |c| { id: c.id, name: c.name } }
    }
  end

  private

  def ensure_parent!
    unless current_user.parent?
      redirect_to root_path, alert: "Access denied. Parents only."
    end
  end
end
