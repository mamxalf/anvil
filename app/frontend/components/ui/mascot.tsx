// import React from 'react'

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'teaching'
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Mascot({
  mood = 'happy',
  message,
  className = '',
  size = 'md',
}: MascotProps) {
  // Simple emoji mapping for now until assets are ready
  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🤖'
      case 'thinking':
        return '🤔'
      case 'celebrating':
        return '🎉'
      case 'teaching':
        return '👨‍🏫'
      default:
        return '🤖'
    }
  }

  const getMascotImage = () => {
    switch (mood) {
      case 'happy':
        return '3D-I.png'
      case 'thinking':
        return '3D-I.png' // Reuse until specific asset available
      case 'celebrating':
        return '3D-III.png'
      case 'teaching':
        return '3D-II.png'
      default:
        return '3D-I.png'
    }
  }

  const sizes = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-9xl',
  }

  return (
    <div className={`flex items-end gap-4 ${className}`}>
      <div
        className={`mascot-avatar ${sizes[size]} filter drop-shadow-lg transition-transform hover:scale-110 cursor-pointer`}
      >
        {/* {getMascotEmoji()} */}
        <img
          src={`/assets/${getMascotImage()}`}
          alt={`Mascot ${mood}`}
          className="w-auto h-full object-contain"
          onError={(e) => {
            // Fallback to emoji if image fails
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement!.innerText = getMascotEmoji()
          }}
        />
      </div>

      {message && (
        <div className="bg-white border-2 border-primary/20 p-4 rounded-2xl rounded-bl-none shadow-md mb-8 max-w-xs relative animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-gray-800 font-medium font-heading">{message}</p>
        </div>
      )}
    </div>
  )
}
