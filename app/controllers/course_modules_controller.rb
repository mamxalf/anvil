class CourseModulesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course
  before_action :set_module, only: [ :update, :destroy ]

  def create
    authorize @course, :update?
    @module = @course.course_modules.build(module_params)
    @module.position = @course.course_modules.count + 1

    if @module.save
      redirect_back fallback_location: curriculum_course_path(@course), notice: "Module created."
    else
      redirect_back fallback_location: curriculum_course_path(@course), alert: "Failed to create module."
    end
  end

  def update
    authorize @course, :update?
    if @module.update(module_params)
      redirect_back fallback_location: curriculum_course_path(@course), notice: "Module updated."
    else
      redirect_back fallback_location: curriculum_course_path(@course), alert: "Update failed."
    end
  end

  def destroy
    authorize @course, :update?
    @module.destroy
    redirect_back fallback_location: curriculum_course_path(@course), notice: "Module deleted."
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  end

  def set_module
    @module = @course.course_modules.find(params[:id])
  end

  def module_params
    params.require(:course_module).permit(:title, :description, :unlock_after_module_id)
  end
end
