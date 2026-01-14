class Parent::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_parent!
  before_action :set_course, only: [ :show, :curriculum ]

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

  def show
    render inertia: "Parent/Courses/Show", props: {
      course: @course.as_json(
        only: [ :id, :title, :description, :level, :subject, :status ],
        methods: [ :total_lessons, :total_duration_minutes ]
      ).merge({
        thumbnail: @course.thumbnail.attached? ? url_for(@course.thumbnail) : nil
      }),
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons)
    }
  end

  def curriculum
    render inertia: "Parent/Courses/Curriculum", props: {
      course: @course,
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons)
    }
  end

  private

  def set_course
    @course = Course.find_by(slug: params[:id]) || Course.find(params[:id])
  end

  def ensure_parent!
    unless current_user.parent?
      redirect_to root_path, alert: "Access denied. Parents only."
    end
  end
end
