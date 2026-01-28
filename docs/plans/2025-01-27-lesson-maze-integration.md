# Lesson Maze Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Code.org-style maze lesson interface with dynamic maze generation from lesson config, featuring a one-screen layout (material panel → canvas → Blockly) and a new lightweight maze engine.

**Architecture:** Build new LessonMaze container component with LessonMazeEngine (canvas-based) that reads lesson activity_config dynamically, replacing the hardcoded MazeGame/MazePractice approach. Keep existing MazeGame unchanged for standalone use.

**Tech Stack:** React 19, TypeScript, HTML5 Canvas, react-blockly, Inertia.js, Rails 8.1 backend API

---

## Task 1: Create MaterialPanel Collapsible Component

**Files:**
- Create: `app/frontend/components/MazeGame/MaterialPanel.tsx`

**Step 1: Create MaterialPanel component structure**

```typescript
import React, { useState } from 'react'
import { BookOpen, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MaterialPanelProps {
  content: string
  availableBlocks: string[]
  isExpanded: boolean
  onToggle: () => void
}

export function MaterialPanel({ content, availableBlocks, isExpanded, onToggle }: MaterialPanelProps) {
  return (
    <div className={cn(
      "bg-white border-b border-gray-200 transition-all duration-300 overflow-hidden",
      isExpanded ? "h-44" : "h-12"
    )}>
      {/* Collapsed state */}
      {!isExpanded && (
        <button
          onClick={onToggle}
          className="w-full h-12 flex items-center px-4 gap-2 hover:bg-gray-50 transition-colors"
          aria-label="Show lesson material"
        >
          <BookOpen className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-gray-700">📖 Materi</span>
          <span className="ml-auto text-orange-600 text-sm">▼ Show Instructions</span>
        </button>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <div className="p-4 h-44 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Tujuan Pembelajaran
            </h3>
            <button
              onClick={onToggle}
              className="text-orange-600 hover:text-orange-700 text-sm font-bold flex items-center gap-1"
              aria-label="Hide lesson material"
            >
              <span>Hide</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Lesson content */}
          <div
            className="prose prose-sm prose-orange max-w-none text-gray-600 mb-3"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Available blocks preview */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Blok yang tersedia:</p>
            <div className="flex gap-2 flex-wrap">
              {availableBlocks.map(block => (
                <span
                  key={block}
                  className="px-2 py-1 bg-orange-100 rounded-md text-xs font-bold text-orange-700 border border-orange-200"
                >
                  {block}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Export as default**

```typescript
// Add at end of MaterialPanel.tsx
export default MaterialPanel
```

**Step 3: Verify no TypeScript errors**

Run: `yarn eslint app/frontend/components/MazeGame/MaterialPanel.tsx`
Expected: No errors

**Step 4: Commit**

```bash
git add app/frontend/components/MazeGame/MaterialPanel.tsx
git commit -m "feat: add collapsible MaterialPanel component for maze lessons"
```

---

## Task 2: Create LessonMazeEngine Class

**Files:**
- Create: `app/frontend/components/MazeGame/LessonMazeEngine.ts`

**Step 1: Create engine structure with types**

```typescript
import type { MazeLevelConfig } from './MazeTypes'

export type Direction = 'up' | 'right' | 'down' | 'left'
export type MoveResult = 'success' | 'blocked' | 'crash'

interface Position {
  x: number
  y: number
}

interface EngineConfig {
  gridWidth: number
  gridHeight: number
  startPos: Position
  goalPos: Position
  obstacles: Position[]
}

export class LessonMazeEngine {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private config: EngineConfig | null = null

  // Dynamic state
  private characterPos: Position = { x: 0, y: 0 }
  private characterDirection: Direction = 'right'
  private isAnimating: boolean = false
  private moveCount: number = 0

  // Grid calculations
  private cellSize: number = 50
  private padding: number = 20

  // Images
  private characterImage: HTMLImageElement | null = null
  private goalImage: HTMLImageElement | null = null
  private imagesLoaded: boolean = false

