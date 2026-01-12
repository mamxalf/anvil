class CoursesController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]

  before_action :set_course, only: [:show, :edit, :update, :destroy]

  def index
    @courses = Course.published.includes(instructor: :user)
    
    render inertia: "Courses/Index", props: {
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

  # ...



  def learn
    authorize @course, :show? # Or :learn? if policy has it. :show? usually implies access if enrolled.
    
    # Ensure enrolled
    unless @course.course_enrollments.exists?(student_profile: current_user.student_profile)
      redirect_to course_path(@course), alert: "You must enroll first."
      return
    end

    @current_lesson = if params[:lesson_id]
      @course.lessons.find(params[:lesson_id])
    else
      # Find first uncompleted lesson or just first lesson
      # Simplified: First lesson of first module
      @course.course_modules.order(:position).first&.lessons&.order(:position)&.first
    end

    # Fetch progress
    completed_lesson_ids = current_user.student_profile.lesson_progresses.where(lesson: @course.lessons).pluck(:lesson_id)

    render inertia: "Courses/Learn", props: {
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
    authorize @course, :show? # Check if user can view course (and thus enroll)
    
    if @course.course_enrollments.create(student_profile: current_user.student_profile)
      redirect_to learn_course_path(@course), notice: "Enrolled!"
    else
      redirect_to course_path(@course), alert: "Could not enroll."
    end
  end

  def show
    authorize @course
    
    is_enrolled = current_user&.student? ? @course.course_enrollments.exists?(student_profile: current_user.student_profile) : false
    
    render inertia: "Courses/Show", props: {
      course: @course.as_json(
        only: [:id, :title, :description, :level, :subject, :status], 
        methods: [:total_lessons, :total_duration_minutes]
      ).merge({
        thumbnail: @course.thumbnail.attached? ? url_for(@course.thumbnail) : nil
      }),
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons),
      isEnrolled: is_enrolled,
      canEdit: policy(@course).edit?
    }
  end

  def new
    authorize Course
    render inertia: "Courses/Form", props: {
      course: Course.new,
      isEditing: false
    }
  end

  def create
    authorize Course
    @course = current_user.instructor_profile.courses.build(course_params)
    
    if @course.save
      redirect_to course_path(@course), notice: "Course created successfully."
    else
      redirect_to new_course_path, alert: @course.errors.full_messages.join(", ")
    end
  end

  def edit
    authorize @course
    render inertia: "Courses/Form", props: {
      course: @course,
      isEditing: true
    }
  end

  def curriculum
    authorize @course, :update?
    render inertia: "Courses/Curriculum", props: {
      course: @course,
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons)
    }
  end
  
  def update
    authorize @course
    if @course.update(course_params)
      redirect_to course_path(@course), notice: "Course updated."
    else
      redirect_to edit_course_path(@course), alert: "Update failed."
    end
  end

  private

  def set_course
    @course = Course.find_by(slug: params[:id]) || Course.find(params[:id])
  end

  def course_params
    params.require(:course).permit(:title, :description, :level, :subject, :status, :thumbnail)
  end
end
