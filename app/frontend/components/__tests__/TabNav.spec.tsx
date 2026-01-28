import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TabNav } from '../TabNav'

describe('TabNav', () => {
  const tabs = [
    { id: 'materi', label: '📚 Materi', unlocked: true },
    { id: 'praktik', label: '🎮 Praktik', unlocked: false }
  ]

  it('renders all tabs', () => {
    render(
      <TabNav
        activeTab="materi"
        onTabChange={vi.fn()}
        tabs={tabs}
      />
    )

    expect(screen.getByText('📚 Materi')).toBeInTheDocument()
    expect(screen.getByText('🎮 Praktik')).toBeInTheDocument()
  })

  it('highlights active tab', () => {
    render(
      <TabNav
        activeTab="materi"
        onTabChange={vi.fn()}
        tabs={tabs}
      />
    )

    const materiTab = screen.getByText('📚 Materi').closest('button')
    expect(materiTab).toHaveClass('border-orange-500')
  })

  it('calls onTabChange when clicking unlocked tab', () => {
    const handleChange = vi.fn()
    render(
      <TabNav
        activeTab="materi"
        onTabChange={handleChange}
        tabs={tabs}
      />
    )

    fireEvent.click(screen.getByText('📚 Materi'))
    expect(handleChange).toHaveBeenCalledWith('materi')
  })

  it('disables locked tab', () => {
    render(
      <TabNav
        activeTab="materi"
        onTabChange={vi.fn()}
        tabs={tabs}
      />
    )

    const praktikTab = screen.getByText('🎮 Praktik').closest('button')
    expect(praktikTab).toBeDisabled()
  })
})