  constructor() {
    this.loadImages()
  }
}
```

**Step 2: Implement image loading**

```typescript
private loadImages(): void {
  this.characterImage = new Image()
  this.goalImage = new Image()

  let loadedCount = 0

  const onImageLoad = () => {
    loadedCount++
    if (loadedCount === 2) {
      this.imagesLoaded = true
    }
  }

  // Use emoji as placeholder for now, can be replaced with actual sprites
  this.characterImage.onload = onImageLoad
  this.goalImage.onload = onImageLoad

  // Set src to trigger load (using data URLs for emoji as fallback)
  // In production, these would be actual image URLs
  this.characterImage.src = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><text y="40" font-size="40">🐰</text></svg>')
  this.goalImage.src = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><text y="40" font-size="40">🥕</text></svg>')
}
```

**Step 3: Implement initialize method**

```typescript
public initialize(canvas: HTMLCanvasElement, config: MazeLevelConfig): void {
  this.canvas = canvas
  this.ctx = canvas.getContext('2d')

  if (!this.ctx) {
    throw new Error('Could not get canvas context')
  }

  // Parse config
  this.config = {
    gridWidth: config.grid_size[0],
    gridHeight: config.grid_size[1],
    startPos: { x: config.start_pos[0], y: config.start_pos[1] },
    goalPos: { x: config.goal_pos[0], y: config.goal_pos[1] },
    obstacles: config.obstacles.map(([x, y]) => ({ x, y }))
  }

  // Calculate cell size to fit canvas
  const availableWidth = canvas.width - (this.padding * 2)
  const availableHeight = canvas.height - (this.padding * 2)
  this.cellSize = Math.min(
    availableWidth / this.config.gridWidth,
    availableHeight / this.config.gridHeight
  )

  // Reset state
  this.characterPos = { ...this.config.startPos }
  this.characterDirection = 'right'
  this.moveCount = 0
  this.isAnimating = false

  // Initial render
  this.render()
}
```

**Step 4: Implement render method**

```typescript
private render(): void {
  if (!this.canvas || !this.ctx || !this.config) return

  const { ctx, canvas } = this
  const { gridWidth, gridHeight, obstacles, goalPos } = this.config

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw background
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw grid
  this.drawGrid()

  // Draw obstacles
  ctx.fillStyle = '#dc2626'
  obstacles.forEach(pos => {
    const { x, y } = this.gridToCanvas(pos.x, pos.y)
    this.drawCell(x, y, '#ef4444', '#b91c1c')
  })

  // Draw goal
  const goalCanvasPos = this.gridToCanvas(goalPos.x, goalPos.y)
  this.drawCell(goalCanvasPos.x, goalCanvasPos.y, '#22c55e', '#16a34a')
  if (this.goalImage) {
    this.drawImage(this.goalImage, goalCanvasPos.x, goalCanvasPos.y)
  }

  // Draw character
  const charCanvasPos = this.gridToCanvas(this.characterPos.x, this.characterPos.y)
  this.drawCharacter(charCanvasPos.x, charCanvasPos.y)
}

private drawGrid(): void {
  if (!this.ctx || !this.config) return

  const { ctx } = this
  const { gridWidth, gridHeight } = this.config

  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1

  // Vertical lines
  for (let x = 0; x <= gridWidth; x++) {
    const startX = this.padding + (x * this.cellSize)
    ctx.beginPath()
    ctx.moveTo(startX, this.padding)
    ctx.lineTo(startX, this.padding + (gridHeight * this.cellSize))
    ctx.stroke()
  }

  // Horizontal lines
  for (let y = 0; y <= gridHeight; y++) {
    const startY = this.padding + (y * this.cellSize)
    ctx.beginPath()
    ctx.moveTo(this.padding, startY)
    ctx.lineTo(this.padding + (gridWidth * this.cellSize), startY)
    ctx.stroke()
  }
}

private drawCell(x: number, y: number, fillColor: string, borderColor: string): void {
  if (!this.ctx) return

  const { ctx } = this
  const size = this.cellSize - 2
  const offset = 1

  ctx.fillStyle = fillColor
  ctx.fillRect(x + offset, y + offset, size, size)

  ctx.strokeStyle = borderColor
  ctx.lineWidth = 2
  ctx.strokeRect(x + offset, y + offset, size, size)
}

private drawCharacter(canvasX: number, canvasY: number): void {
  if (!this.ctx) return

  const { ctx } = this
  const centerX = canvasX + (this.cellSize / 2)
  const centerY = canvasY + (this.cellSize / 2)

  if (this.characterImage && this.imagesLoaded) {
    this.drawImage(this.characterImage, canvasX, canvasY)
  } else {
    // Fallback: draw circle with direction indicator
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(centerX, centerY, this.cellSize * 0.35, 0, Math.PI * 2)
    ctx.fill()

    // Direction indicator
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    const indicatorLength = this.cellSize * 0.25
    switch (this.characterDirection) {
      case 'up':
        ctx.lineTo(centerX, centerY - indicatorLength)
        break
      case 'right':
        ctx.lineTo(centerX + indicatorLength, centerY)
        break
      case 'down':
        ctx.lineTo(centerX, centerY + indicatorLength)
        break
      case 'left':
        ctx.lineTo(centerX - indicatorLength, centerY)
        break
    }
    ctx.stroke()
  }
}

private drawImage(img: HTMLImageElement, canvasX: number, canvasY: number): void {
  if (!this.ctx) return

  const { ctx } = this
  const size = this.cellSize * 0.7
  const offset = (this.cellSize - size) / 2

  ctx.drawImage(img, canvasX + offset, canvasY + offset, size, size)
}

