import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSmartHints } from '../useSmartHints'
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
  })

  it('fetches hints on mount', async () => {
    vi.mocked(api.fetchHints).mockResolvedValue(mockHints)

    const { result } = renderHook(() => useSmartHints('lesson_123', null))

    await waitFor(() => {
      expect(result.current.hints).toHaveLength(2)
    })
  })

  it('shows beginner hint after 3 failed runs', async () => {
    vi.mocked(api.fetchHints).mockResolvedValue(mockHints)

    const { result } = renderHook(() => useSmartHints('lesson_123', null))

    await waitFor(() => {
      expect(result.current.hints).toHaveLength(2)
    })

    const attemptWithFailures = {
      id: 'att_1',
      failed_runs: 3,
      time_elapsed_seconds: 30
    }

    act(() => {
      renderHook(() => useSmartHints('lesson_123', attemptWithFailures))
    })

    await waitFor(() => {
      expect(result.current.visibleHint?.tier).toBe('beginner')
    })
  })

  it('dismisses hint and does not show again', async () => {
    vi.mocked(api.fetchHints).mockResolvedValue(mockHints)

    const { result } = renderHook(() => useSmartHints('lesson_123', null))

    await waitFor(() => {
      expect(result.current.hints).toHaveLength(2)
    })

    // Show hint manually
    act(() => {
      result.current.visibleHint = mockHints[0]
    })

    // Dismiss
    act(() => {
      result.current.dismissHint()
    })

    expect(result.current.visibleHint).toBeNull()
  })
})
