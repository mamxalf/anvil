class CalendarService
  # Fetch all scheduled classes within a given date range for a user
  # User can be student (shows their registered classes) or instructor (shows their classes)

  def self.events_for_user(user, start_date:, end_date:)
    if user.student?
      student_events(user.student_profile, start_date, end_date)
    elsif user.instructor?
      instructor_events(user.instructor_profile, start_date, end_date)
    elsif user.parent?
      parent_events(user, start_date, end_date)
    else
      []
    end
  end

  def self.student_events(profile, start_date, end_date)
    # Get registered classes
    registered_class_ids = profile.class_registrations.pluck(:scheduled_class_id)

    ScheduledClass
      .where(id: registered_class_ids)
      .where(scheduled_at: start_date.beginning_of_day..end_date.end_of_day)
      .order(:scheduled_at)
      .map { |sc| event_data(sc, :registered) }
  end

  def self.instructor_events(profile, start_date, end_date)
    ScheduledClass
      .where(instructor_profile: profile)
      .where(scheduled_at: start_date.beginning_of_day..end_date.end_of_day)
      .order(:scheduled_at)
      .map { |sc| event_data(sc, :teaching) }
  end

  def self.parent_events(user, start_date, end_date)
    # Aggregate events from all children
    user.children.flat_map do |child|
      child_profile = child.student_profile
      next [] unless child_profile

      student_events(child_profile, start_date, end_date).map do |event|
        event.merge(child_name: child.name)
      end
    end.sort_by { |e| e[:start] }
  end

  def self.event_data(scheduled_class, event_type)
    {
      id: scheduled_class.id,
      title: scheduled_class.title,
      description: scheduled_class.description,
      start: scheduled_class.scheduled_at.iso8601,
      end: scheduled_class.end_time.iso8601,
      course_id: scheduled_class.course_id,
      course_title: scheduled_class.course.title,
      instructor_name: scheduled_class.instructor.name,
      meeting_url: scheduled_class.meeting_url,
      event_type: event_type,
      in_progress: scheduled_class.in_progress?,
      spots_remaining: scheduled_class.spots_remaining
    }
  end

  # Get upcoming classes available to students (not yet registered)
  def self.available_classes(student_profile, limit: 10)
    ScheduledClass
      .upcoming
      .where.not(id: student_profile.class_registrations.pluck(:scheduled_class_id))
      .limit(limit)
      .map { |sc| event_data(sc, :available) }
  end
end
