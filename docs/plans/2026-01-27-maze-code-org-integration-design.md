# Code.org-Style Maze Integration Design

**Date:** 2026-01-27
**Status:** Design Approved
**Author:** Design Collaboration with User

## Table of Contents
1. [Concept Overview](#concept-overview)
2. [Architecture](#architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Flow & User Journey](#data-flow--user-journey)
5. [Error Handling & Edge Cases](#error-handling--edge-cases)
6. [Testing Strategy](#testing-strategy)
7. [Implementation Considerations](#implementation-considerations)
8. [Database Seeders](#database-seeders)

---

## Concept Overview

### Problem Statement
Maze Game saat ini ada sebagai playground terpisah (`/student/playground/maze`) tanpa integrasi dengan sistem course. Anak-anak harus:
- Belajar materi di halaman course
- Pindah ke playground terpisah untuk praktik
- Tidak ada panduan langkah demi langkah saat praktik
- Tidak ada sistem reward seperti bintang

### Solution Vision
Mengintegrasikan Maze Game ke dalam sistem course dengan UX seperti Code.org, di mana anak-anak bisa:

1. **Belajar materi** (video/teks) di tab "📚 Materi"
2. **Langsung praktik** di tab "🎮 Praktik" tanpa ganti halaman
3. **Dapat panduan** melalui smart hints system saat kesulitan
4. **Dapat reward** 1-3 bintang berdasarkan performa

### Key Design Decisions

**1. Materi vs Instruksi Praktik (Terpisah!)**
- **Materi** = Lesson.content (penjelasan konsep, teori, video)
- **Instruksi Praktik** = LessonHint system (hints untuk solve puzzle)
- Keduanya punya tujuan berbeda dan harus disimpan terpisah

**2. Tabbed View UI**
- Dua tab: "📚 Materi" dan "🎮 Praktik"
- User bebas pindah antar tab tanpa reload halaman
- Praktik bisa terkunci sampai user baca materi (opsional)

**3. Multi-tier Progressive Hints**
- 3 tier hints: beginner → intermediate → advanced
- Muncul otomatis saat user kesulitan (smart triggers)
- Configurable trigger per level (time-based, attempt-based, or hybrid)

**4. Progressive Completion dengan 3 Bintang**
- ⭐ = Solve puzzle (reach goal)
- ⭐⭐ = Optimal block count
- ⭐⭐⭐ = Optimal time
- Motivasi untuk replay dan improvement

**5. Flexible Activity System**
- Lesson punya `activity_type` dan `activity_config` (JSON)
- Extensible untuk maze, arduino, atau activity lain di masa depan
- Tidak perlu refactor besar untuk add new activity type

---

## Architecture

### Database Schema

#### 1. Lesson Model - Activity System

```ruby
class Lesson < ApplicationRecord
  belongs_to :course_module
  has_rich_text :content
  has_one :quiz, dependent: :destroy
  has_many :resources, dependent: :destroy
  has_many :lesson_progresses, dependent: :destroy
  has_many :lesson_hints, dependent: :destroy  # NEW
  has_many :maze_attempts, dependent: :destroy # NEW

  # Activity system
  enum :activity_type, {
    none: 0,        # Default lesson (video/text/quiz only)
    maze: 1,        # Maze puzzle
    arduino: 2,     # Arduino coding (future)
    project: 3      # Project-based (future)
  }

  serialize :activity_config, JSON
  # activity_config structure for maze:
  # {
  #   maze_level: 1,
  #   grid_size: [5, 5],
  #   start_pos: [0, 0],
  #   goal_pos: [4, 4],
  #   obstacles: [[2, 2], [3, 1]],
  #   optimal_blocks: 5,
  #   optimal_time_seconds: 30,
  #   available_blocks: ["forward", "turn_left", "turn_right", "repeat"],
  #   initial_blocks: [],     # Pre-placed blocks (optional)
  #   required_blocks: [],    # Must use these blocks to complete
  #   character: 'rabbit',    # Character type
  #   goal_item: 'carrot'     # Goal item type
  # }

  validates :title, presence: true
  validates :position, numericality: { greater_than_or_equal_to: 0 }
  validates :xp_reward, numericality: { greater_than_or_equal_to: 0 }
end
```

#### 2. LessonHint Model - Multi-tier Hints

```ruby
class LessonHint < ApplicationRecord
  belongs_to :lesson

  enum :tier, { beginner: 1, intermediate: 2, advanced: 3 }

  # Trigger conditions (configurable per level)
  serialize :trigger_config, JSON
  # trigger_config structure:
  # {
  #   failed_runs_threshold: 3,    # Show after N failed runs
  #   time_threshold_seconds: 120, # OR after N seconds
  #   show_immediately: false      # Override: show on start
  # }

  validates :content, presence: true
  validates :tier, uniqueness: { scope: :lesson }

  scope :for_lesson, ->(lesson) { where(lesson: lesson) }
  scope :ordered, -> { order(tier: :asc) }
end
```

#### 3. MazeAttempt Model - Completion Tracking

```ruby
class MazeAttempt < ApplicationRecord
  belongs_to :lesson
  belongs_to :student_profile

  enum :status, { in_progress: 0, completed: 1, abandoned: 2 }

  # Result tracking
  validates :blocks_used, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :time_elapsed_seconds, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stars_earned, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 3 }

  # Prevent concurrent attempts
  validates :student_profile, uniqueness: {
    scope: :lesson,
    message: "Already have active attempt",
    if: :in_progress?
  }

  # Calculate stars based on lesson activity_config
  def calculate_stars!
    config = lesson.activity_config

    stars = 1 # Base star for completion

    # 2 stars: optimal blocks
    stars += 1 if blocks_used <= config['optimal_blocks']

    # 3 stars: optimal time
    stars += 1 if time_elapsed_seconds <= config['optimal_time_seconds']

    update!(stars_earned: stars)
  end

  # Scopes
  scope :completed, -> { where(status: :completed) }
  scope :for_student, ->(student) { where(student_profile: student) }
  scope :recent, -> { order(created_at: :desc) }
end
```

### API Endpoints

```ruby
# config/routes.rb
namespace :api do
  resources :maze_attempts, only: [:create, :show, :update] do
    member do
      post :complete
      post :sync
    end

    collection do
      get :active
    end
  end
end

# app/controllers/api/maze_attempts_controller.rb
module Api
  class MazeAttemptsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_lesson, only: [:create]
    before_action :set_attempt, only: [:show, :update, :complete, :sync]

    # POST /api/maze_attempts
    def create
      @attempt = MazeAttempt.find_or_initialize_by(
        lesson: @lesson,
        student_profile: current_user.student_profile,
        status: :in_progress
      )

      if @attempt.save
        render json: @attempt, status: :created
      else
        render json: { errors: @attempt.errors }, status: :unprocessable_entity
      end
    end

    # GET /api/maze_attempts/active?lesson_id=:lesson_id
    def active
      @attempt = current_user.student_profile.maze_attempts
        .find_by(lesson_id: params[:lesson_id], status: :in_progress)

      if @attempt
        render json: @attempt
      else
        render json: { active_attempt: nil }, status: :ok
      end
    end

    # GET /api/maze_attempts/:id
    def show
      render json: @attempt
    end

    # POST /api/maze_attempts/:id/complete
    def complete
      if @attempt.update(attempt_params)
        @attempt.calculate_stars!
        @attempt.update!(status: :completed, completed_at: Time.current)

        # Award XP
        xp_multiplier = @attempt.stars_earned
        total_xp = @attempt.lesson.xp_reward * xp_multiplier
        current_user.student_profile.add_points(total_xp)

        render json: {
          attempt: @attempt,
          xp_earned: total_xp,
          lesson_completed: true
        }
      else
        render json: { errors: @attempt.errors }, status: :unprocessable_entity
      end
    end

    # POST /api/maze_attempts/:id/sync
    def sync
      @attempt.update!(attempt_params)
      render json: @attempt
    end

    private

    def set_lesson
      @lesson = Lesson.find(params[:lesson_id])
    end

    def set_attempt
      @attempt = MazeAttempt.find(params[:id])
    end

    def attempt_params
      params.require(:maze_attempt).permit(:blocks_used, :time_elapsed_seconds, :failed_runs)
    end
  end
end
```

---

## Frontend Architecture

### Component Structure

#### 1. Enhanced Lesson Page with Tab System

```tsx
// app/frontend/Pages/Student/Courses/Learn.tsx
import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { TabNav } from '@/components/TabNav'
import { LessonContent } from '@/components/LessonContent'
import { MazePractice } from '@/components/MazeGame/MazePractice'
import { useTranslation } from '@/hooks/useTranslation'

interface LearnProps {
  course: Course
  modules: any[]
  currentLesson: Lesson
}

export default function Learn({ course, modules, currentLesson }: LearnProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('materi')
  const [isPracticeUnlocked, setIsPracticeUnlocked] = useState(false)

  const hasMazeActivity = currentLesson.activity_type === 'maze'

  const handleCompleteLesson = (stars: number) => {
    // Show completion modal, update UI, enable next lesson
    router.reload({ only: ['currentLesson'] })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header & Sidebar - existing */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {hasMazeActivity ? (
          <>
            {/* Tab Navigation */}
            <TabNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isPracticeUnlocked={isPracticeUnlocked}
            />

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'materi' && (
                <LessonContent lesson={currentLesson} onReadComplete={() => setIsPracticeUnlocked(true)} />
              )}

              {activeTab === 'praktik' && (
                <MazePractice
                  lesson={currentLesson}
                  onComplete={handleCompleteLesson}
                />
              )}
            </div>
          </>
        ) : (
          // Non-activity lesson (existing)
          <LessonContent lesson={currentLesson} />
        )}
      </main>
    </div>
  )
}
```

#### 2. TabNav Component

```tsx
// app/frontend/components/TabNav.tsx
import React from 'react'
import { BookOpen, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isPracticeUnlocked: boolean
}

export function TabNav({ activeTab, onTabChange, isPracticeUnlocked }: TabNavProps) {
  const tabs = [
    {
      id: 'materi',
      label: '📚 Materi',
      icon: BookOpen,
      unlocked: true
    },
    {
      id: 'praktik',
      label: '🎮 Praktik',
      icon: Gamepad2,
      unlocked: isPracticeUnlocked
    }
  ]

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex gap-2 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => tab.unlocked && onTabChange(tab.id)}
              disabled={!tab.unlocked}
              className={cn(
                'flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-all',
                isActive
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : tab.unlocked
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  : 'border-transparent text-gray-300 cursor-not-allowed opacity-50'
              )}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              {!tab.unlocked && (
                <span className="text-xs ml-1">(🔒 Baca materi dulu)</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

#### 3. MazePractice Component - Main Game Container

```tsx
// app/frontend/components/MazeGame/MazePractice.tsx
import React, { useState, useEffect } from 'react'
import { MazeGame } from './MazeGame'
import { HintTooltip } from './HintTooltip'
import { AttemptTracker } from './AttemptTracker'
import { useMazeTracker } from '@/hooks/useMazeTracker'
import { useSmartHints } from '@/hooks/useSmartHints'
import { CompletionModal } from './CompletionModal'

interface MazePracticeProps {
  lesson: Lesson
  onComplete: (stars: number) => void
}

export function MazePractice({ lesson, onComplete }: MazePracticeProps) {
  const activityConfig = lesson.activity_config
  const { attempts, currentAttempt, recordAttempt, updateAttempt } = useMazeTracker(lesson.id)
  const { hints, visibleHint, dismissHint } = useSmartHints(lesson.id, currentAttempt)

  const [showCompletion, setShowCompletion] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)

  const handleRun = (blocks: Block[], result: RunResult) => {
    // Update attempt with run data
    updateAttempt({
      blocks_used: blocks.length,
      time_elapsed_seconds: result.duration,
      failed_runs: result.success ? currentAttempt?.failed_runs || 0 : (currentAttempt?.failed_runs || 0) + 1
    })

    if (result.success) {
      // Complete the attempt
      const response = await fetch(`/api/maze_attempts/${currentAttempt.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks_used: blocks.length,
          time_elapsed_seconds: result.duration
        })
      })

      const data = await response.json()
      setEarnedStars(data.attempt.stars_earned)
      setShowCompletion(true)
      onComplete(data.attempt.stars_earned)
    }
  }

  return (
    <div className="flex h-full gap-4">
      {/* Maze Game Area */}
      <div className="flex-1">
        <MazeGame
          level={activityConfig}
          onRun={handleRun}
          celebration={true}
        />
      </div>

      {/* Side Panel */}
      <div className="w-80 space-y-4">
        {/* Attempt Tracker */}
        <AttemptTracker attempts={attempts} />

        {/* Progress Indicator */}
        {currentAttempt && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-2">Progress Kamu</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Blocks:</span>
                <span className="font-bold">{currentAttempt.blocks_used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-bold">{currentAttempt.time_elapsed_seconds}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Optimal:</span>
                <span className="text-orange-600 font-bold">
                  {activityConfig.optimal_blocks} blocks, {activityConfig.optimal_time_seconds}s
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Hints Tooltip */}
      {visibleHint && (
        <HintTooltip
          hint={visibleHint}
          onClose={dismissHint}
          position="bottom-right"
        />
      )}

      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal
          stars={earnedStars}
          onClose={() => setShowCompletion(false)}
        />
      )}
    </div>
  )
}
```

#### 4. Smart Hints System Hook

```tsx
// app/frontend/hooks/useSmartHints.ts
import { useState, useEffect } from 'react'
import axios from 'axios'

interface HintTrigger {
  failed_runs_threshold: number
  time_threshold_seconds: number
  show_immediately: boolean
}

interface LessonHint {
  id: string
  tier: 'beginner' | 'intermediate' | 'advanced'
  content: string
  trigger_config: HintTrigger
}

interface UseSmartHintsReturn {
  hints: LessonHint[]
  visibleHint: LessonHint | null
  dismissHint: () => void
}

export function useSmartHints(
  lessonId: string,
  attempt: MazeAttempt | null
): UseSmartHintsReturn {
  const [hints, setHints] = useState<LessonHint[]>([])
  const [visibleHint, setVisibleHint] = useState<LessonHint | null>(null)
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set())

  // Fetch hints for lesson
  useEffect(() => {
    axios.get(`/api/lessons/${lessonId}/hints`)
      .then(res => setHints(res.data))
      .catch(err => console.error('Failed to fetch hints:', err))
  }, [lessonId])

  // Check hint triggers based on attempt state
  useEffect(() => {
    if (!attempt || dismissedHints.size >= hints.length) return

    hints.forEach(hint => {
      if (dismissedHints.has(hint.id)) return

      const trigger = hint.trigger_config

      // Show immediately if configured
      if (trigger.show_immediately) {
        setVisibleHint(hint)
        return
      }

      // Check failed runs threshold
      if (attempt.failed_runs >= trigger.failed_runs_threshold) {
        setVisibleHint(hint)
        return
      }

      // Check time threshold
      if (attempt.time_elapsed_seconds >= trigger.time_threshold_seconds) {
        setVisibleHint(hint)
        return
      }
    })
  }, [attempt, hints, dismissedHints])

  const dismissHint = () => {
    if (visibleHint) {
      setDismissedHints(prev => new Set([...prev, visibleHint.id]))
      setVisibleHint(null)
    }
  }

  return { hints, visibleHint, dismissHint }
}
```

#### 5. HintTooltip Component

```tsx
// app/frontend/components/MazeGame/HintTooltip.tsx
import React from 'react'
import { Lightbulb, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HintTooltipProps {
  hint: LessonHint
  onClose: () => void
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function HintTooltip({ hint, onClose, position = 'bottom-right' }: HintTooltipProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  return (
    <div className={cn(
      'fixed z-50 w-80 bg-white rounded-2xl shadow-2xl border-2 border-orange-400 overflow-hidden animate-in slide-in-from-bottom-4',
      positionClasses[position]
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Lightbulb className="w-5 h-5" />
          <span className="font-black text-sm uppercase tracking-wider">
            Hint {hint.tier === 'beginner' ? '1' : hint.tier === 'intermediate' ? '2' : '3'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 bg-orange-50">
        <p className="text-sm leading-relaxed text-gray-700">
          {hint.content}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-white border-t border-orange-100 flex justify-end">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="text-orange-600 hover:text-orange-700 font-bold text-xs"
        >
          Mengerti! 👍
        </Button>
      </div>
    </div>
  )
}
```

---

## Data Flow & User Journey

### Complete User Flow

#### Step 1: Student Opens Lesson Page

**Backend:**
```
GET /student/courses/:id/learn?lesson_id=:lesson_id
→ Rails controller fetches:
   - Lesson with activity_config & hints
   - Student's existing MazeAttempts (if any)
   - Lesson progress

→ Renders Inertia "Student/Courses/Learn" with props:
   - currentLesson (activity_type, activity_config)
   - lessonHints (tiered hints with trigger_config)
   - studentProgress (existing attempts)
   - auth.user (current student)
```

**Frontend:**
```
- Mount Learn.tsx component
- Determine if lesson has maze activity (activity_type === 'maze')
- If yes: Show TabNav with "📚 Materi" and "🎮 Praktik" tabs
- If no: Show regular LessonContent (existing behavior)
```

#### Step 2: Student Reads Material in "📚 Materi" Tab

**Frontend:**
```
- Display Lesson.content (video, rich text, quiz)
- Track reading progress (optional: scroll depth, video watch %)
- On complete: Set "isPracticeUnlocked = true"
- Enable "🎮 Praktik" tab (remove lock)
```

**Backend:**
```
No action needed (client-side state)
Optional: Track reading progress via analytics
```

#### Step 3: Student Clicks "🎮 Praktik" Tab

**Frontend:**
```
- User clicks "🎮 Praktik" tab
- setActiveTab('praktik')
- Unmount LessonContent, mount MazePractice component

- MazePractice initializes:
  1. Check for existing active attempt via GET /api/maze_attempts/active
  2. If exists: Restore state (blocks, time elapsed)
  3. If not: Create new attempt via POST /api/maze_attempts
  4. Mount MazeGame with activity_config
```

**Backend (Create Attempt):**
```
POST /api/maze_attempts
{
  lesson_id: "123"
}

→ MazeAttempt.create!(
   lesson: lesson,
   student_profile: current_user.student_profile,
   status: :in_progress,
   failed_runs: 0,
   blocks_used: 0,
   time_elapsed_seconds: 0
 )

→ Return JSON:
{
  id: "att_456",
  status: "in_progress",
  created_at: "2026-01-27T10:00:00Z"
}
```

#### Step 4: Student Drag-Drop Blocks & Clicks Run

**Frontend:**
```
- User drags blocks from Blockly toolbox to workspace
- Blockly validates block connections
- User clicks "Run" button

- MazeInterpreter.executeProgram(blocks):
  1. Parse Blockly XML to JS
  2. Interpret and execute step by step
  3. Animate character movement
  4. Track: time_elapsed, blocks_used
  5. Detect: success (reach goal) or failure (hit wall/out of bounds)

- Every 10 seconds: Sync attempt state to backend
  POST /api/maze_attempts/:id/sync
  {
    blocks_used: 5,
    time_elapsed_seconds: 28,
    failed_runs: 0
  }
```

#### Step 5: Handle Success or Failure

**Case A: SUCCESS (Reach Goal)**

**Frontend:**
```
- Stop execution
- Celebration animation (confetti, character dance)
- Show stars preview: "⭐⭐⭐ Excellent!"
- Call completion API
```

**Backend (Complete Attempt):**
```
POST /api/maze_attempts/:id/complete
{
  blocks_used: 5,
  time_elapsed_seconds: 28
}

→ MazeAttempt.find(id)
→ Update: blocks_used, time_elapsed_seconds, status: :completed
→ Calculate stars:
  - Base: 1 star
  - +1 if blocks_used <= optimal_blocks (5 <= 5) ✅
  - +1 if time_elapsed <= optimal_time (28 <= 30) ✅
  → Total: 3 stars

→ Award XP:
  - Base XP: lesson.xp_reward (50)
  - Multiplier: stars_earned (3)
  - Total: 150 XP

→ Update student_profile:
  - points += 150
  - total_activities_completed += 1

→ Update lesson_progress:
  - completed_at = Time.current
  - xp_earned = 150

→ Return JSON:
{
  attempt: { id: "att_456", stars_earned: 3, status: "completed" },
  xp_earned: 150,
  lesson_completed: true
}
```

**Frontend (Show Completion):**
```
- Show CompletionModal with stars and XP
- "Next Lesson" button appears
- Update sidebar UI: mark lesson completed with ⭐
```

**Case B: FAILURE (Hit Wall / Out of Bounds)**

**Frontend:**
```
- Stop execution
- Celebration-based feedback:
  "Yah, kelinci menabrak! Coba lagi ya! 💪"
- Increment failed_runs count locally
- Trigger hint check (useSmartHooks hook)
```

**Backend:**
```
No immediate action
Hint check happens on next sync
```

#### Step 6: Smart Hints Kick In

**Frontend (useSmartHints Hook):**
```
useEffect(() => {
  // Monitor attempt state
  if (attempt.failed_runs >= 3) {
    // Check if beginner hint already shown
    if (!dismissedHints.has('hint_beginner_id')) {
      setVisibleHint(hints.find(h => h.tier === 'beginner'))
    }
  }

  if (attempt.time_elapsed_seconds >= 120) {
    // Show intermediate hint
    if (!dismissedHints.has('hint_intermediate_id')) {
      setVisibleHint(hints.find(h => h.tier === 'intermediate'))
    }
  }
}, [attempt])

// When visibleHint is set:
- Render <HintTooltip> component
- User can dismiss (closes tooltip, adds to dismissedHints)
- Re-triggers after 2 more fails or 60 more seconds
```

**Hint Display:**
```
┌─────────────────────────────────┐
│ 💡 Hint 1           [×]        │ ← Gradient orange header
├─────────────────────────────────┤
│                                 │
│ Gunakan blok 'repeat' untuk     │ ← Hint content
│ mengulang langkah maju!         │
│                                 │
├─────────────────────────────────┤
│                      [Mengerti] │ ← Footer
└─────────────────────────────────┘
```

#### Step 7: Complete Lesson & Navigate Next

**Frontend:**
```
- User clicks "Next Lesson" in CompletionModal
- Router navigates to:
  /student/courses/:id/learn?lesson_id=:next_lesson_id

- Or: Redirect to course curriculum page if no more lessons
- Update sidebar: mark current lesson completed, unlock next
```

---

## Error Handling & Edge Cases

### 1. Failed Runs & Infinite Loops

**Problem:** Student membuat program yang infinite loop atau crash interpreter

**Solution:**
```typescript
// MazeInterpreter.ts - Add execution guard
const MAX_EXECUTION_STEPS = 1000 // Prevent infinite loops

function executeProgram(blocks: Block[]): ExecutionResult {
  let steps = 0
  let isRunning = true

  while (isRunning && steps < MAX_EXECUTION_STEPS) {
    // Execute block logic
    steps++

    // Check for termination conditions
    if (reachedGoal || hitWall || outOfBounds) {
      isRunning = false
    }
  }

  if (steps >= MAX_EXECUTION_STEPS) {
    // Celebration-based failure feedback
    return {
      success: false,
      reason: 'too_long',
      message: 'Wah, programnya terlalu panjang! Coba pendekkan ya! 🔄'
    }
  }

  return { success: reachedGoal, message: 'Complete!' }
}
```

### 2. Abandoned Attempts

**Problem:** Student start maze tapi tidak complete dan pergi

**Solution:**
```ruby
# app/jobs/cleanup_abandoned_maze_attempts_job.rb
class CleanupAbandonedMazeAttemptsJob < ApplicationJob
  queue_as :low

  def perform
    MazeAttempt
      .where(status: :in_progress)
      .where('created_at < ?', 30.minutes.ago)
      .update_all(status: :abandoned, updated_at: Time.current)

    Rails.logger.info "Cleaned up #{MazeAttempt.where(status: :abandoned).count} abandoned attempts"
  end
end

# config/schedule.yml (or use Solid Queue recurring jobs)
cleanup_abandoned_attempts:
  cron: "0 * * * *" # Every hour
  class: "CleanupAbandonedMazeAttemptsJob"
```

### 3. Cheating Prevention

**Problem:** Student refresh page untuk "re-roll" puzzle atau bypass hints

**Solution:**
```typescript
// app/frontend/hooks/useMazeTracker.ts
export function useMazeTracker(lessonId: string) {
  const [attempt, setAttempt] = useState<MazeAttempt | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Restore from localStorage or backend on mount
  useEffect(() => {
    const restore = async () => {
      // Check backend for active attempt
      const res = await fetch(`/api/maze_attempts/active?lesson_id=${lessonId}`)
      const data = await res.json()

      if (data.active_attempt) {
        setAttempt(data.active_attempt)
      } else {
        // Check localStorage for temporary state
        const local = localStorage.getItem(`maze_temp_${lessonId}`)
        if (local) {
          setAttempt(JSON.parse(local))
        }
      }
    }

    restore()
  }, [lessonId])

  // Auto-save every 5 seconds to localStorage & backend
  useEffect(() => {
    if (!attempt || !hasChanges) return

    const timer = setInterval(() => {
      // Save to localStorage
      localStorage.setItem(`maze_attempt_${lessonId}`, JSON.stringify(attempt))

      // Sync to backend
      fetch(`/api/maze_attempts/${attempt.id}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt)
      })

      setHasChanges(false)
    }, 5000)

    return () => clearInterval(timer)
  }, [attempt, hasChanges, lessonId])

  const updateAttempt = (updates: Partial<MazeAttempt>) => {
    setAttempt(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  return { attempt, updateAttempt }
}
```

### 4. Hint Exhaustion (All Hints Shown, Still Stuck)

**Problem:** Student sudah lihat semua hints tapi masih tidak bisa solve

**Solution:**
```typescript
// After showing advanced hint (tier 3) and 10+ failed runs
if (currentHint.tier === 'advanced' && attempt.failed_runs >= 10) {
  return (
    <HintTooltip hint={currentHint} onClose={dismissHint}>
      <p>{currentHint.content}</p>

      <div className="mt-4 pt-4 border-t border-orange-200">
        <p className="text-xs text-gray-500 mb-2">Masih stuck?</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSolutionModal(true)}
          className="w-full text-orange-600 border-orange-300 hover:bg-orange-50"
        >
          🎯 Lihat Solusi (1 bintang saja)
        </Button>
      </div>
    </HintTooltip>
  )
}

// Solution shows optimal block arrangement
// Student can copy to workspace but won't get 3 stars (only 1)
```

### 5. Mobile Responsiveness

**Problem:** Maze game di layar kecil (tablet/phone)

**Solution:**
```tsx
// Responsive layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  {/* Maze canvas */}
  <div className="lg:col-span-2 aspect-square lg:aspect-auto">
    <MazeGame />
  </div>

  {/* Blockly toolbox */}
  <div className="lg:col-span-1">
    {isMobile ? (
      <CollapsibleToolbox defaultOpen={false} />
    ) : (
      <Toolbox />
    )}
  </div>
</div>

// Touch-friendly blocks
<BlocklyWrapper
  config={{
    toolboxTreeHeight: isMobile ? 300 : 500,
    trashcan: true,
    zoom: { controls: true, wheel: true },
    scrollbars: true,
    touch: true, // Enable touch events
    renderer: 'thrasos' // Larger, more touch-friendly blocks
  }}
/>
```

### 6. Concurrency (Multiple Tabs)

**Problem:** Student buka lesson di 2 tab, create 2 attempts

**Solution:**
```ruby
# MazeAttempt model validation
validates :student_profile, uniqueness: {
  scope: :lesson,
  message: "Already have active attempt",
  if: :in_progress?,
  on: :create
}

# Frontend: Always check for existing attempt first
const loadOrCreateAttempt = async (lessonId: string) => {
  // Check backend
  const res = await fetch(`/api/maze_attempts/active?lesson_id=${lessonId}`)
  const data = await res.json()

  if (data.active_attempt) {
    // Use existing attempt
    return data.active_attempt
  } else {
    // Create new attempt
    const createRes = await fetch('/api/maze_attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId })
    })
    return createRes.json()
  }
}
```

---

## Testing Strategy

### Backend Tests (RSpec)

#### Model Specs

```ruby
# spec/models/lesson_spec.rb
RSpec.describe Lesson, type: :model do
  describe 'activity system' do
    it 'accepts valid maze activity_config' do
      lesson = build(:lesson,
        activity_type: :maze,
        activity_config: {
          maze_level: 1,
          grid_size: [5, 5],
          start_pos: [0, 0],
          goal_pos: [4, 4],
          optimal_blocks: 5,
          optimal_time_seconds: 30,
          available_blocks: %w[forward turn_left turn_right]
        }
      )
      expect(lesson).to be_valid
    end

    it 'rejects invalid maze activity_config' do
      lesson = build(:lesson,
        activity_type: :maze,
        activity_config: { maze_level: 'invalid' }
      )
      expect(lesson).not_to be_valid
      expect(lesson.errors[:activity_config]).to be_present
    end

    it 'has many lesson hints' do
      lesson = create(:lesson, :maze_activity)
      hint1 = create(:lesson_hint, lesson: lesson, tier: :beginner)
      hint2 = create(:lesson_hint, lesson: lesson, tier: :intermediate)

      expect(lesson.lesson_hints).to include(hint1, hint2)
    end

    it 'has many maze attempts' do
      lesson = create(:lesson, :maze_activity)
      student = create(:user, :student)
      attempt = create(:maze_attempt, lesson: lesson, student_profile: student.student_profile)

      expect(lesson.maze_attempts).to include(attempt)
    end
  end
end
```

```ruby
# spec/models/lesson_hint_spec.rb
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

      expect(lesson.lesson_hints.ordered).to eq([beginner, advanced])
    end
  end
end
```

```ruby
# spec/models/maze_attempt_spec.rb
RSpec.describe MazeAttempt, type: :model do
  describe 'associations' do
    it 'belongs to lesson' do
      lesson = create(:lesson)
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
        blocks_used: 5,    # Optimal
        time_elapsed_seconds: 60  # Not optimal
      )

      attempt.calculate_stars!
      expect(attempt.stars_earned).to eq(2)
    end

    it 'awards 3 stars for optimal performance' do
      attempt = create(:maze_attempt,
        lesson: lesson,
        blocks_used: 5,    # Optimal
        time_elapsed_seconds: 28  # Optimal
      )

      attempt.calculate_stars!
      expect(attempt.stars_earned).to eq(3)
    end
  end

  describe 'validations' do
    it 'prevents duplicate active attempts for same student and lesson' do
      student = create(:user, :student)
      lesson = create(:lesson)
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
      lesson = create(:lesson)
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
```

#### Request Specs

```ruby
# spec/requests/maze_attempts_spec.rb
RSpec.describe "Maze Attempts API", type: :request do
  let(:student) { create(:user, :student) }
  let(:lesson) { create(:lesson, :maze_activity) }

  before { sign_in student }

  describe 'POST /api/maze_attempts' do
    it 'creates new attempt for student' do
      expect {
        post "/api/maze_attempts", params: {
          maze_attempt: { lesson_id: lesson.id }
        }
      }.to change(MazeAttempt, :count).by(1)

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['status']).to eq('in_progress')
    end

    it 'returns existing attempt if already in progress' do
      existing = create(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :in_progress
      )

      post "/api/maze_attempts", params: {
        maze_attempt: { lesson_id: lesson.id }
      }

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(existing.id)
    end

    it 'prevents creating attempt for other students lesson' do
      other_student = create(:user, :student)
      other_lesson = create(:lesson)

      post "/api/maze_attempts", params: {
        maze_attempt: { lesson_id: other_lesson.id }
      }

      # Should create attempt (students can access any public lesson)
      expect(response).to have_http_status(:created)
    end
  end

  describe 'GET /api/maze_attempts/active' do
    it 'returns active attempt if exists' do
      attempt = create(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :in_progress
      )

      get "/api/maze_attempts/active", params: { lesson_id: lesson.id }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['id']).to eq(attempt.id)
    end

    it 'returns null if no active attempt' do
      get "/api/maze_attempts/active", params: { lesson_id: lesson.id }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['active_attempt']).to be_nil
    end
  end

  describe 'POST /api/maze_attempts/:id/complete' do
    let(:attempt) do
      create(:maze_attempt,
        lesson: lesson,
        student_profile: student.student_profile,
        status: :in_progress
      )
    end

    it 'calculates stars correctly' do
      lesson.update(
        activity_config: {
          optimal_blocks: 5,
          optimal_time_seconds: 30
        }
      )

      post "/api/maze_attempts/#{attempt.id}/complete", params: {
        maze_attempt: {
          blocks_used: 5,
          time_elapsed_seconds: 28
        }
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['attempt']['stars_earned']).to eq(3)
    end

    it 'awards XP to student profile' do
      expect {
        post "/api/maze_attempts/#{attempt.id}/complete", params: {
          maze_attempt: { blocks_used: 5, time_elapsed_seconds: 28 }
        }
      }.to change { student.student_profile.points }.by(lesson.xp_reward * 3)
    end

    it 'marks attempt as completed' do
      post "/api/maze_attempts/#{attempt.id}/complete", params: {
        maze_attempt: { blocks_used: 5, time_elapsed_seconds: 28 }
      }

      attempt.reload
      expect(attempt.status).to eq('completed')
      expect(attempt.completed_at).to be_present
    end
  end
