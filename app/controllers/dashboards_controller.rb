class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize :dashboard

    props = {
      user: current_user.as_json(only: [ :id, :name, :email, :role ])
    }

    if current_user.student? && current_user.student_profile
      profile = current_user.student_profile
      props[:studentProfile] = profile.as_json(only: [ :level, :total_points, :current_streak, :rank_name ])

      props[:recentBadges] = profile.badges.order(created_at: :desc).limit(3).map do |badge|
        { name: badge.name, icon: badge.icon, earned_at: badge.created_at }
      end

      props[:courses] = profile.course_enrollments.includes(course: { thumbnail_attachment: :blob }).map do |enrollment|
        {
          id: enrollment.course.id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail.attached? ? url_for(enrollment.course.thumbnail) : nil,
          progress: enrollment.progress_percentage
        }
      end

      props[:upcomingClasses] = []

    elsif current_user.instructor? && current_user.instructor_profile
      profile = current_user.instructor_profile
      props[:instructorProfile] = profile.as_json(only: [ :bio, :expertise ])

      # Fetch instructor courses with stats
      props[:courses] = Course.where(instructor: profile).includes(:course_enrollments).map do |course|
        {
          id: course.id,
          title: course.title,
          status: course.status,
          enrolled_count: course.enrolled_count
        }
      end

    elsif current_user.parent?
      # Fetch children data
      props[:children_profiles] = current_user.children.includes(:student_profile).map do |child|
        profile = child.student_profile
        {
          id: child.id,
          name: child.name,
          level: profile&.level || 0,
          points: profile&.total_points || 0,
          avatar_url: child.avatar_url
        }
      end
    end

    render inertia: "Dashboard/Index", props: props
  end
end
