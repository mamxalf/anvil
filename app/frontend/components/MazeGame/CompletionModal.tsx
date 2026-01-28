import React from 'react'
import { X, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CompletionModalProps {
  stars: number
  xp: number
  onClose: () => void
  onNext?: () => void
}

export function CompletionModal({ stars, xp, onClose, onNext }: CompletionModalProps) {
  const renderStars = () => {
    return Array.from({ length: 3 }).map((_, i) => (
      <span
        key={i}
        className={cn(
          'text-4xl transition-all',
          i < stars ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
        )}
      >
        ⭐
      </span>
    ))
  }

  const getStarMessage = () => {
    if (stars === 3) return 'Perfect! ⭐⭐⭐'
    if (stars === 2) return 'Great Job! ⭐⭐'
    return 'Good Job! ⭐'
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="flex flex-col items-center py-6">
            {/* Trophy Icon */}
            <div className="mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-4">
              <Trophy className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-center mb-2">
              {getStarMessage()}
            </h2>

            {/* Stars */}
            <div className="flex gap-2 mb-6">
              {renderStars()}
            </div>

            {/* XP */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">XP Earned</p>
              <p className="text-3xl font-black text-orange-600">+{xp}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Review
              </Button>
              {onNext && (
                <Button
                  onClick={onNext}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Next Lesson
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