end
```

### Frontend Tests (Vitest)

#### Component Tests

```typescript
// MazePractice.spec.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MazePractice } from './MazePractice'
import * as api from '@/lib/api'

// Mock API
vi.mock('@/lib/api')

describe('MazePractice', () => {
  const mockLesson = {
    id: '123',
    title: 'Lesson 1',
    activity_type: 'maze',
    activity_config: {
      maze_level: 1,
      grid_size: [5, 5],
      optimal_blocks: 5,
      optimal_time_seconds: 30,
      available_blocks: ['forward', 'turn_left', 'turn_right']
    },
    lesson_hints: [
      {
        id: 'h1',
        tier: 'beginner',
        content: 'Use forward blocks',
        trigger_config: { failed_runs_threshold: 3, time_threshold_seconds: 60 }
      }
    ]
  }

  const mockAttempt = {
    id: 'att_1',
    status: 'in_progress',
    blocks_used: 0,
    time_elapsed_seconds: 0,
    failed_runs: 0
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock API calls
    vi.mocked(api.getActiveAttempt).mockResolvedValue(mockAttempt)
    vi.mocked(api.createAttempt).mockResolvedValue(mockAttempt)
  })

  it('renders maze game with correct config', async () => {
    render(<MazePractice lesson={mockLesson} onComplete={vi.fn()} />)

    await waitFor(() => {
      expect(screen.getByTestId('maze-game')).toBeInTheDocument()
    })
  })

  it('shows hint after failed runs threshold', async () => {
    render(<MazePractice lesson={mockLesson} onComplete={vi.fn()} />)

    // Simulate 3 failed runs
    const attemptWithFailures = { ...mockAttempt, failed_runs: 3 }

    await waitFor(() => {
      // Hint should appear
      expect(screen.getByText(/Use forward blocks/)).toBeInTheDocument()
    })
  })

  it('shows completion modal on success', async () => {
    const onComplete = vi.fn()
    render(<MazePractice lesson={mockLesson} onComplete={onComplete} />)

    // Simulate successful run
    const successResult = { success: true, duration: 28 }

    // Mock complete API
    vi.mocked(api.completeAttempt).mockResolvedValue({
      attempt: { ...mockAttempt, stars_earned: 3, status: 'completed' },
      xp_earned: 150,
      lesson_completed: true
    })

    // Trigger completion
    // ... (depends on how MazeGame triggers callback)

    await waitFor(() => {
      expect(screen.getByText(/⭐⭐⭐/)).toBeInTheDocument()
      expect(onComplete).toHaveBeenCalledWith(3)
    })
  })
})
```

#### Hook Tests

```typescript
// useSmartHints.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useSmartHints } from './useSmartHints'
import * as api from '@/lib/api'