private gridToCanvas(gridX: number, gridY: number): { x: number, y: number } {
  return {
    x: this.padding + (gridX * this.cellSize),
    y: this.padding + (gridY * this.cellSize)
  }
}
```

**Step 5: Implement reset method**

```typescript
public reset(): void {
  if (!this.config) return

  this.characterPos = { ...this.config.startPos }
  this.characterDirection = 'right'
  this.moveCount = 0
  this.isAnimating = false
  this.render()
}
```

**Step 6: Implement movement methods**

```typescript
public async moveForward(): Promise<boolean> {
  if (!this.config || this.isAnimating) return false

  const { gridWidth, gridHeight, obstacles } = this.config

  // Calculate new position based on direction
  let newPos = { ...this.characterPos }

  switch (this.characterDirection) {
    case 'up':
      newPos.y -= 1
      break
    case 'right':
      newPos.x += 1
      break
    case 'down':
      newPos.y += 1
      break
    case 'left':
      newPos.x -= 1
      break
  }

  // Check bounds
  if (newPos.x < 0 || newPos.x >= gridWidth || newPos.y < 0 || newPos.y >= gridHeight) {
    return false // Out of bounds
  }

  // Check obstacles
  const isObstacle = obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y)
  if (isObstacle) {
    return false // Hit obstacle
  }

  // Animate movement
  this.isAnimating = true
  await this.animateMove(this.characterPos, newPos)
  this.characterPos = newPos
  this.moveCount++
  this.isAnimating = false

  this.render()
  return true
}

public async turnLeft(): Promise<void> {
  if (this.isAnimating) return

  this.isAnimating = true
  await this.animateTurn(-1) // -1 = left (counterclockwise)
  this.isAnimating = false
  this.render()
}

public async turnRight(): Promise<void> {
  if (this.isAnimating) return

  this.isAnimating = true
  await this.animateTurn(1) // 1 = right (clockwise)
  this.isAnimating = false
  this.render()
}

private async animateMove(from: Position, to: Position): Promise<void> {
  return new Promise(resolve => {
    const duration = 300 // ms
    const startTime = Date.now()
    const fromCanvas = this.gridToCanvas(from.x, from.y)
    const toCanvas = this.gridToCanvas(to.x, to.y)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease out)
      const eased = 1 - Math.pow(1 - progress, 3)

      // Interpolate position
      const currentX = fromCanvas.x + (toCanvas.x - fromCanvas.x) * eased
      const currentY = fromCanvas.y + (toCanvas.y - fromCanvas.y) * eased

      // Render with interpolated position
      this.render()
      this.drawCharacterAt(currentX, currentY)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(animate)
  })
}

private drawCharacterAt(canvasX: number, canvasY: number): void {
  // Same as drawCharacter but takes exact canvas coordinates
  if (!this.ctx) return

  const { ctx } = this
  const centerX = canvasX + (this.cellSize / 2)
  const centerY = canvasY + (this.cellSize / 2)

  if (this.characterImage && this.imagesLoaded) {
    const size = this.cellSize * 0.7
    const offset = (this.cellSize - size) / 2
    ctx.drawImage(this.characterImage, canvasX + offset, canvasY + offset, size, size)
  } else {
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(centerX, centerY, this.cellSize * 0.35, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    const indicatorLength = this.cellSize * 0.25
    switch (this.characterDirection) {
      case 'up':
        ctx.lineTo(centerX, centerY - indicatorLength)
        break
      case 'right':
        ctx.lineTo(centerX + indicatorLength, centerY)
        break
      case 'down':
        ctx.lineTo(centerX, centerY + indicatorLength)
        break
      case 'left':
        ctx.lineTo(centerX - indicatorLength, centerY)
        break
    }
    ctx.stroke()
  }
}

private async animateTurn(direction: number): Promise<void> {
  return new Promise(resolve => {
    const duration = 150 // ms
    const startTime = Date.now()

    const directions: Direction[] = ['up', 'right', 'down', 'left']
    const currentIndex = directions.indexOf(this.characterDirection)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Calculate intermediate rotation
      const startAngle = currentIndex * (Math.PI / 2)
      const targetIndex = (currentIndex + direction + 4) % 4
      const targetAngle = targetAngle * (Math.PI / 2)
      const currentAngle = startAngle + (targetAngle - startAngle) * progress

      // Render with rotated character
      this.render()
      this.drawCharacterRotated(this.characterPos, currentAngle)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Update actual direction
        this.characterDirection = directions[targetIndex]
        resolve()
      }
    }

    requestAnimationFrame(animate)
  })
}

private drawCharacterRotated(pos: Position, angle: number): void {
  if (!this.ctx || !this.canvas) return

  const { ctx } = this
  const canvasPos = this.gridToCanvas(pos.x, pos.y)
  const centerX = canvasPos.x + (this.cellSize / 2)
  const centerY = canvasPos.y + (this.cellSize / 2)

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(angle)

  if (this.characterImage && this.imagesLoaded) {
    const size = this.cellSize * 0.7
    ctx.drawImage(this.characterImage, -size/2, -size/2, size, size)
  } else {
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(0, 0, this.cellSize * 0.35, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -this.cellSize * 0.25)
    ctx.stroke()
  }

  ctx.restore()
}
```

**Step 7: Implement result checking**

```typescript
public checkResult(): 'success' | 'failure' | 'inprogress' {
  if (!this.config) return 'inprogress'

  const { goalPos } = this.config

  // Check if character reached goal
  if (this.characterPos.x === goalPos.x && this.characterPos.y === goalPos.y) {
    return 'success'
  }

  // If still running, it's in progress
  // (failure is determined during moveForward when blocked)
  return 'inprogress'
}

