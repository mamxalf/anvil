# frozen_string_literal: true

class PublicPortfoliosController < ApplicationController
  def show
    @portfolio = Portfolio.published.find_by!(slug: params[:slug])
    @student = @portfolio.student_profile.user

    render inertia: "Public/Portfolio", props: {
      portfolio: {
        title: @portfolio.title,
        theme: @portfolio.theme,
        content: @portfolio.content
      },
      student: {
        name: @student.name,
        avatar: @student.avatar_url
      }
    }

  end
end
