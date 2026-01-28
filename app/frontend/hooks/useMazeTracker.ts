import { useState, useEffect, useCallback, useRef } from 'react'
import { getActiveAttempt, createAttempt, syncAttempt } from '@/lib/api'

export interface MazeAttempt {
  id: string
  status: string
  blocks_used: number
  time_elapsed_seconds: number
  failed_runs: number
}

export function useMazeTracker(lessonId: string) {
  const [attempt, setAttempt] = useState<MazeAttempt | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const syncTimer = useRef<NodeJS.Timeout>()

  // Load or create attempt on mount
  useEffect(() => {
    const loadOrCreateAttempt = async () => {
      try {
        // Check for existing active attempt
        const existing = await getActiveAttempt(lessonId)

        if (existing) {
          setAttempt(existing)
        } else {
          // Create new attempt
          const created = await createAttempt(lessonId)
          setAttempt(created)
        }
      } catch (error) {
        console.error('Failed to load/create attempt:', error)
      }
    }

    loadOrCreateAttempt()
  }, [lessonId])

  // Auto-sync every 10 seconds if there are changes
  useEffect(() => {
    if (!attempt || !hasChanges) return

    syncTimer.current = setInterval(async () => {
      try {
        await syncAttempt(attempt.id, attempt)
        setHasChanges(false)
      } catch (error) {
        console.error('Failed to sync attempt:', error)
      }
    }, 10000)

    return () => {
      if (syncTimer.current) {
        clearInterval(syncTimer.current)
      }
    }
  }, [attempt, hasChanges])

  const updateAttempt = useCallback((updates: Partial<MazeAttempt>) => {
    setAttempt(prev => prev ? { ...prev, ...updates } : null)
    setHasChanges(true)
  }, [])

  // Sync immediately on critical events (exposed for manual sync)
  const immediateSync = useCallback(async () => {
    if (!attempt || !hasChanges) return

    try {
      const updated = await syncAttempt(attempt.id, attempt)
      setAttempt(updated)
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to sync immediately:', error)
    }
  }, [attempt, hasChanges])

  return {
    attempt,
    updateAttempt,
    immediateSync
  }
}
