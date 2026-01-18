#!/usr/bin/env ruby
# frozen_string_literal: true

require 'webrick'
require 'json'
require 'fileutils'
require 'securerandom'
require 'open3'

# Simple HTTP server for Arduino compilation
class ArduinoCompilerServer
  BOARDS = {
    'uno' => 'arduino:avr:uno',
    'nano' => 'arduino:avr:nano',
    'mega' => 'arduino:avr:mega'
  }.freeze

  def initialize(port = 4567)
    @server = WEBrick::HTTPServer.new(Port: port)
    setup_routes
    trap('INT') { @server.shutdown }
  end

  def start
    puts "Arduino Compiler Server starting on port 4567..."
    @server.start
  end

  private

  def setup_routes
    @server.mount_proc '/health' do |_req, res|
      res['Content-Type'] = 'application/json'
      res.body = { status: 'ok' }.to_json
    end

    @server.mount_proc '/compile' do |req, res|
      handle_compile(req, res)
    end
  end

  def handle_compile(req, res)
    res['Content-Type'] = 'application/json'
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Content-Type'

    if req.request_method == 'OPTIONS'
      res.status = 200
      return
    end

    unless req.request_method == 'POST'
      res.status = 405
      res.body = { error: 'Method not allowed' }.to_json
      return
    end

    begin
      body = JSON.parse(req.body)
      code = body['code']
      board = body['board'] || 'uno'

      if code.nil? || code.strip.empty?
        res.status = 400
        res.body = { error: 'Code is required' }.to_json
        return
      end

      result = compile_sketch(code, board)
      res.status = result[:success] ? 200 : 422
      res.body = result.to_json
    rescue JSON::ParserError
      res.status = 400
      res.body = { error: 'Invalid JSON' }.to_json
    rescue StandardError => e
      res.status = 500
      res.body = { error: "Internal error: #{e.message}" }.to_json
    end
  end

  def compile_sketch(code, board)
    fqbn = BOARDS[board] || BOARDS['uno']
    sketch_id = SecureRandom.hex(8)
    sketch_dir = "/tmp/sketch_#{sketch_id}"
    sketch_file = "#{sketch_dir}/sketch_#{sketch_id}.ino"
    output_dir = "#{sketch_dir}/build"

    begin
      FileUtils.mkdir_p(sketch_dir)
      FileUtils.mkdir_p(output_dir)
      File.write(sketch_file, code)

      # Compile with arduino-cli
      cmd = [
        'arduino-cli', 'compile',
        '--fqbn', fqbn,
        '--output-dir', output_dir,
        '--warnings', 'none',
        sketch_dir
      ]

      stdout, stderr, status = Open3.capture3(*cmd)

      if status.success?
        # Find the hex file
        hex_file = Dir.glob("#{output_dir}/*.hex").first

        if hex_file && File.exist?(hex_file)
          hex_content = File.read(hex_file)
          {
            success: true,
            hex: hex_content,
            board: board,
            fqbn: fqbn,
            message: 'Compilation successful'
          }
        else
          {
            success: false,
            error: 'Hex file not generated',
            details: stdout + stderr
          }
        end
      else
        # Parse error messages for user-friendly display
        error_lines = (stdout + stderr).lines.select { |l| l.include?('error:') || l.include?('Error') }
        {
          success: false,
          error: 'Compilation failed',
          details: error_lines.join("\n").presence || stderr
        }
      end
    ensure
      FileUtils.rm_rf(sketch_dir) if Dir.exist?(sketch_dir)
    end
  end
end

# Start server
ArduinoCompilerServer.new.start