public getMoveCount(): number {
  return this.moveCount
}
```

**Step 8: Add getCanvasSize helper**

```typescript
public getRecommendedCanvasSize(): { width: number, height: number } {
  // For a 5x5 grid with padding
  const defaultGridSize = 5
  const defaultCellSize = 60
  const padding = 40

  return {
    width: (defaultGridSize * defaultCellSize) + padding,
    height: (defaultGridSize * defaultCellSize) + padding
  }
}
```

**Step 9: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: No type errors

**Step 10: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMazeEngine.ts
git commit -m "feat: add LessonMazeEngine for dynamic maze rendering from lesson config"
```

---

## Task 3: Create LessonMazeInterpreter

**Files:**
- Create: `app/frontend/components/MazeGame/LessonMazeInterpreter.ts`

**Step 1: Create interpreter class**

```typescript
import type { LessonMazeEngine } from './LessonMazeEngine'

export class LessonMazeInterpreter {
  private engine: LessonMazeEngine
  private isRunning: boolean = false
  private shouldStop: boolean = false

  constructor(engine: LessonMazeEngine) {
    this.engine = engine
  }

  async execute(code: string): Promise<'success' | 'failure'> {
    if (this.isRunning) {
      throw new Error('Interpreter already running')
    }

    this.isRunning = true
    this.shouldStop = false

    try {
      // Create API object with engine methods
      const api = {
        moveForward: async () => {
          if (this.shouldStop) return
          const moved = await this.engine.moveForward()
          if (!moved) {
            this.shouldStop = true
            throw new Error('Blocked or crashed')
          }
          await this.delay(300)
        },
        turnLeft: async () => {
          if (this.shouldStop) return
          await this.engine.turnLeft()
          await this.delay(150)
        },
        turnRight: async () => {
          if (this.shouldStop) return
          await this.engine.turnRight()
          await this.delay(150)
        }
      }

      // Transform and execute code
      await this.executeCode(code, api)

      // Check result
      const result = this.engine.checkResult()
      return result === 'success' ? 'success' : 'failure'

    } catch (error) {
      console.error('Execution error:', error)
      return 'failure'
    } finally {
      this.isRunning = false
    }
  }

  stop(): void {
    this.shouldStop = true
    this.isRunning = false
  }

  private async executeCode(code: string, api: ReturnType<typeof this.createApi>): Promise<void> {
    // Create async function from code
    const asyncCode = `
      return (async function() {
        ${code}
      })();
    `

    // Create function with API methods
    const fn = new Function(
      'moveForward',
      'turnLeft',
      'turnRight',
      asyncCode
    )

    // Execute with API
    await fn(
      api.moveForward,
      api.turnLeft,
      api.turnRight
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

**Step 2: Export as default**

```typescript
export default LessonMazeInterpreter
```

**Step 3: Verify TypeScript compilation**

Run: `yarn tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMazeInterpreter.ts
git commit -m "feat: add LessonMazeInterpreter for executing Blockly code"
```

---

## Task 4: Create LessonMaze Container Component

**Files:**
- Create: `app/frontend/components/MazeGame/LessonMaze.tsx`

**Step 1: Create component structure**

```typescript
import React, { useState, useRef, useEffect } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlocklyWorkspace } from 'react-blockly'
import * as Blockly from 'blockly/core'
import { javascriptGenerator, javascriptGenerator } from 'blockly/javascript'
import MaterialPanel from './MaterialPanel'
import { LessonMazeEngine } from './LessonMazeEngine'
import { LessonMazeInterpreter } from './LessonMazeInterpreter'
import { useMazeTracker } from '@/hooks/useMazeTracker'
import { completeAttempt } from '@/lib/api'
import type { MazeLevelConfig } from './MazeTypes'
import { HintTooltip } from './HintTooltip'
import { CompletionModal } from './CompletionModal'
import { useSmartHints } from '@/hooks/useSmartHints'

interface LessonMazeProps {
  lessonId: string
  activityConfig: MazeLevelConfig
  onComplete: (stars: number) => void
}

