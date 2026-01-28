import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CompletionModal } from '../CompletionModal'

describe('CompletionModal', () => {
  it('displays correct number of stars', () => {
    render(
      <CompletionModal
        stars={3}
        xp={150}
        onClose={vi.fn()}
        onNext={vi.fn()}
      />
    )
    const stars = screen.getAllByText(/⭐/)
    expect(stars).toHaveLength(3)
  })

  it('displays correct star message for 3 stars', () => {
    render(
      <CompletionModal
        stars={3}
        xp={150}
        onClose={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('Perfect! ⭐⭐⭐')).toBeInTheDocument()
  })

  it('displays correct star message for 2 stars', () => {
    render(
      <CompletionModal
        stars={2}
        xp={100}
        onClose={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('Great Job! ⭐⭐')).toBeInTheDocument()
  })

  it('displays correct star message for 1 star', () => {
    render(
      <CompletionModal
        stars={1}
        xp={50}
        onClose={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText('Good Job! ⭐')).toBeInTheDocument()
  })

  it('displays XP earned', () => {
    render(
      <CompletionModal
        stars={2}
        xp={100}
        onClose={vi.fn()}
        onNext={vi.fn()}
      />
    )
    expect(screen.getByText(/\+100/)).toBeInTheDocument()
  })

  it('calls onClose when Review button clicked', () => {
    const handleClose = vi.fn()
    render(
      <CompletionModal
        stars={3}
        xp={150}
        onClose={handleClose}
        onNext={vi.fn()}
      />
    )
    fireEvent.click(screen.getByText(/Review/))
    expect(handleClose).toHaveBeenCalled()
  })

  it('calls onNext when Next Lesson button clicked', () => {
    const handleNext = vi.fn()
    render(
      <CompletionModal
        stars={3}
        xp={150}
        onClose={vi.fn()}
        onNext={handleNext}
      />
    )
    fireEvent.click(screen.getByText(/Next Lesson/))
    expect(handleNext).toHaveBeenCalled()
  })

  it('does not show Next Lesson button if onNext not provided', () => {
    render(
      <CompletionModal
        stars={3}
        xp={150}
        onClose={vi.fn()}
      />
    )
    expect(screen.queryByText(/Next Lesson/)).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn()
    render(
      <CompletionModal
        stars={3}
        xp={150}
        onClose={handleClose}
        onNext={vi.fn()}
      />
    )
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalled()
  })
})
