import React, { useState } from 'react'
import { HintTooltip } from './HintTooltip'
import { CompletionModal } from './CompletionModal'
import MazeGame from './MazeGame'
import { useMazeTracker } from '@/hooks/useMazeTracker'
import { useSmartHints } from '@/hooks/useSmartHints'
import { completeAttempt } from '@/lib/api'
import type { MazeLevelConfig } from './MazeTypes'
import { ResultType } from './MazeTypes'

interface MazePracticeProps {
  lessonId: string
  activityConfig: MazeLevelConfig
  onComplete: (stars: number) => void
}

// Extracted stats component for DRY and responsive behavior
interface AttemptStatsProps {
  attempt: ReturnType<typeof useMazeTracker>['attempt']
  activityConfig: MazeLevelConfig
}

function AttemptStats({ attempt, activityConfig }: AttemptStatsProps) {
  if (!attempt) return null

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Blocks:</span>
        <span className="font-bold">{attempt.blocks_used}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Time:</span>
        <span className="font-bold">{attempt.time_elapsed_seconds}s</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Failed:</span>
        <span className="font-bold text-orange-600">{attempt.failed_runs}</span>
      </div>

      <div className="border-t border-gray-200 pt-2 mt-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Optimal:</span>
          <span className="text-orange-600 font-bold">
            {activityConfig.optimal_blocks} blocks, {activityConfig.optimal_time_seconds}s
          </span>
        </div>
      </div>
    </div>
  )
}

export function MazePractice({ lessonId, activityConfig, onComplete }: MazePracticeProps) {
  const { attempt, updateAttempt, immediateSync } = useMazeTracker(lessonId)
  const { visibleHint, dismissHint } = useSmartHints(lessonId, attempt)

  const [showCompletion, setShowCompletion] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)

  const handleGameComplete = async (resultType: ResultType) => {
    if (!attempt) return

    const success = resultType === ResultType.SUCCESS

    // Calculate attempt stats
    const blocksUsed = attempt.blocks_used || 0
    const timeElapsed = attempt.time_elapsed_seconds || 0

    if (success) {
      try {
        // Complete the attempt
        const response = await completeAttempt(attempt.id, {
          blocks_used: blocksUsed,
          time_elapsed_seconds: timeElapsed
        })

        setEarnedStars(response.attempt.stars_earned)
        setEarnedXp(response.xp_earned)
        setShowCompletion(true)
        onComplete(response.attempt.stars_earned)
      } catch (error) {
        console.error('Failed to complete attempt:', error)
      }
    } else {
      // Increment failed runs
      updateAttempt({
        failed_runs: (attempt.failed_runs || 0) + 1
      })
      await immediateSync()
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4">
      {/* Main Maze Game Area - Full width */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm overflow-hidden">
        <MazeGame
          initialLevel={activityConfig.maze_level}
          onComplete={handleGameComplete}
        />
      </div>

      {/* Side Panel - Combined Stats & Tips */}
      <div className="w-full lg:w-72 space-y-3 flex-shrink-0">
        {/* Combined Stats & Tips Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          {/* Progress Stats */}
          {attempt && (
            <>
              <h3 className="font-bold text-sm mb-3 text-gray-900 flex items-center gap-2">
                <span>📊</span> Progress Kamu
              </h3>
              <AttemptStats attempt={attempt} activityConfig={activityConfig} />
              <div className="border-t border-gray-200 my-3"></div>
            </>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200">
            <h4 className="font-bold text-xs mb-2 text-orange-800 flex items-center gap-1">
              <span>💡</span> Tips
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Gunakan blok seminimal mungkin untuk ⭐⭐</li>
              <li>• Selesaikan secepat mungkin untuk ⭐⭐⭐</li>
              <li>• Klik Run untuk test program kamu</li>
            </ul>
          </div>
        </div>
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
          xp={earnedXp}
          onClose={() => setShowCompletion(false)}
          onNext={() => {
            // Navigate to next lesson (handled by parent)
            setShowCompletion(false)
          }}
        />
      )}
    </div>
  )
}

export default MazePractice
