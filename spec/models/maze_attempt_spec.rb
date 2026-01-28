require 'rails_helper'

RSpec.describe MazeAttempt, type: :model do
  describe 'associations' do
    it 'belongs to lesson' do
      lesson = create(:lesson, :maze_activity)
      attempt = create(:maze_attempt, lesson: lesson)
      expect(attempt.lesson).to eq(lesson)
    end

    it 'belongs to student_profile' do
      student = create(:user, :student)
      attempt = create(:maze_attempt, student_profile: student.student_profile)
      expect(attempt.student_profile).to eq(student.student_profile)
    end
  end

  describe '#calculate_stars!' do
    let(:lesson) do
      create(:lesson, :maze_activity,
        activity_config: {
          optimal_blocks: 5,
          optimal_time_seconds: 30
        }
      )
    end

    it 'awards 1 star for completion' do
      attempt = create(:maze_attempt,
        lesson: lesson,
        blocks_used: 10,
        time_elapsed_seconds: 60
      )

      attempt.calculate_stars!
      expect(attempt.stars_earned).to eq(1)
    end

    it 'awards 2 stars for optimal blocks' do
      attempt = create(:maze_attempt,
        lesson: lesson,
        blocks_used: 5,
        time_elapsed_seconds: 60
      )

      attempt.calculate_stars!
      expect(attempt.stars_earned).to eq(2)
    end

    it 'awards 3 stars for optimal performance' do
      attempt = create(:maze_attempt,
        lesson: lesson,
        blocks_used: 5,
        time_elapsed_seconds: 28
      )

      attempt.calculate_stars!
      expect(attempt.stars_earned).to eq(3)
    end
  end

  describe 'validations' do
    it 'prevents duplicate active attempts for same student and lesson' do
      student = create(:user, :student)
      lesson = create(:lesson, :maze_activity)
      create(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :in_progress
      )

      duplicate = build(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :in_progress
      )

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:student_profile]).to be_present
    end

    it 'allows completed attempts for same lesson' do
      student = create(:user, :student)
      lesson = create(:lesson, :maze_activity)
      create(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :completed
      )

      new_attempt = build(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :in_progress
      )

      expect(new_attempt).to be_valid
    end
  end
end
