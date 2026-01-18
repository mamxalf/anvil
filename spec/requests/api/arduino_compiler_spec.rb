# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::Arduino::Compile', type: :request do
  let(:user) { create(:user, :student) }
  let(:valid_code) do
    <<~ARDUINO
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

  let(:invalid_code_no_setup) do
    <<~ARDUINO
      void loop() {
        digitalWrite(13, HIGH);
      }
    ARDUINO
  end

  let(:invalid_code_syntax_error) do
    <<~ARDUINO
      void setup() {
        pinMode(13, OUTPUT)  // Missing semicolon
      }

      void loop() {
        digitalWrite(13, HIGH);
      }
    ARDUINO
  end

  let(:empty_code) { '' }
  let(:whitespace_only_code) { '   ' }

  describe 'POST /api/arduino/compile' do
    context 'when user is not authenticated' do
      it 'redirects to login' do
        post '/api/arduino/compile', params: { code: valid_code }
        expect(response).to have_http_status(:redirect)
      end
    end

    context 'when user is authenticated' do
      before { sign_in user }

      # ==========================================
      # Positive Test Cases
      # ==========================================

      context 'with valid Arduino code' do
        before do
          # Mock the compiler service response
          stub_request(:post, 'http://localhost:4567/compile')
            .with(
              body: { code: valid_code, board: 'uno' }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
            .to_return(
              status: 200,
              body: {
                success: true,
                hex: ':100000000C9434000C9446000C9446000C94460084',
                board: 'uno',
                fqbn: 'arduino:avr:uno',
                message: 'Compilation successful'
              }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'returns success with hex output' do
          post '/api/arduino/compile', params: { code: valid_code, board: 'uno' }

          expect(response).to have_http_status(:ok)
          json = JSON.parse(response.body)
          expect(json['success']).to be true
          expect(json['hex']).to be_present
          expect(json['board']).to eq('uno')
          expect(json['message']).to eq('Compilation successful')
        end
      end

      context 'with valid code and different boards' do
        %w[uno nano mega].each do |board|
          it "compiles successfully for #{board} board" do
            stub_request(:post, 'http://localhost:4567/compile')
              .with(body: hash_including(board: board))
              .to_return(
                status: 200,
                body: { success: true, hex: ':10000000', board: board }.to_json,
                headers: { 'Content-Type' => 'application/json' }
              )

            post '/api/arduino/compile', params: { code: valid_code, board: board }

            expect(response).to have_http_status(:ok)
            json = JSON.parse(response.body)
            expect(json['success']).to be true
            expect(json['board']).to eq(board)
          end
        end
      end

      context 'when board parameter is omitted' do
        it 'defaults to uno board' do
          stub_request(:post, 'http://localhost:4567/compile')
            .with(body: hash_including(board: 'uno'))
            .to_return(
              status: 200,
              body: { success: true, hex: ':10000000', board: 'uno' }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )

          post '/api/arduino/compile', params: { code: valid_code }

          expect(response).to have_http_status(:ok)
          json = JSON.parse(response.body)
          expect(json['board']).to eq('uno')
        end
      end

      # ==========================================
      # Negative Test Cases - Validation Errors
      # ==========================================

      context 'with empty code' do
        it 'returns bad request error' do
          post '/api/arduino/compile', params: { code: empty_code }

          expect(response).to have_http_status(:bad_request)
          json = JSON.parse(response.body)
          expect(json['error']).to eq('Code is required')
        end
      end

      context 'with whitespace-only code' do
        it 'returns bad request error' do
          post '/api/arduino/compile', params: { code: whitespace_only_code }

          expect(response).to have_http_status(:bad_request)
          json = JSON.parse(response.body)
          expect(json['error']).to eq('Code is required')
        end
      end

      context 'with missing code parameter' do
        it 'returns bad request error' do
          post '/api/arduino/compile', params: { board: 'uno' }

          expect(response).to have_http_status(:bad_request)
          json = JSON.parse(response.body)
          expect(json['error']).to eq('Code is required')
        end
      end

      context 'with invalid board type' do
        it 'returns bad request error' do
          post '/api/arduino/compile', params: { code: valid_code, board: 'invalid_board' }

          expect(response).to have_http_status(:bad_request)
          json = JSON.parse(response.body)
          expect(json['error']).to include('Invalid board')
          expect(json['error']).to include('uno, nano, mega')
        end
      end

      context 'with code missing setup function' do
        it 'returns unprocessable entity error' do
          post '/api/arduino/compile', params: { code: invalid_code_no_setup }

          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json['error']).to include('Invalid Arduino sketch')
          expect(json['error']).to include('void setup()')
        end
      end

      context 'with code missing loop function' do
        let(:code_no_loop) do
          <<~ARDUINO
            void setup() {
              pinMode(13, OUTPUT);
            }
          ARDUINO
        end

        it 'returns unprocessable entity error' do
          post '/api/arduino/compile', params: { code: code_no_loop }

          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json['error']).to include('Invalid Arduino sketch')
          expect(json['error']).to include('void loop()')
        end
      end

      # ==========================================
      # Negative Test Cases - Compilation Errors
      # ==========================================

      context 'with code containing syntax errors' do
        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_return(
              status: 422,
              body: {
                success: false,
                error: 'Compilation failed',
                details: "sketch.ino:3:25: error: expected ';' before '}' token"
              }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'returns unprocessable entity with error details' do
          post '/api/arduino/compile', params: { code: invalid_code_syntax_error }

          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json['success']).to be false
          expect(json['error']).to eq('Compilation failed')
          expect(json['details']).to include('error')
        end
      end

      context 'with code using undefined functions' do
        let(:code_undefined_function) do
          <<~ARDUINO
            void setup() {
              undefinedFunction();
            }

            void loop() {
            }
          ARDUINO
        end

        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_return(
              status: 422,
              body: {
                success: false,
                error: 'Compilation failed',
                details: "error: 'undefinedFunction' was not declared in this scope"
              }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'returns compilation error with details' do
          post '/api/arduino/compile', params: { code: code_undefined_function }

          expect(response).to have_http_status(:unprocessable_entity)
          json = JSON.parse(response.body)
          expect(json['success']).to be false
          expect(json['details']).to include('undefinedFunction')
        end
      end

      # ==========================================
      # Negative Test Cases - Service Errors
      # ==========================================

      context 'when compiler service is not running' do
        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_raise(Errno::ECONNREFUSED)
        end

        it 'returns service unavailable error' do
          post '/api/arduino/compile', params: { code: valid_code }

          expect(response).to have_http_status(:service_unavailable)
          json = JSON.parse(response.body)
          expect(json['success']).to be false
          expect(json['error']).to eq('Arduino compiler service is not running')
          expect(json['details']).to include('docker-compose')
        end
      end

      context 'when compiler service times out' do
        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_raise(Net::OpenTimeout)
        end

        it 'returns service unavailable error' do
          post '/api/arduino/compile', params: { code: valid_code }

          expect(response).to have_http_status(:service_unavailable)
          json = JSON.parse(response.body)
          expect(json['success']).to be false
          expect(json['error']).to eq('Arduino compiler service is not running')
        end
      end

      context 'when compiler service returns unexpected error' do
        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_return(
              status: 500,
              body: { error: 'Internal server error' }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'returns unprocessable entity' do
          post '/api/arduino/compile', params: { code: valid_code }

          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      # ==========================================
      # Edge Cases
      # ==========================================

      context 'with very long code' do
        let(:long_code) do
          delays = 100.times.map { '  delay(1);' }.join("\n")
          <<~ARDUINO
            void setup() {
              pinMode(13, OUTPUT);
            }

            void loop() {
              #{delays}
            }
          ARDUINO
        end

        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_return(
              status: 200,
              body: { success: true, hex: ':10000000', board: 'uno' }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'handles long code successfully' do
          post '/api/arduino/compile', params: { code: long_code }

          expect(response).to have_http_status(:ok)
        end
      end

      context 'with unicode characters in comments' do
        let(:unicode_code) do
          <<~ARDUINO
            // This is a comment with unicode: 日本語 🚀 émojis
            void setup() {
              pinMode(13, OUTPUT);
            }

            void loop() {
              digitalWrite(13, HIGH);
            }
          ARDUINO
        end

        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_return(
              status: 200,
              body: { success: true, hex: ':10000000', board: 'uno' }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'handles unicode characters' do
          post '/api/arduino/compile', params: { code: unicode_code }

          expect(response).to have_http_status(:ok)
        end
      end

      context 'with code containing includes' do
        let(:code_with_includes) do
          <<~ARDUINO
            #include <Servo.h>

            Servo myServo;

            void setup() {
              myServo.attach(9);
            }

            void loop() {
              myServo.write(90);
            }
          ARDUINO
        end

        before do
          stub_request(:post, 'http://localhost:4567/compile')
            .to_return(
              status: 200,
              body: { success: true, hex: ':10000000', board: 'uno' }.to_json,
              headers: { 'Content-Type' => 'application/json' }
            )
        end

        it 'handles code with library includes' do
          post '/api/arduino/compile', params: { code: code_with_includes }

          expect(response).to have_http_status(:ok)
        end
      end
    end
  end
end