export function LessonMaze({ lessonId, activityConfig, onComplete }: LessonMazeProps) {
  const [materialExpanded, setMaterialExpanded] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState('')
  const [showCompletion, setShowCompletion] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [blockCount, setBlockCount] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<LessonMazeEngine | null>(null)
  const interpreterRef = useRef<LessonMazeInterpreter | null>(null)

  const { attempt, updateAttempt, immediateSync } = useMazeTracker(lessonId)
  const { visibleHint, dismissHint } = useSmartHints(lessonId, attempt)

  // Initialize engine
  useEffect(() => {
    if (canvasRef.current) {
      const engine = new LessonMazeEngine()
      engine.initialize(canvasRef.current, activityConfig)
      engineRef.current = engine
      interpreterRef.current = new LessonMazeInterpreter(engine)
    }
  }, [activityConfig])

  // Reset when lesson changes
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      engineRef.current = null
      interpreterRef.current = null
    }
  }, [lessonId])

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.reset()
      setBlockCount(0)
      setIsRunning(false)
    }
  }

  const handleRun = async () => {
    if (!interpreterRef.current || isRunning) return

    setIsRunning(true)
    updateAttempt({
      blocks_used: blockCount,
      time_elapsed_seconds: 0
    })

    try {
      const result = await interpreterRef.current.execute(code)

      // Sync attempt
      await immediateSync()

      if (result === 'success' && attempt) {
        const response = await completeAttempt(attempt.id, {
          blocks_used: blockCount,
          time_elapsed_seconds: 0 // Will be calculated by backend
        })

        setEarnedStars(response.attempt.stars_earned)
        setEarnedXp(response.xp_earned)
        setShowCompletion(true)
        onComplete(response.attempt.stars_earned)
      }
    } catch (error) {
      console.error('Execution error:', error)
      // Increment failed runs
      if (attempt) {
        updateAttempt({
          failed_runs: (attempt.failed_runs || 0) + 1
        })
        await immediateSync()
      }
    } finally {
      setIsRunning(false)
    }
  }

  const handleWorkspaceChange = () => {
    const workspace = Blockly.getMainWorkspace()
    if (workspace) {
      const newCode = javascriptGenerator.workspaceToCode(workspace)
      setCode(newCode)
      setBlockCount(workspace.getAllBlocks(false).length)
    }
  }

  const toolbox = {
    kind: 'categoryToolbox',
    contents: activityConfig.available_blocks.map(block => {
      if (block === 'forward') {
        return {
          kind: 'block',
          type: 'move_forward'
        }
      } else if (block === 'turn_left') {
        return {
          kind: 'block',
          type: 'turn_left'
        }
      } else if (block === 'turn_right') {
        return {
          kind: 'block',
          type: 'turn_right'
        }
      }
      return null
    }).filter(Boolean)
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Material Panel */}
      <MaterialPanel
        content="" // Will be passed from lesson content
        availableBlocks={activityConfig.available_blocks}
        isExpanded={materialExpanded}
        onToggle={() => setMaterialExpanded(!materialExpanded)}
      />

      {/* Maze Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="bg-white rounded-xl shadow-lg border-2 border-orange-200"
          />
        </div>
      </div>

      {/* Blockly + Controls */}
      <div className="h-80 bg-white border-t border-gray-200 flex flex-col">
        {/* Control Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <span>Blocks: {blockCount}</span>
            <span className="text-gray-400">|</span>
            <span>Optimal: {activityConfig.optimal_blocks}</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={handleRun}
              disabled={isRunning || blockCount === 0}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>

        {/* Blockly Workspace */}
        <div className="flex-1 relative">
          <BlocklyWorkspace
            className="w-full h-full"
            toolboxConfiguration={toolbox}
            workspaceConfiguration={{
              grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
              },
              zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
              },
              trashcan: true
            }}
            onWorkspaceChange={handleWorkspaceChange}
          />
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal
          stars={earnedStars}
          xp={earnedXp}
          onClose={() => setShowCompletion(false)}
          onNext={() => {
            setShowCompletion(false)
            // Navigate to next lesson (handled by parent)
          }}
        />
      )}

      {/* Hint Tooltip */}
      {visibleHint && (
        <HintTooltip
          hint={visibleHint}
          onClose={dismissHint}
          position="bottom-right"
        />
      )}
    </div>
  )
}

export default LessonMaze
```

**Step 2: Verify TypeScript compilation**

Run: `yarn tsc --noEmit app/frontend/components/MazeGame/LessonMaze.tsx`
Expected: No errors

**Step 3: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMaze.tsx
git commit -m "feat: add LessonMaze container component with canvas-first layout"
```

---

## Task 5: Define Custom Blockly Blocks

**Files:**
- Create: `app/frontend/components/Blockly/MazeBlocks.ts`
- Modify: `app/frontend/components/Blockly/Generator.ts` (add move_forward, turn_left, turn_right)

**Step 1: Create maze block definitions**

```typescript
import * as Blockly from 'blockly/core'

// Forward block
Blockly.Blocks['move_forward'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('maju ke depan')
      .appendField(new Blockly.FieldImage('/images/maze/forward.svg', 30, 30, undefined, undefined, false))
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(120)
    this.setTooltip('Gerakkan karakter ke depan satu petak')
  }
}

// Turn left block
Blockly.Blocks['turn_left'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('belok kiri')
      .appendField(new Blockly.FieldImage('/images/maze/left.svg', 30, 30, undefined, undefined, false))
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(210)
    this.setTooltip('Belok ke kiri 90 derajat')
  }
}

// Turn right block
Blockly.Blocks['turn_right'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('belok kanan')
      .appendField(new Blockly.FieldImage('/images/maze/right.svg', 30, 30, undefined, undefined, false))
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(210)
    this.setTooltip('Belok ke kanan 90 derajat')
  }
}

javascriptGenerator.forBlock['move_forward'] = function(block, generator) {
  return 'await moveForward();\n'
}

javascriptGenerator.forBlock['turn_left'] = function(block, generator) {
  return 'await turnLeft();\n'
}

javascriptGenerator.forBlock['turn_right'] = function(block, generator) {
  return 'await turnRight();\n'
}

export function defineMazeBlocks() {
  // Blocks are already defined above
}
```

