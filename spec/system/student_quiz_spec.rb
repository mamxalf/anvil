# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Student Quiz Feature", type: :system do
  before do
    driven_by(:playwright)
  end

  let(:student) { create(:user, role: 'student') }
  let(:profile) { create(:student_profile, user: student) }
  let(:instructor) { create(:user, role: 'instructor') }
  let(:instructor_profile) { create(:instructor_profile, user: instructor) }
  let(:course) { create(:course, title: "Scratch Course", status: :published, instructor: instructor_profile) }
  let(:mod) { create(:course_module, course: course, title: "Module 1") }
  let(:lesson) { create(:lesson, course_module: mod, title: "Lesson 1", content: "Learn Scratch basics") }
  let!(:enrollment) { create(:course_enrollment, student_profile: profile, course: course) }

  describe "Quiz Display" do
    context "when lesson has a quiz" do
      let!(:quiz) do
        quiz = create(:quiz, lesson: lesson, title: "Scratch Basics Quiz", passing_score: 70, xp_reward: 25)
        q1 = create(:question, quiz: quiz, content: "Who created Scratch?", question_type: :multiple_choice)
        create(:answer, question: q1, content: "MIT", is_correct: true, position: 0)
        create(:answer, question: q1, content: "Google", is_correct: false, position: 1)
        create(:answer, question: q1, content: "Microsoft", is_correct: false, position: 2)

        q2 = create(:question, quiz: quiz, content: "Is Scratch text-based?", question_type: :true_false, position: 1)
        create(:answer, question: q2, content: "True", is_correct: false, position: 0)
        create(:answer, question: q2, content: "False", is_correct: true, position: 1)

        quiz
      end

      it "shows quiz section on learn page" do
        sign_in student, scope: :user
        visit learn_student_course_path(course, lesson_id: lesson.id)

        expect(page).to have_content("Scratch Basics Quiz")
        expect(page).to have_button("Start Quiz")
      end

      it "allows student to start a quiz" do
        sign_in student, scope: :user
        visit learn_student_course_path(course, lesson_id: lesson.id)

        click_button "Start Quiz"

        # Should show first question
        expect(page).to have_content("Who created Scratch?")
        expect(page).to have_content("MIT")
        expect(page).to have_content("Google")
      end

      it "allows student to answer questions and submit" do
        sign_in student, scope: :user
        visit learn_student_course_path(course, lesson_id: lesson.id)

        click_button "Start Quiz"

        # Answer first question
        expect(page).to have_content("Who created Scratch?")
        find("button", text: "MIT").click
        click_button "Next"

        # Answer second question
        expect(page).to have_content("Is Scratch text-based?")
        find("button", text: "False").click
        click_button "Submit Quiz"

        # Should show results
        expect(page).to have_content("You Passed!")
      end
    end

    context "when lesson has no quiz" do
      it "does not show quiz section" do
        sign_in student, scope: :user
        visit learn_student_course_path(course, lesson_id: lesson.id)

        expect(page).not_to have_content("Start Quiz")
      end
    end
  end

  describe "Quiz Attempts" do
    let!(:quiz) do
      quiz = create(:quiz, lesson: lesson, title: "Limited Quiz", max_attempts: 1, passing_score: 100)
      q = create(:question, quiz: quiz, content: "Test Question?")
      create(:answer, question: q, content: "Wrong", is_correct: false)
      create(:answer, question: q, content: "Correct", is_correct: true, position: 1)
      quiz
    end

    context "when max attempts reached" do
      before do
        attempt = create(:quiz_attempt, student_profile: profile, quiz: quiz, completed_at: Time.current, score: 50, passed: false)
        q = quiz.questions.first
        create(:quiz_response, quiz_attempt: attempt, question: q, answer: q.answers.first)
      end

      it "shows no attempts remaining message" do
        sign_in student, scope: :user
        visit learn_student_course_path(course, lesson_id: lesson.id)

        expect(page).to have_content("No attempts remaining")
        expect(page).not_to have_button("Start Quiz")
      end
    end
  end

  describe "Quiz Results" do
    let!(:quiz) do
      quiz = create(:quiz, lesson: lesson, title: "Scored Quiz", passing_score: 50, xp_reward: 50)
      q = create(:question, quiz: quiz, content: "Easy Question?", points: 10)
      create(:answer, question: q, content: "Correct Answer", is_correct: true)
      create(:answer, question: q, content: "Wrong Answer", is_correct: false, position: 1)
      quiz
    end

    it "shows XP earned on successful completion" do
      sign_in student, scope: :user
      visit learn_student_course_path(course, lesson_id: lesson.id)

      click_button "Start Quiz"
      find("button", text: "Correct Answer").click
      click_button "Submit Quiz"

      expect(page).to have_content("You Passed!")
      expect(page).to have_content("50")  # XP earned
    end

    it "allows retake when not passed" do
      sign_in student, scope: :user
      visit learn_student_course_path(course, lesson_id: lesson.id)

      click_button "Start Quiz"
      find("button", text: "Wrong Answer").click
      click_button "Submit Quiz"

      expect(page).to have_content("Quiz Not Passed")
      expect(page).to have_button("Try Again")
    end
  end
end
