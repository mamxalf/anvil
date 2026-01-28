import { useState, useEffect, useCallback } from 'react'
import { fetchHints } from '@/lib/api'

export interface LessonHint {
  id: string
  tier: 'beginner' | 'intermediate' | 'advanced'
  content: string
  trigger_config: {
    failed_runs_threshold: number
    time_threshold_seconds: number
    show_immediately: boolean
  }
}

export interface MazeAttempt {
  id: string
  failed_runs: number
  time_elapsed_seconds: number
}

export function useSmartHints(lessonId: string, attempt: MazeAttempt | null) {
  const [hints, setHints] = useState<LessonHint[]>([])
  const [visibleHint, setVisibleHint] = useState<LessonHint | null>(null)
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set())

  // Fetch hints for lesson
  useEffect(() => {
    const loadHints = async () => {
      try {
        const fetched = await fetchHints(lessonId)
        setHints(fetched)
      } catch (error) {
        console.error('Failed to fetch hints:', error)
      }
    }

    loadHints()
  }, [lessonId])

  // Check hint triggers based on attempt state
  useEffect(() => {
    if (!attempt || dismissedHints.size >= hints.length) return

    hints.forEach(hint => {
      // Skip if already dismissed
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

  const dismissHint = useCallback(() => {
    if (visibleHint) {
      setDismissedHints(prev => new Set([...prev, visibleHint.id]))
      setVisibleHint(null)
    }
  }, [visibleHint])

  return {
    hints,
    visibleHint,
    dismissHint
  }
}
