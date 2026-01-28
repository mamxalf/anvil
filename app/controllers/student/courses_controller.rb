class Student::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_course, only: [ :show, :curriculum, :learn, :enroll ]

  def index
    @courses = Course.published.includes(instructor: :user)

    # Search
    if params[:search].present?
      @courses = @courses.where("title ILIKE ? OR description ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%")
    end

    # Filter by Subject
    if params[:filter].present? && params[:filter] != "all"
      @courses = @courses.where(subject: params[:filter])
    end

    # Sort
    case params[:sort]
    when "popular"
      # TODO: Implement better popularity metric (enrollments count)
      # For now, sorting by created_at asc as a placeholder or maybe random
      @courses = @courses.order(created_at: :asc)
    else # 'newest' or default
      @courses = @courses.order(created_at: :desc)
    end

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
      end,
      filters: {
        search: params[:search],
        filter: params[:filter],
        sort: params[:sort]
      }
    }
  end

  def show
    authorize @course

    is_enrolled = @course.course_enrollments.exists?(student_profile: current_user.student_profile)
    enrollment = @course.course_enrollments.find_by(student_profile: current_user.student_profile)
    progress_percentage = enrollment&.progress_percentage || 0

    # Certificate info
    certificate_url = nil
    if enrollment&.completed? && enrollment.certificate.present?
      certificate_url = student_enrollment_certificate_path(enrollment, format: :pdf)
    end

    render inertia: "Student/Courses/Show", props: {
      course: @course.as_json(
        only: [ :id, :title, :description, :level, :subject, :status ],
        methods: [ :total_lessons, :total_duration_minutes ]
      ).merge({
        instructor: {
          name: @course.instructor.user.name
        },
        thumbnail: @course.thumbnail.attached? ? url_for(@course.thumbnail) : nil
      }),
      modules: @course.course_modules.includes(:lessons).order(:position).as_json(include: :lessons),
      isEnrolled: is_enrolled,
      progressPercentage: progress_percentage,
      certificateUrl: certificate_url
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
    elsif params[:done].present?
      nil
    else
      @course.course_modules.order(:position).first&.lessons&.order(:position)&.first
    end

    completed_lesson_ids = current_user.student_profile.lesson_progresses.where(lesson: @course.lessons).pluck(:lesson_id)

    render inertia: "Student/Courses/Learn", props: {
      course: @course.as_json(
        only: [ :id, :title, :description, :level, :subject ],
        methods: [ :total_lessons, :total_duration_minutes ]
      ).merge({
        instructor: {
          name: @course.instructor.user.name
        }
      }),
      modules: @course.course_modules.includes(:lessons).order(:position).map { |mod|
        {
          id: mod.id,
          title: mod.title,
          lessons: mod.lessons.sort_by(&:position).map { |les|
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
      currentLesson: @current_lesson ? build_lesson_props(@current_lesson) : nil
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

  def build_lesson_props(lesson)
    quiz = lesson.quiz
    quiz_attempt = quiz ? current_user.student_profile.quiz_attempts.in_progress.find_by(quiz: quiz) : nil

    {
      id: lesson.id,
      module_id: lesson.course_module_id,
      title: lesson.title,
      video_url: lesson.youtube_embed_url,
      content: lesson.content.to_s,
      xp_reward: lesson.xp_reward,
      activity_type: lesson.activity_type,
      activity_config: lesson.activity_config,
      quiz: quiz ? {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        passing_score: quiz.passing_score,
        time_limit_minutes: quiz.time_limit_minutes,
        xp_reward: quiz.xp_reward,
        total_questions: quiz.questions.count,
        can_attempt: quiz.can_attempt?(current_user.student_profile),
        remaining_attempts: quiz.remaining_attempts(current_user.student_profile),
        passed: quiz.passed_by?(current_user.student_profile),
        best_score: quiz.best_attempt(current_user.student_profile)&.score,
        current_attempt_id: quiz_attempt&.id
      } : nil
    }
  end
end
