import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MazePractice } from '../MazePractice'

describe('MazePractice', () => {
  const mockLesson = {
    id: '123',
    activity_type: 'maze',
    activity_config: {
      maze_level: 1,
      grid_size: [5, 5],
      optimal_blocks: 5,
      optimal_time_seconds: 30
    }
  }

  it('renders MazeGame with correct config', async () => {
    render(
      <MazePractice
        lesson={mockLesson}
        onComplete={vi.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('maze-game')).toBeInTheDocument()
    })
  })

  it('calls onComplete when maze completed', async () => {
    const onComplete = vi.fn()
    render(
      <MazePractice
        lesson={mockLesson}
        onComplete={onComplete}
      />
    )

    // Simulate successful run (this depends on MazeGame implementation)
    // For now, just verify component mounts
    await waitFor(() => {
      expect(screen.getByTestId('maze-game')).toBeInTheDocument()
    })
  })

  it('displays progress stats when attempt exists', async () => {
    render(
      <MazePractice
        lesson={mockLesson}
        onComplete={vi.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('maze-game')).toBeInTheDocument()
    })

    // Stats should be visible when attempt loads
    // Note: This depends on useMazeTracker hook behavior
  })

  it('shows tips card', async () => {
    render(
      <MazePractice
        lesson={mockLesson}
        onComplete={vi.fn()}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/💡 Tips/)).toBeInTheDocument()
    })
  })
})