vi.mock('@/lib/api')

describe('useSmartHints', () => {
  const mockHints = [
    {
      id: 'h1',
      tier: 'beginner',
      content: 'Hint 1',
      trigger_config: { failed_runs_threshold: 3, time_threshold_seconds: 60 }
    },
    {
      id: 'h2',
      tier: 'intermediate',
      content: 'Hint 2',
      trigger_config: { failed_runs_threshold: 5, time_threshold_seconds: 90 }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.fetchHints).mockResolvedValue(mockHints)
  })

  it('fetches hints on mount', async () => {
    const { result } = renderHook(() => useSmartHints('lesson_123', null))

    await waitFor(() => {
      expect(result.current.hints).toHaveLength(2)
    })
  })

  it('shows beginner hint after 3 failed runs', async () => {
    const { result } = renderHook(() => useSmartHints('lesson_123', null))

    const attemptWithFailures = {
      id: 'att_1',
      failed_runs: 3,
      time_elapsed_seconds: 30
    }

    await waitFor(() => {
      expect(result.current.hints).toHaveLength(2)
    })

    act(() => {
      // Trigger attempt update (simulate new prop)
      renderHook(() => useSmartHints('lesson_123', attemptWithFailures))
    })

    await waitFor(() => {
      expect(result.current.visibleHint?.tier).toBe('beginner')
    })
  })

  it('dismisses hint and does not show again', async () => {
    const { result } = renderHook(() => useSmartHints('lesson_123', null))

    await waitFor(() => {
      expect(result.current.hints).toHaveLength(2)
    })

    // Show hint
    act(() => {
      result.current.visibleHint = mockHints[0]
    })

    // Dismiss hint
    act(() => {
      result.current.dismissHint()
    })

    expect(result.current.visibleHint).toBeNull()

    // Trigger same condition again
    act(() => {
      const attemptWithFailures = { failed_runs: 3, time_elapsed_seconds: 30 }
      renderHook(() => useSmartHints('lesson_123', attemptWithFailures))
    })

    // Hint should NOT appear (already dismissed)
    await waitFor(() => {
      expect(result.current.visibleHint).toBeNull()
    })
  })
})
```

### Integration Tests (Capybara + Playwright)

```ruby
# spec/system/student/maze_lesson_flow_spec.rb
RSpec.describe 'Student maze lesson flow', type: :system do
  let(:student) { create(:user, :student) }
  let(:course) { create(:course) }
  let(:module1) { create(:course_module, course: course, position: 1) }
  let(:lesson) { create(:lesson, :maze_activity, course_module: module1, position: 1) }

  before do
    sign_in student
  end

  it 'completes maze lesson and earns 3 stars' do
    visit "/student/courses/#{course.id}/learn?lesson_id=#{lesson.id}"

    # Should start on Materi tab
    expect(page).to have_content('📚 Materi')
    expect(page).to have_content(lesson.title)

    # Switch to Praktik tab
    click_on '🎮 Praktik'

    # Wait for maze game to load
    expect(page).to have_css('[data-testid="maze-game"]', wait: 10)

    # Drag blocks to workspace (simulated)
    # Note: Actual block dragging requires more complex setup
    within('[data-testid="blockly-workspace"]') do
      # Simulate adding blocks via API/JS
      page.execute_script("""
        const workspace = Blockly.getMainWorkspace();
        const block = workspace.newBlock('forward');
        block.initSvg();
        block.render();
        // Add more blocks...
      """)
    end

    # Click run button
    click_on 'Run'

    # Wait for completion animation
    expect(page).to have_content('Complete!', wait: 10)

    # Check stars awarded
    expect(page).to have_css('.stars-earned .star', count: 3)

    # Verify backend updated
    expect(student.student_profile.maze_attempts.count).to eq(1)
    attempt = student.student_profile.maze_attempts.first
    expect(attempt.status).to eq('completed')
    expect(attempt.stars_earned).to eq(3)
    expect(student.student_profile.points).to eq(lesson.xp_reward * 3)
  end

  it 'shows smart hints after failed attempts' do
    visit "/student/courses/#{course.id}/learn?lesson_id=#{lesson.id}"
    click_on '🎮 Praktik'

    # Fail 3 times (simulate incorrect blocks)
    3.times do
      page.execute_script("""
        const workspace = Blockly.getMainWorkspace();
        const block = workspace.newBlock('turn_left'); // Wrong block
        block.initSvg();
      """)
      click_on 'Run'
      sleep 1 # Wait for execution
    end

    # Hint should appear
    expect(page).to have_content('💡 Hint:', wait: 10)
    expect(page).to have_content('Hint 1') # Content from beginner hint
  end

  it 'prevents opening practice tab until material is read (optional feature)' do
    # If this feature is enabled
    visit "/student/courses/#{course.id}/learn?lesson_id=#{lesson.id}"

    # Practice tab should be locked
    expect(page).to have_selector('button[disabled]', text: /🎮 Praktik/)

    # Read some content (scroll to bottom)
    page.execute_script('window.scrollTo(0, document.body.scrollHeight)')
    sleep 1

    # Practice tab should unlock
    expect(page).not_to have_selector('button[disabled]', text: /🎮 Praktik/)
  end
