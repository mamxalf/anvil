import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useMazeTracker } from '../useMazeTracker'
import * as api from '@/lib/api'

vi.mock('@/lib/api')

describe('useMazeTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates new attempt if no active attempt exists', async () => {
    vi.mocked(api.getActiveAttempt).mockResolvedValue(null)
    vi.mocked(api.createAttempt).mockResolvedValue({
      id: 'att_1',
      status: 'in_progress',
      blocks_used: 0,
      time_elapsed_seconds: 0
    })

    const { result } = renderHook(() => useMazeTracker('lesson_123'))

    await waitFor(() => {
      expect(result.current.attempt).not.toBeNull()
      expect(result.current.attempt?.id).toBe('att_1')
    })
  })

  it('restores existing active attempt', async () => {
    vi.mocked(api.getActiveAttempt).mockResolvedValue({
      id: 'att_1',
      status: 'in_progress',
      blocks_used: 3
    })

    const { result } = renderHook(() => useMazeTracker('lesson_123'))

    await waitFor(() => {
      expect(result.current.attempt?.id).toBe('att_1')
      expect(result.current.attempt?.blocks_used).toBe(3)
    })
  })

  it('updates attempt and syncs to backend', async () => {
    vi.mocked(api.getActiveAttempt).mockResolvedValue({
      id: 'att_1',
      status: 'in_progress'
    })

    vi.mocked(api.syncAttempt).mockResolvedValue({
      id: 'att_1',
      blocks_used: 5
    })

    const { result } = renderHook(() => useMazeTracker('lesson_123'))

    await waitFor(() => {
      expect(result.current.attempt).not.toBeNull()
    })

    act(() => {
      result.current.updateAttempt({ blocks_used: 5 })
    })

    await waitFor(() => {
      expect(api.syncAttempt).toHaveBeenCalledWith('att_1', { blocks_used: 5 })
    })
  })
})
