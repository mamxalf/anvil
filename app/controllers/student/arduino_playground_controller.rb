module Student
  class ArduinoPlaygroundController < ApplicationController
    before_action :authenticate_user!
    before_action :require_student

    def index
      @sketches = current_student_profile.arduino_sketches.order(updated_at: :desc)
      @current_sketch = @sketches.first || ArduinoSketch.new(
        name: "Blink",
        code: default_blink_code
      )

      render inertia: "Student/ArduinoPlayground/Index", props: {
        sketches: @sketches.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml, :updated_at ]),
        currentSketch: @current_sketch.as_json(only: [ :id, :name, :code, :board_type, :modules, :blocks_xml ])
      }
    end

    private

    def require_student
      redirect_to root_path, alert: "Access denied" unless current_user&.student?
    end

    def current_student_profile
      current_user.student_profile
    end

    def default_blink_code
      <<~ARDUINO
        // Blink LED on Pin 13
        void setup() {
          pinMode(13, OUTPUT);
        }

        void loop() {
          digitalWrite(13, HIGH);
          delay(1000);
          digitalWrite(13, LOW);
          delay(1000);
        }
      ARDUINO
    end
  end
end