end
```

---

## Implementation Considerations

### Performance Optimizations

#### 1. Lazy Loading Blockly

```typescript
// Load Blockly only when practice tab is opened
import { lazy, Suspense } from 'react'

const MazePractice = lazy(() => import('@/components/MazeGame/MazePractice'))

// In Learn component:
{activeTab === 'praktik' && (
  <Suspense fallback={<LoadingSpinner message="Memuat game..." />}>
    <MazePractice lesson={lesson} onComplete={handleComplete} />
  </Suspense>
)}
```

#### 2. Debounce Hint Checks

```typescript
import { debounce } from 'lodash-es'

// Don't check hints on every failed run immediately
const debouncedHintCheck = useMemo(
  () => debounce((attempt: MazeAttempt) => {
    checkHintTriggers(attempt)
  }, 2000), // Wait 2 seconds after failed run
  []
)

useEffect(() => {
  if (attempt && attempt.failed_runs > 0) {
    debouncedHintCheck(attempt)
  }
}, [attempt, debouncedHintCheck])
```

#### 3. Efficient Attempt Sync

```typescript
// Batch sync every 10 seconds, not on every block move
useEffect(() => {
  if (!attempt || !hasChanges) return

  const interval = setInterval(() => {
    syncAttempt(attempt)
    setHasChanges(false)
  }, 10000) // 10 seconds

  return () => clearInterval(interval)
}, [attempt, hasChanges])