**Step 2: Initialize blocks in component**

```typescript
// Add to LessonMaze.tsx imports
import { defineMazeBlocks } from '@/components/Blockly/MazeBlocks'

// Add to useEffect in LessonMaze before engine initialization
useEffect(() => {
  defineMazeBlocks()
}, [])
```

**Step 3: Commit**

```bash
git add app/frontend/components/Blockly/MazeBlocks.ts
git commit -m "feat: add maze-specific Blockly blocks for lesson activities"
```

---

## Task 6: Update Learn.tsx to Use LessonMaze

**Files:**
- Modify: `app/frontend/Pages/Student/Courses/Learn.tsx` (line 340-350)

**Step 1: Update imports**

```typescript
// Change from:
import MazePractice from '@/components/MazeGame/MazePractice'

// To:
import LessonMaze from '@/components/MazeGame/LessonMaze'
```

**Step 2: Update component usage**

```typescript
// Find the praktik tab rendering (around line 338-351)
// Change from:
{activeTab === 'praktik' && (
  <Suspense fallback={<LoadingSpinner message="Memuat maze..." />}>
    <div className="h-[700px] lg:h-[800px]">
      <MazePractice
        lessonId={currentLesson.id}
        activityConfig={currentLesson.activity_config}
        onComplete={(stars) => {
          console.log('Maze completed with stars:', stars)
        }}
      />
    </div>
  </Suspense>
)}

// To:
{activeTab === 'praktik' && (
  <Suspense fallback={<LoadingSpinner message="Memuat maze..." />}>
    <div className="h-[calc(100vh-12rem)]">
      <LessonMaze
        lessonId={currentLesson.id}
        activityConfig={currentLesson.activity_config}
        onComplete={(stars) => {
          console.log('Maze completed with stars:', stars)
        }}
      />
    </div>
  </Suspense>
)}
```

**Step 3: Update height to use viewport calculation**

The height `h-[calc(100vh-12rem)]` ensures the maze fills available vertical space after accounting for header and padding.

**Step 4: Verify no errors**

Run: `yarn eslint app/frontend/Pages/Student/Courses/Learn.tsx`
Expected: No new errors

**Step 5: Commit**

```bash
git add app/frontend/Pages/Student/Courses/Learn.tsx
git commit -m "feat: use LessonMaze component for maze lesson activities"
```

---

## Task 7: Pass Lesson Content to MaterialPanel

**Files:**
- Modify: `app/frontend/Pages/Student/Courses/Learn.tsx`
- Modify: `app/frontend/components/MazeGame/LessonMaze.tsx`

**Step 1: Update LessonMaze props**

```typescript
// Add to LessonMazeProps interface
interface LessonMazeProps {
  lessonId: string
  activityConfig: MazeLevelConfig
  lessonContent: string  // Add this
  onComplete: (stars: number) => void
}

// Update component signature
export function LessonMaze({ lessonId, activityConfig, lessonContent, onComplete }: LessonMazeProps) {

  // Update MaterialPanel usage
  <MaterialPanel
    content={lessonContent}
    availableBlocks={activityConfig.available_blocks}
    isExpanded={materialExpanded}
    onToggle={() => setMaterialExpanded(!materialExpanded)}
  />
}
```

**Step 2: Pass content from Learn.tsx**

```typescript
<LessonMaze
  lessonId={currentLesson.id}
  activityConfig={currentLesson.activity_config}
  lessonContent={currentLesson.content || ''}
  onComplete={(stars) => {
    console.log('Maze completed with stars:', stars)
  }}
/>
```

**Step 3: Verify MaterialPanel renders content**

Run: `yarn tsc --noEmit`
Expected: No type errors

**Step 4: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMaze.tsx app/frontend/Pages/Student/Courses/Learn.tsx
git commit -m "feat: pass lesson content to MaterialPanel for display"
```

---

## Task 8: Add Canvas Size Calculation

**Files:**
- Modify: `app/frontend/components/MazeGame/LessonMaze.tsx`

**Step 1: Calculate responsive canvas size**

```typescript
// Add after imports
const getCanvasSize = (): { width: number, height: number } => {
  const maxWidth = 800
  const maxHeight = 600
  const gridSize = 5 // Default from activityConfig.maze_level

  // Calculate based on viewport
  const availableWidth = Math.min(window.innerWidth - 350, maxWidth) // -350 for sidebar
  const availableHeight = window.innerHeight - 300 // -300 for header + Blockly

  const cellSize = Math.floor(Math.min(
    availableWidth / gridSize,
    availableHeight / gridSize
  ))

  const padding = 40
  const size = (cellSize * gridSize) + padding

  return {
    width: Math.min(size, maxWidth),
    height: Math.min(size, maxHeight)
  }
}

const [canvasSize, setCanvasSize] = useState(getCanvasSize())

