# frozen_string_literal: true

module Api
  class ArduinoCompilerController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :authenticate_user!

    COMPILER_URL = ENV.fetch("ARDUINO_COMPILER_URL", "http://localhost:4567")
    SUPPORTED_BOARDS = %w[uno nano mega].freeze

    # POST /api/arduino/compile
    def compile
      code = params[:code]
      board = params[:board] || "uno"

      # Validations
      if code.blank?
        return render json: { error: "Code is required" }, status: :bad_request
      end

      unless SUPPORTED_BOARDS.include?(board)
        return render json: {
          error: "Invalid board. Supported boards: #{SUPPORTED_BOARDS.join(', ')}"
        }, status: :bad_request
      end

      # Check for basic Arduino structure
      unless code.include?("void setup") && code.include?("void loop")
        return render json: {
          error: "Invalid Arduino sketch. Must contain void setup() and void loop() functions."
        }, status: :unprocessable_entity
      end

      # Forward to compiler service
      result = compile_with_service(code, board)

      # Check for service errors
      if result[:service_error]
        return render json: {
          success: false,
          error: result[:error],
          details: result[:details]
        }, status: :service_unavailable
      end

      if result[:success]
        render json: {
          success: true,
          hex: result[:hex],
          board: board,
          message: "Compilation successful"
        }
      else
        render json: {
          success: false,
          error: result[:error],
          details: result[:details]
        }, status: :unprocessable_entity
      end
    rescue StandardError => e
      Rails.logger.error("Arduino compilation error: #{e.message}")
      render json: {
        success: false,
        error: "Compilation service unavailable",
        details: e.message
      }, status: :service_unavailable
    end

    private

    def compile_with_service(code, board)
      uri = URI("#{COMPILER_URL}/compile")
      http = Net::HTTP.new(uri.host, uri.port)
      http.open_timeout = 5
      http.read_timeout = 30

      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request.body = { code: code, board: board }.to_json

      response = http.request(request)
      JSON.parse(response.body, symbolize_names: true)
    rescue Errno::ECONNREFUSED, Net::OpenTimeout
      {
        success: false,
        service_error: true,
        error: "Arduino compiler service is not running",
        details: "Please ensure docker-compose is running with the arduino-compiler service."
      }
    end
  end
end