// Also sync on critical events (run, complete)
const handleRun = () => {
  // ... execute program
  syncAttempt(updatedAttempt) // Immediate sync on run
}
```

### Migration Strategy

#### Phase 1: Database & Backend (1-2 days)

**Tasks:**
1. Create migration for `lessons` table (add `activity_type`, `activity_config`)
2. Create `lesson_hints` table
3. Create `maze_attempts` table
4. Update `Lesson` model with activity system
5. Create `LessonHint` and `MazeAttempt` models
6. Add API endpoints for maze attempts
7. Write RSpec tests for models & API

**Migration File:**
```ruby
# db/migrate/20260127000001_add_activity_system_to_lessons.rb
class AddActivitySystemToLessons < ActiveRecord::Migration[8.1]
  def change
    # Add activity system to lessons
    add_column :lessons, :activity_type, :integer, default: 0, null: false
    add_column :lessons, :activity_config, :jsonb, default: {}

    # Create lesson_hints table
    create_table :lesson_hints, id: :uuid do |t|
      t.references :lesson, type: :uuid, null: false, foreign_key: true
      t.integer :tier, null: false
      t.text :content, null: false
      t.jsonb :trigger_config, default: {}

      t.timestamps
    end

    add_index :lesson_hints, [:lesson_id, :tier], unique: true

    # Create maze_attempts table
    create_table :maze_attempts, id: :uuid do |t|
      t.references :lesson, type: :uuid, null: false, foreign_key: true
      t.references :student_profile, type: :uuid, null: false, foreign_key: true

      t.integer :status, default: 0, null: false
      t.integer :blocks_used, default: 0, null: false
      t.integer :time_elapsed_seconds, default: 0, null: false
      t.integer :failed_runs, default: 0, null: false
      t.integer :stars_earned, default: 0, null: false

      t.datetime :completed_at

      t.timestamps

      t.index [:lesson_id, :student_profile_id, :status], name: 'index_maze_attempts_unique'
      t.index :student_profile_id
    end
  end