// Add resize listener
useEffect(() => {
  const handleResize = () => {
    setCanvasSize(getCanvasSize())
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// Update canvas element
<canvas
  ref={canvasRef}
  width={canvasSize.width}
  height={canvasSize.height}
  className="bg-white rounded-xl shadow-lg border-2 border-orange-200"
/>
```

**Step 5: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMaze.tsx
git commit -m "feat: add responsive canvas size calculation"
```

---

## Task 9: Add Error Handling and User Feedback

**Files:**
- Modify: `app/frontend/components/MazeGame/LessonMaze.tsx`

**Step 1: Add error state**

```typescript
const [error, setError] = useState<string | null>(null)

const handleRun = async () => {
  setError(null)

  if (!interpreterRef.current || isRunning) return

  if (blockCount === 0) {
    setError('Tambahkan blok dulu sebelum menjalankan!')
    return
  }

  setIsRunning(true)
  // ... rest of implementation
}
```

**Step 2: Add error display**

```typescript
{/* Error message */}
{error && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg">
    <p className="text-sm font-bold">{error}</p>
  </div>
)}
```

**Step 3: Add success feedback**

```typescript
// After successful run
if (result === 'success') {
  // Show confetti
  const canvas = canvasRef.current
  if (canvas) {
    const rect = canvas.getBoundingClientRect()
    // Trigger confetti at goal position
  }
}
```

**Step 4: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMaze.tsx
git commit -m "feat: add error handling and user feedback"
```

---

## Task 10: Add Progress Stats Sidebar

**Files:**
- Modify: `app/frontend/components/MazeGame/LessonMaze.tsx`

**Step 1: Add stats sidebar to layout**

```typescript
// Update return JSX structure
return (
  <div className="flex flex-col lg:flex-row h-full bg-gray-50">
    {/* Main Content */}
    <div className="flex-1 flex flex-col min-h-0">
      {/* Material Panel */}
      <MaterialPanel ... />

      {/* Maze Canvas */}
      <div className="flex-1 ...">...</div>

      {/* Blockly */}
      <div className="h-80 ...">...</div>
    </div>

    {/* Stats Sidebar - 288px wide */}
    {attempt && (
      <div className="hidden lg:block w-72 bg-white border-l border-gray-200 p-4 space-y-4 overflow-y-auto">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <span>📊</span> Progress Kamu
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Blocks:</span>
            <span className="font-bold">{attempt.blocks_used || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time:</span>
            <span className="font-bold">{attempt.time_elapsed_seconds || 0}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Failed:</span>
            <span className="font-bold">{attempt.failed_runs || 0}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200">
            <h4 className="font-bold text-xs mb-2 text-orange-800 flex items-center gap-1">
              <span>💡</span> Tips
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Gunakan blok seminimal mungkin</li>
              <li>• Selesaikan secepat mungkin</li>
              <li>• Coba jalankan untuk test</li>
            </ul>
          </div>
        </div>
      </div>
    )}
  </div>
)
```

**Step 2: Update canvas container for sidebar**

```typescript
// The maze canvas container should take flex-1, accounting for sidebar
<div className="flex-1 flex items-center justify-center p-4 min-h-0">
```

**Step 3: Commit**

```bash
git add app/frontend/components/MazeGame/LessonMaze.tsx
git commit -m "feat: add progress stats sidebar to LessonMaze"
```

---

## Task 11: Update Activity Controller to Pass Lesson Content

**Files:**
- Modify: `app/controllers/student/courses_controller.rb`

**Step 1: Add lesson content to currentLesson props**

```ruby
# In build_lesson_props method (around line 157)
def build_lesson_props(lesson)
  quiz = lesson.quiz
  quiz_attempt = quiz ? current_user.student_profile.quiz_attempts.in_progress.find_by(quiz: quiz) : nil

  {
    id: lesson.id,
    module_id: lesson.course_module_id,
    title: lesson.title,
    video_url: lesson.youtube_embed_url,
    content: lesson.content.to_s, # Already there
    xp_reward: lesson.xp_reward,
    activity_type: lesson.activity_type,
    activity_config: lesson.activity_config,
    # Add these for maze:
    lesson_content: lesson.content.to_s, # Explicit for maze material panel
    quiz: quiz ? { ... } : nil
  }
end
```

**Step 2: Update Learn.tsx to use lesson_content**

```typescript
// In the praktik tab section
{activeTab === 'praktik' && (
  <Suspense fallback={<LoadingSpinner message="Memuat maze..." />}>
    <div className="h-[calc(100vh-12rem)]">
      <LessonMaze
        lessonId={currentLesson.id}
        activityConfig={currentLesson.activity_config}
        lessonContent={currentLesson.lesson_content || currentLesson.content || ''}
        onComplete={(stars) => {
          console.log('Maze completed with stars:', stars)
        }}
      />
    </div>
  </Suspense>
)}
```

**Step 3: Test manually**

1. Navigate to a maze lesson
2. Verify material panel shows lesson content
3. Verify canvas renders with proper grid
4. Verify Blockly workspace shows correct blocks

**Step 4: Commit**

```bash
git add app/controllers/student/courses_controller.rb app/frontend/Pages/Student/Courses/Learn.tsx
git commit -m "feat: pass lesson content to maze material panel"
```

---

## Task 12: Manual Testing & Verification

**Files:**
- Manual testing in browser

**Step 1: Start development server**

```bash
bin/dev
```

**Step 2: Navigate to maze lesson**

1. Open browser to `http://localhost:3000`
2. Login as student user
3. Navigate to maze course (slug: `maze-programming-101`)
4. Click on any lesson

**Step 3: Verify layout**

Check:
- ✅ Material panel visible at top (expanded by default)
- ✅ Maze canvas renders in center
- ✅ Blockly workspace visible at bottom
- ✅ All elements fit on one screen (no scrolling needed)
- ✅ Progress sidebar visible on desktop (right side)

**Step 4: Test material panel**

Check:
- ✅ Shows lesson content
- ✅ Shows available blocks
- ✅ Collapse button works
- ✅ Expand button works
- ✅ Smooth height transition

**Step 5: Test maze rendering**

Check:
- ✅ Grid renders correctly
- ✅ Character (rabbit) visible at start position
- ✅ Goal (carrot) visible at goal position
- ✅ Obstacles render correctly

**Step 6: Test Blockly integration**

Check:
- ✅ Workspace loads
- ✅ Toolbox shows correct blocks (from activity_config)
- ✅ Can drag blocks to workspace
- ✅ Code generates correctly

**Step 7: Test execution**

Check:
- ✅ Click Run with no blocks → Error message
- ✅ Add blocks → Click Run → Character animates
- ✅ Movement matches blocks
- ✅ Reset button works
- ✅ Crash into wall → Stops, shows feedback
- ✅ Reach goal → Success modal appears

**Step 8: Test progress tracking**

Check:
- ✅ Stats update (blocks used, time)
- ✅ Failed runs increment on crash
- ✅ Completion modal shows correct stars
- ✅ Backend receives attempt data

**Step 9: Document any issues**

Create file: `TESTING-LESSON-MAZE.md` with findings:

```markdown
# Lesson Maze Integration - Manual Testing Notes

Date: 2025-01-27

## Results

### Layout
- [x] All elements visible on one screen
- [x] Responsive on different screen sizes
- [x] Material panel collapses correctly

### Maze Rendering
- [x] Grid renders from config
- [x] Character position correct
- [x] Goal position correct
- [x] Obstacles render correctly

### Blockly Integration
- [x] Blocks available from config
- [x] Code generation works
- [x] Execution works as expected

### Issues Found
1. [List any issues found during testing]

## Recommendations
[Your notes on what to improve next]
```

**Step 10: Fix any critical issues**

If critical issues found, create fix commits. Document non-critical issues for future iteration.

---

## Task 13: Final Polish & Cleanup

**Files:**
- Various

**Step 1: Remove unused code**

Remove or comment out old MazePractice integration code if no longer needed.

**Step 2: Add JSDoc comments**

Add documentation to key components.

**Step 3: Verify all files pass linters**

```bash
# Ruby
bin/rubocop

# JavaScript/TypeScript
yarn lint

# Check for any new issues
```

**Step 4: Update TESTING.md**

Add notes about new LessonMaze component to existing TESTING.md.

**Step 5: Final commit**

```bash
git add docs/plans/ app/frontend/components/MazeGame/ TESTING.md
git commit -m "docs: add LessonMaze integration testing notes and cleanup"
```

---

## Task 14: Merge to Main Branch

**Files:**
- Git operations

**Step 1: Review all commits**

```bash
git log --oneline -15
```

**Step 2: Run full test suite**

```bash
bin/rails test
bin/rspec
```

**Step 3: Check git status**

```bash
git status
```

**Step 4: Switch to main branch**

```bash
git checkout main
git pull origin main
```

**Step 5: Merge feature branch**

```bash
git merge feature/maze-code-org-integration
```

**Step 6: Resolve any conflicts**

If conflicts occur:
1. Open conflicting files
2. Resolve conflicts manually
3. Test the changes
4. Commit merge resolution

**Step 7: Push to origin**

```bash
git push origin main
```

---

## Summary

This plan creates a new LessonMaze component system with:

**New Components:**
- `MaterialPanel.tsx` - Collapsible lesson material drawer
- `LessonMazeEngine.ts` - Canvas-based maze engine for lesson configs
- `LessonMazeInterpreter.ts` - Code executor for Blockly output
- `LessonMaze.tsx` - Main container orchestrating everything
- `MazeBlocks.ts` - Lesson-specific Blockly blocks

**Key Features:**
- One-screen layout (material → canvas → Blockly)
- Dynamic maze generation from lesson activity_config
- Step-by-step animation (300ms per move)
- Progress tracking integration
- Collapsible material panel
- Responsive canvas sizing
- Error handling and user feedback

**Testing:**
- Manual verification in browser (Task 12)
- All existing tests should still pass
- No test file changes needed (manual verification first)

**Total Tasks:** 14
**Estimated Time:** 2-3 hours for full implementation
**Complexity:** Medium (canvas rendering, animation, Blockly integration)
