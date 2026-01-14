class Student::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_course, only: [ :show, :curriculum, :learn, :enroll ]

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

  def show
    authorize @course

    is_enrolled = @course.course_enrollments.exists?(student_profile: current_user.student_profile)

    render inertia: "Student/Courses/Show", props: {
      course: @course.as_json(
        only: [ :id, :title, :description, :level, :subject, :status ],
        methods: [ :total_lessons, :total_duration_minutes ]
      ).merge({
        thumbnail: @course.thumbnail.attached? ? url_for(@course.thumbnail) : nil
      }),
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons),
      isEnrolled: is_enrolled,
      canEdit: false
    }
  end

  def curriculum
    authorize @course, :show?
    render inertia: "Student/Courses/Curriculum", props: {
      course: @course,
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons)
    }
  end

  def learn
    authorize @course, :show?

    unless @course.course_enrollments.exists?(student_profile: current_user.student_profile)
      redirect_to student_course_path(@course), alert: "You must enroll first."
      return
    end

    @current_lesson = if params[:lesson_id]
      @course.lessons.find(params[:lesson_id])
    else
      @course.course_modules.order(:position).first&.lessons&.order(:position)&.first
    end

    completed_lesson_ids = current_user.student_profile.lesson_progresses.where(lesson: @course.lessons).pluck(:lesson_id)

    render inertia: "Student/Courses/Learn", props: {
      course: @course,
      modules: @course.course_modules.includes(:lessons).order(:position).map { |mod|
        {
          id: mod.id,
          title: mod.title,
          lessons: mod.lessons.order(:position).map { |les|
            {
              id: les.id,
              title: les.title,
              duration_minutes: les.duration_minutes,
              isCompleted: completed_lesson_ids.include?(les.id),
              isCurrent: @current_lesson&.id == les.id
            }
          }
        }
      },
      currentLesson: @current_lesson ? {
        id: @current_lesson.id,
        module_id: @current_lesson.course_module_id,
        title: @current_lesson.title,
        video_url: @current_lesson.video_url,
        content: @current_lesson.content,
        xp_reward: @current_lesson.xp_reward
      } : nil
    }
  end

  def enroll
    authorize @course, :show?

    if @course.course_enrollments.create(student_profile: current_user.student_profile)
      redirect_to learn_student_course_path(@course), notice: "Enrolled!"
    else
      redirect_to student_course_path(@course), alert: "Could not enroll."
    end
  end

  private

  def set_course
    @course = Course.find_by(slug: params[:id]) || Course.find(params[:id])
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
