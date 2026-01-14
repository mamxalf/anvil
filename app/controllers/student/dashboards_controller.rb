class Student::DashboardsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!

  def index
    authorize :dashboard

    profile = current_user.student_profile

    props = {
      user: current_user.as_json(only: [ :id, :name, :email, :role ]),
      studentProfile: profile.as_json(only: [ :level, :total_points, :current_streak, :rank_name ]),
      recentBadges: profile.badges.order(created_at: :desc).limit(3).map do |badge|
        { name: badge.name, icon: badge.icon, earned_at: badge.created_at }
      end,
      courses: profile.course_enrollments.includes(course: { thumbnail_attachment: :blob }).map do |enrollment|
        {
          id: enrollment.course.id,
          title: enrollment.course.title,
          thumbnail: enrollment.course.thumbnail.attached? ? url_for(enrollment.course.thumbnail) : nil,
          progress: enrollment.progress_percentage
        }
      end,
      upcomingClasses: []
    }

    render inertia: "Student/Dashboard/Index", props: props
  end

  private

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
