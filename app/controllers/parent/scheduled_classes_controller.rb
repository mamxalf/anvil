class Parent::ScheduledClassesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_parent!
  before_action :set_scheduled_class, only: [ :show ]

  def index
    start_date = params[:start_date]&.to_date || Date.current.beginning_of_month
    end_date = params[:end_date]&.to_date || Date.current.end_of_month

    @events = CalendarService.events_for_user(current_user, start_date: start_date, end_date: end_date)

    render inertia: "Parent/Calendar/Index", props: {
      events: @events,
      currentMonth: start_date.strftime("%Y-%m")
    }
  end

  def show
    render inertia: "Parent/Calendar/Show", props: {
      scheduledClass: @scheduled_class.as_json(
        include: { course: { only: [ :id, :title, :slug ] }, instructor_profile: { include: { user: { only: [ :name, :avatar ] } } } },
        methods: [ :spots_remaining, :in_progress?, :upcoming? ]
      )
    }
  end

  private

  def set_scheduled_class
    @scheduled_class = ScheduledClass.find(params[:id])
  end

  def ensure_parent!
    unless current_user.parent?
      redirect_to root_path, alert: "Access denied. Parents only."
    end
  end
end
