import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { SimulationEngine } from './Engine'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface StageProps {
  engine: SimulationEngine
}

export interface StageRef {
  run: (code: string) => Promise<void>
  reset: () => void
}

const GRID_SIZE = 5
const CELL_SIZE = 60

const Stage = forwardRef<StageRef, StageProps>(({ engine }, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }) // 0,0 is bottom-left
  const [direction, setDirection] = useState(0) // 0: Right, 90: Up, 180: Left, 270: Down
  const [isRunning, setIsRunning] = useState(false)

  // Initial state
  const resetState = () => {
    setPosition({ x: 0, y: 0 })
    setDirection(0)
    setIsRunning(false)
  }

  useImperativeHandle(ref, () => ({
    run: async (code: string) => {
      if (isRunning) return
      setIsRunning(true)
      resetState() // Start from beginning

      const commands = engine.parse(code)
      console.log('Commands:', commands)

      // Execute commands with delay
      for (const cmd of commands) {
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (cmd === 'MOVE_FORWARD') {
          setPosition((prev) => {
            let { x, y } = prev
            // Calculate new position based on direction
            // Note: Standard math: 0 deg = Right.
            // direction is in degrees.
            // We normalize to ensure we handle > 360 or < 0
            const dir = ((direction % 360) + 360) % 360

            if (dir === 0) x = Math.min(x + 1, GRID_SIZE - 1)
            else if (dir === 90)
              y = Math.min(y + 1, GRID_SIZE - 1) // Up
            else if (dir === 180) x = Math.max(x - 1, 0)
            else if (dir === 270) y = Math.max(y - 1, 0) // Down

            return { x, y }
          })
        } else if (cmd === 'TURN_LEFT') {
          setDirection((prev) => prev + 90)
        } else if (cmd === 'TURN_RIGHT') {
          setDirection((prev) => prev - 90)
        }
      }
      setIsRunning(false)
    },
    reset: resetState,
  }))

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-700">KodiLab Simulation</h3>

      <div
        className="relative bg-white border border-gray-300 shadow-sm"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          backgroundImage:
            'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
      >
        {/* Character */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
          animate={{
            x: position.x * CELL_SIZE,
            y: (GRID_SIZE - 1 - position.y) * CELL_SIZE, // Flip Y for typical cartesian (0,0 at bottom left) vs DOM (0,0 top left)
            rotate: -direction, // Rotate counter to match our logic if needed, or check alignment
            // Actually, framer motion rotation: positive is clockwise.
            // Our logic: +90 is Turn Left (Up). Visual: 0 is Right.
            // 0 -> > (Right)
            // 90 -> ^ (Up) -- this is -90 in css rotation if 0 is right
            // Let's adjust visualization rotation:
            // If 0 is Right (User icon default?),
            // Turn Left (+90 logic) should point result UP.
            // CSS Rotate -90 makes it point UP.
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="text-blue-600">
            {/* Simple Arrow or Avatar */}
            <User size={40} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />{' '}
            {/* Indicator necessary to see rotation */}
          </div>
        </motion.div>

        {/* Overlay Grid lines for clarity */}
        {Array.from({ length: GRID_SIZE }).map((_, i) =>
          Array.from({ length: GRID_SIZE }).map((_, j) => (
            <div
              key={`${i}-${j}`}
              className="absolute border-gray-100 border pointer-events-none"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: i * CELL_SIZE,
                top: j * CELL_SIZE,
              }}
            />
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Position: ({position.x}, {position.y}) | Direction: {((direction % 360) + 360) % 360}°
      </div>
    </div>
  )
})

export default Stage
