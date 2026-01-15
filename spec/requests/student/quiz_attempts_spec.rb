# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Student::QuizAttempts", type: :request do
  let(:student) { create(:user, role: 'student') }
  let(:profile) { create(:student_profile, user: student) }
  let(:instructor) { create(:user, role: 'instructor') }
  let(:instructor_profile) { create(:instructor_profile, user: instructor) }
  let(:course) { create(:course, status: :published, instructor: instructor_profile) }
  let(:mod) { create(:course_module, course: course) }
  let(:lesson) { create(:lesson, course_module: mod) }
  let!(:enrollment) { create(:course_enrollment, student_profile: profile, course: course) }

  let(:quiz) do
    quiz = create(:quiz, lesson: lesson, max_attempts: 3)
    q = create(:question, quiz: quiz, content: "Test question?")
    create(:answer, question: q, content: "Correct", is_correct: true)
    create(:answer, question: q, content: "Wrong", is_correct: false, position: 1)
    quiz
  end

  describe "POST /student/quizzes/:quiz_id/quiz_attempts" do
    context "when authenticated as student" do
      before { sign_in student, scope: :user }

      it "creates a new quiz attempt" do
        expect {
          post student_quiz_quiz_attempts_path(quiz), headers: { 'Accept' => 'application/json' }
        }.to change(QuizAttempt, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['quiz']['title']).to eq(quiz.title)
      end

      it "returns error when max attempts reached" do
        quiz.update!(max_attempts: 1)
        create(:quiz_attempt, quiz: quiz, student_profile: profile, completed_at: Time.current)

        post student_quiz_quiz_attempts_path(quiz), headers: { 'Accept' => 'application/json' }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['error']).to include("attempts")
      end
    end

    context "when not authenticated" do
      it "returns unauthorized" do
        post student_quiz_quiz_attempts_path(quiz), headers: { 'Accept' => 'application/json' }
        expect(response).to have_http_status(:unauthorized).or redirect_to(new_user_session_path)
      end
    end
  end

  describe "GET /student/quiz_attempts/:id" do
    let!(:attempt) { create(:quiz_attempt, quiz: quiz, student_profile: profile) }

    context "when authenticated as student" do
      before { sign_in student }

      it "returns the quiz attempt" do
        get student_quiz_attempt_path(attempt), headers: { 'Accept' => 'application/json' }

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['id']).to eq(attempt.id)
        expect(json['quiz']['questions']).to be_an(Array)
      end
    end
  end

  describe "POST /student/quiz_attempts/:id/submit_answer" do
    let!(:attempt) { create(:quiz_attempt, quiz: quiz, student_profile: profile) }
    let(:question) { quiz.questions.first }
    let(:correct_answer) { question.answers.find_by(is_correct: true) }

    context "when authenticated as student" do
      before { sign_in student }

      it "submits an answer for a question" do
        post submit_answer_student_quiz_attempt_path(attempt),
             params: { question_id: question.id, answer_id: correct_answer.id },
             headers: { 'Accept' => 'application/json' }

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['is_correct']).to be true
      end

      it "returns error when question already answered" do
        create(:quiz_response, quiz_attempt: attempt, question: question, answer: correct_answer, is_correct: true)

        post submit_answer_student_quiz_attempt_path(attempt),
             params: { question_id: question.id, answer_id: correct_answer.id },
             headers: { 'Accept' => 'application/json' }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "POST /student/quiz_attempts/:id/complete" do
    let!(:attempt) { create(:quiz_attempt, quiz: quiz, student_profile: profile) }
    let(:question) { quiz.questions.first }
    let(:correct_answer) { question.answers.find_by(is_correct: true) }

    context "when authenticated as student" do
      before do
        sign_in student
        create(:quiz_response, quiz_attempt: attempt, question: question, answer: correct_answer, is_correct: true)
      end

      it "completes the quiz and calculates score" do
        post complete_student_quiz_attempt_path(attempt), headers: { 'Accept' => 'application/json' }

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['score']).to eq(100)
        expect(json['passed']).to be true
        expect(json['xp_earned']).to be > 0
      end

      it "returns error when already completed" do
        attempt.update!(completed_at: Time.current)

        post complete_student_quiz_attempt_path(attempt), headers: { 'Accept' => 'application/json' }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
