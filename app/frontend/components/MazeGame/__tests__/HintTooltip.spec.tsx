import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HintTooltip } from '../HintTooltip'

describe('HintTooltip', () => {
  const mockHint = {
    id: 'h1',
    tier: 'beginner' as const,
    content: 'Use forward blocks to move',
    trigger_config: { failed_runs_threshold: 3 }
  }

  it('renders hint content', () => {
    render(
      <HintTooltip
        hint={mockHint}
        onClose={vi.fn()}
        position="bottom-right"
      />
    )

    expect(screen.getByText('Use forward blocks to move')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn()
    render(
      <HintTooltip
        hint={mockHint}
        onClose={handleClose}
        position="bottom-right"
      />
    )

    const closeButton = screen.getAllByRole('button').find(b => b.textContent === '×')
    fireEvent.click(closeButton!)

    expect(handleClose).toHaveBeenCalled()
  })

  it('calls onClose when dismiss button clicked', () => {
    const handleClose = vi.fn()
    render(
      <HintTooltip
        hint={mockHint}
        onClose={handleClose}
        position="bottom-right"
      />
    )

    fireEvent.click(screen.getByText(/Mengerti/))

    expect(handleClose).toHaveBeenCalled()
  })
})