end
```

**Commands:**
```bash
bin/rails generate migration AddActivitySystemToLessons
bin/rails db:migrate
```

#### Phase 2: Frontend Tab System (1 day)

**Tasks:**
1. Update `Learn.tsx` with tab navigation
2. Create `TabNav` component
3. Add conditional rendering for practice tab
4. Write component tests

**Files:**
- `app/frontend/Pages/Student/Courses/Learn.tsx` (update)
- `app/frontend/components/TabNav.tsx` (new)

#### Phase 3: Maze Integration (2-3 days)

**Tasks:**
1. Refactor existing `MazeGame` to accept `activity_config`
2. Create `MazePractice` container component
3. Implement `useSmartHints` hook
4. Create `HintTooltip` component
5. Implement `useMazeTracker` hook
6. Add celebration feedback system
7. Write integration tests

**Files:**
- `app/frontend/components/MazeGame/MazePractice.tsx` (new)
- `app/frontend/components/MazeGame/HintTooltip.tsx` (new)
- `app/frontend/components/MazeGame/CompletionModal.tsx` (new)
- `app/frontend/hooks/useSmartHints.ts` (new)
- `app/frontend/hooks/useMazeTracker.ts` (new)
- `app/frontend/components/MazeGame/MazeGame.tsx` (refactor)

#### Phase 4: Admin Panel (1 day)

**Tasks:**
1. Add activity configuration to Avo Lesson resource
2. Create hints management interface
3. Add maze attempt analytics dashboard

**Files:**
- `app/avo/resources/lesson_resource.rb` (update)
- `app/avo/resources/lesson_hint_resource.rb` (new)
- `app/avo/resources/maze_attempt_resource.rb` (new)

#### Phase 5: Polish & Testing (1-2 days)

**Tasks:**
1. Mobile responsiveness testing
2. Accessibility (keyboard navigation, screen reader)
3. Performance optimization
4. End-to-end testing
5. Bug fixes & refinements

### Future Enhancements

1. **Multiplayer Maze** - Students collaborate on same puzzle in real-time
2. **Maze Builder** - Students create own puzzles for peers to solve
3. **Leaderboards** - Weekly fastest solve rankings per level
4. **Achievements** - "Maze Master", "Speed Demon", "Efficient Coder" badges
5. **AI Hints** - GPT-powered contextual hints instead of hardcoded
6. **VR Mode** - 3D maze experience with VR headset support
7. **Adaptive Difficulty** - System adjusts puzzle difficulty based on student performance
8. **Peer Review** - Students rate and comment on each other's maze solutions

---

## Database Seeders

### Complete Seeding Script

See `db/seeds.rb` for the complete implementation.

Key sections:
1. Create "Maze Programming 101" course
2. Module 1: Basic Movement (Lessons 1-3)
3. Module 2: Loops (Lessons 1-3)
4. Module 3: Conditionals (Lessons 1-3)
5. Create 3-tier hints for each lesson
6. Define activity_config with optimal blocks & time

**Run seeder:**
```bash
bin/rails db:seed
```

**Verify seeded data:**
```ruby
bin/rails console

