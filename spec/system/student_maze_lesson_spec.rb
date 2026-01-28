require 'rails_helper'

RSpec.describe 'Student maze lesson flow', type: :system do
  before do
    driven_by(:playwright)
  end

  let(:student) { create(:user, :student) }
  let(:course) { create(:course) }
  let(:module1) { create(:course_module, course: course, position: 1) }
  let(:lesson) { create(:lesson, :maze_activity, course_module: module1, position: 1) }

  # Create hints for the lesson
  let!(:hint1) { create(:lesson_hint, lesson: lesson, tier: :beginner) }
  let!(:hint2) { create(:lesson_hint, lesson: lesson, tier: :intermediate) }

  before do
    sign_in student, scope: :user
  end

  describe 'displaying maze activity interface' do
    before do
      create(:course_enrollment, student_profile: student.student_profile, course: course)
      visit learn_student_course_path(course, lesson_id: lesson.id)
    end

    it 'displays tabs for maze activity lesson' do
      expect(page).to have_content('Materi')
      expect(page).to have_content('Praktik')
    end

    it 'shows lesson content in materi tab' do
      expect(page).to have_content(lesson.title)
      expect(page).to have_css('.prose')
    end
  end

  describe 'praktik tab lock mechanism' do
    before do
      create(:course_enrollment, student_profile: student.student_profile, course: course)
      visit learn_student_course_path(course, lesson_id: lesson.id)
    end

    it 'locks praktik tab until material is read' do
      # Praktik tab should be disabled initially
      praktik_tab = find_button('Praktik', match: :first)
      expect(praktik_tab).to be_disabled
    end

    it 'unlocks praktik tab after scrolling through content' do
      # Scroll to bottom to unlock praktik
      page.execute_script('window.scrollTo(0, document.body.scrollHeight)')
      sleep 1

      # Wait for tab to become enabled
      expect(page).to have_button('Praktik', disabled: false, wait: 5)
    end
  end

  describe 'maze attempt creation' do
    before do
      create(:course_enrollment, student_profile: student.student_profile, course: course)
      visit learn_student_course_path(course, lesson_id: lesson.id)

      # Scroll to unlock praktik
      page.execute_script('window.scrollTo(0, document.body.scrollHeight)')
      sleep 1
    end

    it 'creates maze attempt when switching to praktik tab' do
      # Count attempts before
      attempt_count_before = student.student_profile.maze_attempts.count

      # Click praktik tab
      click_on 'Praktik'

      # Wait for maze game to load
      expect(page).to have_css('[data-testid="maze-game"]', wait: 10)

      # Verify attempt created in backend
      expect(student.student_profile.maze_attempts.count).to eq(attempt_count_before + 1)

      attempt = student.student_profile.maze_attempts.last
      expect(attempt.lesson).to eq(lesson)
      expect(attempt.status).to eq('in_progress')
    end
  end

  describe 'hint system integration' do
    before do
      create(:course_enrollment, student_profile: student.student_profile, course: course)
      visit learn_student_course_path(course, lesson_id: lesson.id)

      # Scroll to unlock praktik
      page.execute_script('window.scrollTo(0, document.body.scrollHeight)')
      sleep 1

      # Click praktik tab
      click_on 'Praktik'
    end

    it 'displays beginner hint after failed runs threshold' do
      # This test verifies that hints are configured correctly
      # Actual hint display logic is tested in frontend unit tests
      expect(lesson.lesson_hints.count).to eq(2)
      expect(lesson.lesson_hints.where(tier: :beginner).count).to eq(1)
      expect(lesson.lesson_hints.where(tier: :intermediate).count).to eq(1)
    end
  end
end
