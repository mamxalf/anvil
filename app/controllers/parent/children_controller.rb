module Parent
  class ChildrenController < ApplicationController
    before_action :authenticate_user!
    before_action :ensure_parent!
    before_action :set_child, only: [ :show ]

    def index
      # Redirect to dashboard as it holds the list
      redirect_to dashboard_path
    end

    def new
      authorize :parent_dashboard, :access? # Assuming a policy for parent access
      render inertia: "Parent/AddChild", props: {}
    end

    def create
      authorize :parent_dashboard, :access?

      # Logic to create a child account (User + StudentProfile)
      # Simplified: Parent creates a child account directly

      User.transaction do
        @child = User.new(child_params)
        @child.role = :student
        @child.password = "kodilearn123" # Default, change later
        @child.password_confirmation = "kodilearn123"

        if @child.save
          # Create relationship
          ParentChild.create!(parent: current_user, child: @child)

          # Initialize student profile stats if needed (done by callback but we can customize)
          @child.student_profile.update(birth_date: params[:birth_date]) if params[:birth_date].present?

          redirect_to dashboard_path, notice: "Child account created successfully!"
        else
          redirect_to new_parent_child_path, alert: @child.errors.full_messages.join(", ")
        end
      end
    end

    def show
      authorize :parent_dashboard, :access?

      profile = @child.student_profile

      render inertia: "Parent/ChildReport", props: {
        child: {
          id: @child.id,
          name: @child.name,
          email: @child.email,
          avatar_url: @child.avatar_url,
          level: profile.level,
          totalpoints: profile.total_points,
          streak: profile.current_streak,
          joined_at: @child.created_at
        },
        recentActivity: profile.lesson_progresses.includes(lesson: { course_module: :course }).order(updated_at: :desc).limit(5).map { |p|
          {
            id: p.id,
            lesson_title: p.lesson.title,
            course_title: p.lesson.course_module.course.title,
            completed_at: p.completed_at,
            xp_earned: p.xp_earned
          }
        },
        enrollments: profile.course_enrollments.includes(:course).map { |e|
          {
            id: e.id,
            course_title: e.course.title,
            progress: e.progress_percentage,
            status: e.status
          }
        }
      }
    end

    private

    def ensure_parent!
      unless current_user.parent?
        redirect_to root_path, alert: "Access denied. Parents only."
      end
    end

    def set_child
      @child = current_user.children.find(params[:id])
    end

    def child_params
      params.require(:child).permit(:name, :email)
    end
  end
end
