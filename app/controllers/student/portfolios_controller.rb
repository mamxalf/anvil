# frozen_string_literal: true

class Student::PortfoliosController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_student!
  before_action :set_portfolio, only: [:show, :update, :destroy]
  before_action :check_portfolio_limit, only: [:create]

  MAX_PORTFOLIOS = 3

  def index
    @portfolios = current_student_profile.portfolios.order(updated_at: :desc)

    render inertia: "Student/Portfolios/Index", props: {
      portfolios: @portfolios.map { |p| portfolio_json(p) },
      themes: Portfolio::THEMES,
      canCreate: current_student_profile.portfolios.count < MAX_PORTFOLIOS,
      maxPortfolios: MAX_PORTFOLIOS
    }
  end

  def show
    render inertia: "Student/Portfolios/Builder", props: {
      portfolio: portfolio_json(@portfolio),
      themes: Portfolio::THEMES
    }
  end

  def create
    @portfolio = current_student_profile.portfolios.build(portfolio_params)

    if @portfolio.save
      redirect_to student_portfolio_path(@portfolio), notice: "Portfolio created!"
    else
      redirect_to student_portfolios_path, alert: @portfolio.errors.full_messages.join(", ")
    end
  end

  def update
    # Parse content from JSON string if needed
    update_params = portfolio_params.to_h

    # Handle content as raw JSON
    if params[:portfolio][:content].present?
      update_params[:content] = params[:portfolio][:content]
    end

    if @portfolio.update(update_params)
      respond_to do |format|
        format.html { redirect_to student_portfolio_path(@portfolio), notice: "Portfolio saved!" }
        format.json { render json: { success: true, portfolio: portfolio_json(@portfolio) } }
      end
    else
      respond_to do |format|
        format.html { redirect_to student_portfolio_path(@portfolio), alert: @portfolio.errors.full_messages.join(", ") }
        format.json { render json: { success: false, errors: @portfolio.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @portfolio.destroy
    redirect_to student_portfolios_path, notice: "Portfolio deleted."
  end

  private

  def set_portfolio
    @portfolio = current_student_profile.portfolios.find(params[:id])
  end

  def current_student_profile
    current_user.student_profile
  end

  def ensure_student!
    unless current_user.student? && current_user.student_profile
      redirect_to root_path, alert: "Access denied. Students only."
    end
  end

  def check_portfolio_limit
    if current_student_profile.portfolios.count >= MAX_PORTFOLIOS
      redirect_to student_portfolios_path, alert: "You can only create up to #{MAX_PORTFOLIOS} portfolios."
    end
  end

  def portfolio_params
    params.require(:portfolio).permit(:title, :slug, :theme, :published)
  end

  def portfolio_json(portfolio)
    {
      id: portfolio.id,
      title: portfolio.title,
      slug: portfolio.slug,
      theme: portfolio.theme,
      content: portfolio.content,
      published: portfolio.published,
      publicUrl: portfolio.published ? public_portfolio_url(portfolio.slug) : nil,
      createdAt: portfolio.created_at.iso8601,
      updatedAt: portfolio.updated_at.iso8601
    }
  end
end
