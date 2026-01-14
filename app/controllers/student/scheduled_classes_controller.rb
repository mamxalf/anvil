class Student::ScheduledClassesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_scheduled_class, only: [ :show, :register ]

  def index
    start_date = params[:start_date]&.to_date || Date.current.beginning_of_month
    end_date = params[:end_date]&.to_date || Date.current.end_of_month

    @events = CalendarService.events_for_user(current_user, start_date: start_date, end_date: end_date)
    @available_classes = CalendarService.available_classes(current_user.student_profile)

    render inertia: "Student/Calendar/Index", props: {
      events: @events,
      availableClasses: @available_classes,
      currentMonth: start_date.strftime("%Y-%m")
    }
  end

  def show
    render inertia: "Student/Calendar/Show", props: {
      scheduledClass: @scheduled_class.as_json(
        include: { course: { only: [ :id, :title, :slug ] }, instructor_profile: { include: { user: { only: [ :name, :avatar ] } } } },
        methods: [ :spots_remaining, :in_progress?, :upcoming? ]
      ),
      isRegistered: @scheduled_class.class_registrations.exists?(student_profile: current_user.student_profile)
    }
  end

  def register
    profile = current_user.student_profile
    return redirect_to student_scheduled_class_path(@scheduled_class), alert: "Only students can register" unless profile

    if @scheduled_class.register!(profile)
      redirect_to student_scheduled_class_path(@scheduled_class), notice: "Successfully registered!"
    else
      redirect_to student_scheduled_class_path(@scheduled_class), alert: "Could not register for this class"
    end
  end

  private

  def set_scheduled_class
    @scheduled_class = ScheduledClass.find(params[:id])
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
