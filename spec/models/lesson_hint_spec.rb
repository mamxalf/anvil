require 'rails_helper'

RSpec.describe LessonHint, type: :model do
  describe 'associations' do
    it 'belongs to a lesson' do
      lesson = create(:lesson)
      hint = create(:lesson_hint, lesson: lesson)
      expect(hint.lesson).to eq(lesson)
    end
  end

  describe 'validations' do
    it 'requires content' do
      hint = build(:lesson_hint, content: nil)
      expect(hint).not_to be_valid
      expect(hint.errors[:content]).to be_present
    end

    it 'requires tier' do
      hint = build(:lesson_hint, tier: nil)
      expect(hint).not_to be_valid
      expect(hint.errors[:tier]).to be_present
    end

    it 'requires unique tier per lesson' do
      lesson = create(:lesson)
      create(:lesson_hint, lesson: lesson, tier: :beginner)

      duplicate = build(:lesson_hint, lesson: lesson, tier: :beginner)
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:tier]).to be_present
    end
  end

  describe 'scopes' do
    it 'returns hints ordered by tier' do
      lesson = create(:lesson)
      advanced = create(:lesson_hint, lesson: lesson, tier: :advanced)
      beginner = create(:lesson_hint, lesson: lesson, tier: :beginner)

      expect(lesson.lesson_hints.ordered).to eq([ beginner, advanced ])
    end
  end
end
