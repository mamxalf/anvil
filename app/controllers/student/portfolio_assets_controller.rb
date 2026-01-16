# frozen_string_literal: true

class Student::PortfolioAssetsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_portfolio

  def create
    if params[:image].present?
      @portfolio.images.attach(params[:image])
      blob = @portfolio.images.last.blob

      render json: {
        success: true,
        url: url_for(@portfolio.images.last),
        blobId: blob.id
      }
    else
      render json: { success: false, error: "No image provided" }, status: :unprocessable_entity
    end
  end

  def destroy
    attachment = @portfolio.images.find { |img| img.blob_id == params[:id] }

    if attachment
      attachment.purge
      render json: { success: true }
    else
      render json: { success: false, error: "Image not found" }, status: :not_found
    end
  end

  private

  def set_portfolio
    @portfolio = current_user.student_profile.portfolios.find(params[:portfolio_id])
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end
end
