import React from 'react'
import { Lightbulb, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LessonHint } from '@/hooks/useSmartHints'

interface HintTooltipProps {
  hint: LessonHint
  onClose: () => void
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function HintTooltip({ hint, onClose, position = 'bottom-right' }: HintTooltipProps) {
  const positionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const tierNumber = hint.tier === 'beginner' ? 1 : hint.tier === 'intermediate' ? 2 : 3

  return (
    <div
      className={cn(
        'fixed z-50 w-80 bg-white rounded-2xl shadow-2xl border-2 border-orange-400 overflow-hidden animate-in slide-in-from-bottom-4',
        positionClasses[position]
      )}
      role="dialog"
      aria-labelledby="hint-title"
      aria-live="polite"
      aria-describedby="hint-content"
    >
      {/* Screen reader title */}
      <div id="hint-title" className="sr-only">
        Hint {tierNumber}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
          <span className="font-black text-sm uppercase tracking-wider">
            Hint {tierNumber}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          aria-label="Close hint"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div id="hint-content" className="p-4 bg-orange-50">
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
          aria-label="Dismiss hint"
        >
          Mengerti! 👍
        </Button>
      </div>
    </div>
  )
}