course = Course.find_by(slug: 'maze-programming-101')
puts "Course: #{course.title}"
puts "Modules: #{course.course_modules.count}"
puts "Total Lessons: #{course.lessons.count}"

course.lessons.each do |lesson|
  puts "- #{lesson.title} (Activity: #{lesson.activity_type})"
  puts "  Hints: #{lesson.lesson_hints.count}"
  if lesson.activity_type == 'maze'
    puts "  Config: #{lesson.activity_config['optimal_blocks']} blocks, #{lesson.activity_config['optimal_time_seconds']}s"
  end
end
```

---

## Summary

This design document outlines a comprehensive plan to integrate the Maze Game into KodiLearn's course system with a Code.org-style experience.

**Key Features:**
✅ Tabbed UI (Materi/Praktik) for seamless learning-to-practice transition
✅ Multi-tier progressive hints with smart triggers
✅ 3-star completion system for gamification
✅ Flexible activity system for future extensibility
✅ Comprehensive error handling and edge case coverage
✅ Complete testing strategy (backend, frontend, integration)
✅ Database seeders with sample maze course

**Implementation Timeline:** 6-9 days total (1-2 days backend, 1 day frontend tabs, 2-3 days maze integration, 1 day admin, 1-2 days polish)

**Next Steps:**
1. Review and approve design document
2. Create implementation plan using superpowers:writing-plans
3. Set up git worktree using superpowers:using-git-worktrees
4. Begin implementation following the phased approach
