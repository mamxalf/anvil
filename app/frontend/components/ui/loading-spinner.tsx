import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" aria-hidden="true" />
      <p className="mt-4 text-gray-500" role="status">{message}</p>
    </div>
  )
}
