# Platformer Game Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Mario-style platformer game where children learn programming through Blockly blocks, featuring a tiny adventurer navigating dungeon environments with canvas-drawn graphics.

**Architecture:** Follows the same pattern as the existing MazeGame system - separate Engine (physics/rendering), Interpreter (Blockly execution), and React container component. TypeScript types define the game state and level configurations. Canvas API handles all rendering (no external assets for MVP).

**Tech Stack:** React 19, TypeScript, Canvas API, Blockly, react-blockly, Vitest for testing

---

## Task 1: Create Type Definitions

**Files:**
- Create: `app/frontend/components/PlatformerGame/PlatformerTypes.ts`
- Test: `app/frontend/components/PlatformerGame/__tests__/PlatformerTypes.test.ts`

**Step 1: Write the type definitions file**

```typescript
// app/frontend/components/PlatformerGame/PlatformerTypes.ts

// Result types for game completion
export enum ResultType {
  UNSET = 0,
  FAILURE = 1,
  SUCCESS = 2,
  CRASH = 3,
}

// Position interface
export interface Position {
  x: number
  y: number
}

// Player state
export interface PlayerState {
  position: Position
  velocity: Position
  width: number
  height: number
  onGround: boolean
  facingRight: boolean
}

// Collectible item
export interface Collectible {
  x: number
  y: number
  type: 'coin' | 'gem'
  collected: boolean
}

// Obstacle (spike, lava, etc.)
export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'spike' | 'lava'
}

// Platform
export interface Platform {
  x: number
  y: number
  width: number
  height: number
}

// Goal position
export interface Goal {
  x: number
  y: number
  width: number
  height: number
}

// Level configuration
export interface PlatformerLevelConfig {
  level: number
  worldWidth: number
  worldHeight: number
  spawnX: number
  spawnY: number
  goalX: number
  goalY: number
  platforms: [number, number, number, number][]    // [x, y, w, h]
  obstacles: [number, number, number, number, string][]  // [x, y, w, h, type]
  collectibles: [number, number, string][]         // [x, y, type]
  availableBlocks: string[]
  maxBlocks: number
  requiredCollectibles: number
}

// Game state
export interface PlatformerState {
  level: number
  player: PlayerState
  result: ResultType
  collectedItems: number
  isRunning: boolean
}

// Canvas dimensions
export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 400

// Physics constants
export const GRAVITY = 0.5
export const MOVE_SPEED = 5
export const JUMP_POWER = -12
export const TERMINAL_VELOCITY = 15

// Player dimensions
export const PLAYER_WIDTH = 24
export const PLAYER_HEIGHT = 32

// Maximum level
export const MAX_LEVEL = 10
```

**Step 2: Write basic tests for types**

```typescript
// app/frontend/components/PlatformerGame/__tests__/PlatformerTypes.test.ts

import { describe, it, expect } from 'vitest'
import {
  ResultType,
  type Position,
  type PlayerState,
  type PlatformerLevelConfig,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY,
  MOVE_SPEED,
  JUMP_POWER,
  MAX_LEVEL,
} from '../PlatformerTypes'

describe('PlatformerTypes', () => {
  describe('Constants', () => {
    it('should have correct canvas dimensions', () => {
      expect(CANVAS_WIDTH).toBe(800)
      expect(CANVAS_HEIGHT).toBe(400)
    })

    it('should have correct physics constants', () => {
      expect(GRAVITY).toBe(0.5)
      expect(MOVE_SPEED).toBe(5)
      expect(JUMP_POWER).toBe(-12)
    })

    it('should have max level set to 10', () => {
      expect(MAX_LEVEL).toBe(10)
    })
  })

  describe('ResultType enum', () => {
    it('should have correct values', () => {
      expect(ResultType.UNSET).toBe(0)
      expect(ResultType.FAILURE).toBe(1)
      expect(ResultType.SUCCESS).toBe(2)
      expect(ResultType.CRASH).toBe(3)
    })
  })

  describe('Type interfaces', () => {
    it('should accept valid Position', () => {
      const pos: Position = { x: 100, y: 200 }
      expect(pos.x).toBe(100)
      expect(pos.y).toBe(200)
    })

    it('should accept valid PlayerState', () => {
      const player: PlayerState = {
        position: { x: 50, y: 300 },
        velocity: { x: 0, y: 0 },
        width: 24,
        height: 32,
        onGround: true,
        facingRight: true,
      }
      expect(player.onGround).toBe(true)
    })
  })
})
```

**Step 3: Run tests to verify they pass**

Run: `yarn test app/frontend/components/PlatformerGame/__tests__/PlatformerTypes.test.ts`

Expected: PASS (type definitions are valid)

**Step 4: Commit**

```bash
git add app/frontend/components/PlatformerGame/
git commit -m "feat(platformer): add type definitions

- Define ResultType enum for game outcomes
- Define PlayerState, Position, and game element interfaces
- Define PlatformerLevelConfig for level data
- Add physics and canvas constants
- Add basic type tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Level Configurations

**Files:**
- Create: `app/frontend/components/PlatformerGame/PlatformerLevels.ts`
- Test: `app/frontend/components/PlatformerGame/__tests__/PlatformerLevels.test.ts`

**Step 1: Write level configurations**

```typescript
// app/frontend/components/PlatformerGame/PlatformerLevels.ts

import type { PlatformerLevelConfig } from './PlatformerTypes'

// Level 1: Movement basics - straight line to goal
export const level1: PlatformerLevelConfig = {
  level: 1,
  worldWidth: 600,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 520,
  goalY: 320,
  platforms: [
    [0, 370, 600, 30],  // Single floor
  ],
  obstacles: [],
  collectibles: [],
  availableBlocks: ['move_right'],
  maxBlocks: 10,
  requiredCollectibles: 0
}

// Level 2: Introduction to jumping over a gap
export const level2: PlatformerLevelConfig = {
  level: 2,
  worldWidth: 700,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 620,
  goalY: 320,
  platforms: [
    [0, 370, 250, 30],     // Start platform
    [350, 370, 350, 30],   // Goal platform (100px gap)
  ],
  obstacles: [],
  collectibles: [[300, 330, 'coin']],  // Coin in air above gap
  availableBlocks: ['move_right', 'jump'],
  maxBlocks: 6,
  requiredCollectibles: 0
}

// Level 3: Multiple platforms, need jump + move
export const level3: PlatformerLevelConfig = {
  level: 3,
  worldWidth: 800,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 720,
  goalY: 320,
  platforms: [
    [0, 370, 200, 30],     // Start
    [250, 320, 100, 30],   // Higher platform
    [400, 270, 100, 30],   // Higher
    [550, 320, 100, 30],   // Down
    [650, 370, 150, 30],   // Goal
  ],
  obstacles: [],
  collectibles: [],
  availableBlocks: ['move_right', 'move_left', 'jump'],
  maxBlocks: 12,
  requiredCollectibles: 0
}

// Level 4: Use repeat to cross repeated platforms
export const level4: PlatformerLevelConfig = {
  level: 4,
  worldWidth: 700,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 620,
  goalY: 320,
  platforms: [
    [0, 370, 100, 30],
    [120, 370, 100, 30],
    [240, 370, 100, 30],
    [360, 370, 100, 30],
    [480, 370, 100, 30],
    [600, 370, 100, 30],
  ],
  obstacles: [],
  collectibles: [],
  availableBlocks: ['move_right', 'jump', 'repeat'],
  maxBlocks: 5,  // Force use of repeat
  requiredCollectibles: 0
}

// Level 5: Jump + repeat pattern
export const level5: PlatformerLevelConfig = {
  level: 5,
  worldWidth: 800,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 720,
  goalY: 320,
  platforms: [
    [0, 370, 100, 30],
    [120, 300, 100, 30],   // Up
    [240, 370, 100, 30],   // Down
    [360, 300, 100, 30],   // Up
    [480, 370, 100, 30],   // Down
    [600, 370, 150, 30],   // Goal
  ],
  obstacles: [],
  collectibles: [[180, 260, 'coin'], [420, 260, 'coin']],
  availableBlocks: ['move_right', 'jump', 'repeat'],
  maxBlocks: 8,
  requiredCollectibles: 0
}

// Level 6: Collect all coins with repeat
export const level6: PlatformerLevelConfig = {
  level: 6,
  worldWidth: 900,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 820,
  goalY: 320,
  platforms: [
    [0, 370, 900, 30],  // Long floor
  ],
  obstacles: [],
  collectibles: [
    [150, 330, 'coin'], [250, 330, 'coin'], [350, 330, 'coin'],
    [450, 330, 'coin'], [550, 330, 'coin'], [650, 330, 'coin'],
  ],
  availableBlocks: ['move_right', 'jump', 'repeat'],
  maxBlocks: 6,
  requiredCollectibles: 6  // Must collect all
}

// Level 7: Introduction to conditionals (spike ahead)
export const level7: PlatformerLevelConfig = {
  level: 7,
  worldWidth: 700,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 620,
  goalY: 320,
  platforms: [
    [0, 370, 700, 30],
  ],
  obstacles: [
    [200, 340, 30, 30, 'spike'],   // Spike on ground
    [350, 340, 30, 30, 'spike'],   // Another spike
    [500, 340, 30, 30, 'spike'],   // Third spike
  ],
  collectibles: [],
  availableBlocks: ['move_right', 'jump', 'if_spike_ahead'],
  maxBlocks: 10,
  requiredCollectibles: 0
}

// Level 8: Gaps with conditional
export const level8: PlatformerLevelConfig = {
  level: 8,
  worldWidth: 800,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 320,
  goalX: 720,
  goalY: 320,
  platforms: [
    [0, 370, 200, 30],      // Start
    [300, 370, 100, 30],    // After gap 1
    [500, 370, 100, 30],    // After gap 2
    [650, 370, 150, 30],    // Goal
  ],
  obstacles: [],
  collectibles: [[250, 280, 'coin'], [450, 280, 'coin']],
  availableBlocks: ['move_right', 'jump', 'if_gap_ahead', 'repeat'],
  maxBlocks: 10,
  requiredCollectibles: 0
}

// Level 9: Combined challenge: spikes + gaps + coins
export const level9: PlatformerLevelConfig = {
  level: 9,
  worldWidth: 1000,
  worldHeight: 400,
  spawnX: 50,
  spawnY: 350,
  goalX: 920,
  goalY: 350,
  platforms: [
    [0, 370, 150, 30],
    [200, 320, 100, 30],
    [350, 370, 100, 30],
    [500, 300, 100, 30],
    [650, 370, 150, 30],
    [850, 370, 150, 30],
  ],
  obstacles: [
    [400, 340, 30, 30, 'spike'],
    [700, 340, 30, 30, 'spike'],
    [780, 340, 30, 30, 'spike'],
  ],
  collectibles: [
    [250, 280, 'coin'], [400, 260, 'coin'],
    [550, 260, 'coin'], [750, 330, 'coin'],
  ],
  availableBlocks: ['move_right', 'move_left', 'jump', 'if_spike_ahead', 'if_gap_ahead', 'repeat'],
  maxBlocks: 15,
  requiredCollectibles: 3
}

// Level 10: Final boss level
export const level10: PlatformerLevelConfig = {
  level: 10,
  worldWidth: 1200,
  worldHeight: 450,
  spawnX: 50,
  spawnY: 350,
  goalX: 1100,
  goalY: 350,
  platforms: [
    [0, 400, 150, 30],
    [180, 350, 80, 30],
    [300, 300, 80, 30],
    [420, 350, 80, 30],
    [540, 400, 150, 30],
    [720, 350, 80, 30],
    [840, 300, 80, 30],
    [960, 350, 80, 30],
    [1050, 400, 150, 30],
  ],
  obstacles: [
    [230, 320, 30, 30, 'spike'],
    [580, 370, 30, 30, 'spike'], [620, 370, 30, 30, 'spike'],
    [880, 320, 30, 30, 'spike'],
  ],
  collectibles: [
    [220, 260, 'gem'], [340, 260, 'gem'],
    [520, 360, 'coin'], [680, 360, 'coin'],
    [780, 260, 'gem'], [900, 260, 'gem'],
    [1000, 310, 'coin'],
  ],
  availableBlocks: ['move_right', 'move_left', 'jump', 'if_spike_ahead', 'if_gap_ahead', 'repeat'],
  maxBlocks: 20,
  requiredCollectibles: 5
}

// Level lookup function
export function getLevelConfig(level: number): PlatformerLevelConfig {
  const levels: Record<number, PlatformerLevelConfig> = {
    1: level1,
    2: level2,
    3: level3,
    4: level4,
    5: level5,
    6: level6,
    7: level7,
    8: level8,
    9: level9,
    10: level10,
  }

  return levels[level] || level1
}
```

**Step 2: Write tests for level configurations**

```typescript
// app/frontend/components/PlatformerGame/__tests__/PlatformerLevels.test.ts

import { describe, it, expect } from 'vitest'
import { getLevelConfig, level1, level2, level7 } from '../PlatformerLevels'
import type { PlatformerLevelConfig } from '../PlatformerTypes'

describe('PlatformerLevels', () => {
  describe('getLevelConfig', () => {
    it('should return level 1 config', () => {
      const config = getLevelConfig(1)
      expect(config.level).toBe(1)
      expect(config.worldWidth).toBe(600)
    })

    it('should return level 2 config', () => {
      const config = getLevelConfig(2)
      expect(config.level).toBe(2)
      expect(config.platforms).toHaveLength(2)
    })

    it('should return level 1 for invalid level number', () => {
      const config = getLevelConfig(99)
      expect(config.level).toBe(1)
    })
  })

  describe('Level 1 - Movement basics', () => {
    it('should have only move_right block available', () => {
      expect(level1.availableBlocks).toEqual(['move_right'])
    })

    it('should have single platform', () => {
      expect(level1.platforms).toHaveLength(1)
      expect(level1.platforms[0]).toEqual([0, 370, 600, 30])
    })

    it('should have no obstacles', () => {
      expect(level1.obstacles).toHaveLength(0)
    })

    it('should have no collectibles', () => {
      expect(level1.collectibles).toHaveLength(0)
    })
  })

  describe('Level 2 - Jump introduction', () => {
    it('should have move_right and jump blocks', () => {
      expect(level2.availableBlocks).toContain('move_right')
      expect(level2.availableBlocks).toContain('jump')
    })

    it('should have two platforms with a gap', () => {
      expect(level2.platforms).toHaveLength(2)
      expect(level2.platforms[0][2]).toBe(250)  // First platform width
      expect(level2.platforms[1][0]).toBe(350)  // Second platform starts after gap
    })

    it('should have one coin above the gap', () => {
      expect(level2.collectibles).toHaveLength(1)
      expect(level2.collectibles[0]).toEqual([300, 330, 'coin'])
    })
  })

  describe('Level 7 - Conditionals introduction', () => {
    it('should have if_spike_ahead block', () => {
      expect(level7.availableBlocks).toContain('if_spike_ahead')
    })

    it('should have spikes as obstacles', () => {
      expect(level7.obstacles).toHaveLength(3)
      expect(level7.obstacles[0][4]).toBe('spike')
    })
  })

  describe('Level configs follow valid structure', () => {
    it('all levels should have required properties', () => {
      for (let i = 1; i <= 10; i++) {
        const config = getLevelConfig(i)
        expect(config.level).toBe(i)
        expect(config.worldWidth).toBeGreaterThan(0)
        expect(config.worldHeight).toBeGreaterThan(0)
        expect(config.spawnX).toBeGreaterThanOrEqual(0)
        expect(config.spawnY).toBeGreaterThanOrEqual(0)
        expect(config.goalX).toBeGreaterThan(config.spawnX)
        expect(config.platforms).toBeInstanceOf(Array)
        expect(config.obstacles).toBeInstanceOf(Array)
        expect(config.collectibles).toBeInstanceOf(Array)
        expect(config.availableBlocks).toBeInstanceOf(Array)
        expect(config.maxBlocks).toBeGreaterThan(0)
      }
    })
  })
})
```

**Step 3: Run tests to verify they pass**

Run: `yarn test app/frontend/components/PlatformerGame/__tests__/PlatformerLevels.test.ts`

Expected: PASS (all level configs are valid)

**Step 4: Commit**

```bash
git add app/frontend/components/PlatformerGame/
git commit -m "feat(platformer): add 10 level configurations

- Level 1-3: Movement basics (move, jump)
- Level 4-6: Introduction to loops
- Level 7-10: Conditionals and combined challenges
- Each level has availableBlocks, maxBlocks, requiredCollectibles
- Add comprehensive level config tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create Platformer Engine - Physics & Collision

**Files:**
- Create: `app/frontend/components/PlatformerGame/PlatformerEngine.ts`
- Test: `app/frontend/components/PlatformerGame/__tests__/PlatformerEngine.test.ts`

**Step 1: Write the PlatformerEngine class**

```typescript
// app/frontend/components/PlatformerGame/PlatformerEngine.ts

import {
  type PlatformerLevelConfig,
  type PlayerState,
  type Platform,
  type Obstacle,
  type Collectible,
  type Goal,
  ResultType,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY,
  MOVE_SPEED,
  JUMP_POWER,
  TERMINAL_VELOCITY,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
} from './PlatformerTypes'

export class PlatformerEngine {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private levelConfig: PlatformerLevelConfig
  private player: PlayerState
  private collectibles: Collectible[] = []
  private obstacles: Obstacle[] = []
  private platforms: Platform[] = []
  private goal: Goal
  private result: ResultType = ResultType.UNSET
  private collectedCount: number = 0
  private animationFrameId: number | null = null
  private onComplete?: (result: ResultType) => void

  constructor(levelConfig: PlatformerLevelConfig) {
    this.levelConfig = levelConfig
    this.goal = {
      x: levelConfig.goalX,
      y: levelConfig.goalY,
      width: 40,
      height: 60,
    }
    this.player = this.createInitialState()
    this.parseLevelElements()
  }

  private createInitialState(): PlayerState {
    return {
      position: {
        x: this.levelConfig.spawnX,
        y: this.levelConfig.spawnY,
      },
      velocity: { x: 0, y: 0 },
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      onGround: false,
      facingRight: true,
    }
  }

  private parseLevelElements(): void {
    // Parse platforms
    this.platforms = this.levelConfig.platforms.map(
      ([x, y, w, h]) => ({ x, y, width: w, height: h })
    )

    // Parse obstacles
    this.obstacles = this.levelConfig.obstacles.map(
      ([x, y, w, h, type]) => ({ x, y, width: w, height: h, type: type as 'spike' | 'lava' })
    )

    // Parse collectibles
    this.collectibles = this.levelConfig.collectibles.map(
      ([x, y, type]) => ({ x, y, type: type as 'coin' | 'gem', collected: false })
    )
  }

  public async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    // Set canvas size based on level, max at CANVAS_WIDTH
    const displayWidth = Math.min(this.levelConfig.worldWidth, CANVAS_WIDTH)
    canvas.width = displayWidth
    canvas.height = CANVAS_HEIGHT

    this.render()
  }

  public render(): void {
    if (!this.ctx) return

    const { worldWidth, worldHeight } = this.levelConfig
    const displayWidth = Math.min(worldWidth, CANVAS_WIDTH)

    // Clear canvas
    this.ctx.clearRect(0, 0, displayWidth, CANVAS_HEIGHT)

    // Draw background (dungeon sky)
    this.ctx.fillStyle = '#1a1a2e'
    this.ctx.fillRect(0, 0, displayWidth, CANVAS_HEIGHT)

    // Draw platforms
    this.ctx.fillStyle = '#78350F'  // Brown
    for (const platform of this.platforms) {
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
      // Border
      this.ctx.strokeStyle = '#92400E'
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
    }

    // Draw obstacles (spikes)
    for (const obstacle of this.obstacles) {
      this.drawSpike(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    }

    // Draw collectibles
    for (const collectible of this.collectibles) {
      if (!collectible.collected) {
        this.drawCollectible(collectible.x, collectible.y, collectible.type)
      }
    }

    // Draw goal
    this.drawGoal()

    // Draw player
    this.drawPlayer()
  }

  private drawSpike(x: number, y: number, width: number, height: number): void {
    if (!this.ctx) return
    this.ctx.fillStyle = '#DC2626'  // Red
    this.ctx.beginPath()
    this.ctx.moveTo(x, y + height)
    this.ctx.lineTo(x + width / 2, y)
    this.ctx.lineTo(x + width / 2 + width / 2, y + height)
    this.ctx.closePath()
    this.ctx.fill()
  }

  private drawCollectible(x: number, y: number, type: 'coin' | 'gem'): void {
    if (!this.ctx) return

    if (type === 'coin') {
      // Draw coin (gold circle)
      this.ctx.fillStyle = '#FBBF24'
      this.ctx.beginPath()
      this.ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2)
      this.ctx.fill()
      // Inner detail
      this.ctx.fillStyle = '#F59E0B'
      this.ctx.font = '12px Arial'
      this.ctx.fillText('$', x + 6, y + 14)
    } else {
      // Draw gem (diamond shape)
      this.ctx.fillStyle = '#8B5CF6'
      this.ctx.beginPath()
      this.ctx.moveTo(x + 10, y)
      this.ctx.lineTo(x + 20, y + 10)
      this.ctx.lineTo(x + 10, y + 20)
      this.ctx.lineTo(x, y + 10)
      this.ctx.closePath()
      this.ctx.fill()
    }
  }

  private drawGoal(): void {
    if (!this.ctx) return

    // Flag pole
    this.ctx.fillStyle = '#6B7280'
    this.ctx.fillRect(this.goal.x + 18, this.goal.y, 4, 60)

    // Flag
    this.ctx.fillStyle = '#10B981'  // Green flag
    this.ctx.fillRect(this.goal.x + 22, this.goal.y, 30, 20)

    // Star on flag
    this.ctx.fillStyle = '#FCD34D'
    this.ctx.font = '14px Arial'
    this.ctx.fillText('★', this.goal.x + 28, this.goal.y + 15)
  }

  private drawPlayer(): void {
    if (!this.ctx) return

    const { position, width, height, facingRight } = this.player

    // Body (blue tunic)
    this.ctx.fillStyle = '#3B82F6'
    this.ctx.fillRect(position.x, position.y, width, height)

    // Head/facing indicator
    this.ctx.fillStyle = '#FCD34D'  // Gold/helmet
    if (facingRight) {
      this.ctx.fillRect(position.x + width - 8, position.y - 4, 12, 8)
    } else {
      this.ctx.fillRect(position.x - 4, position.y - 4, 12, 8)
    }

    // Eyes
    this.ctx.fillStyle = '#000'
    if (facingRight) {
      this.ctx.fillRect(position.x + width - 4, position.y + 6, 2, 2)
    } else {
      this.ctx.fillRect(position.x + 2, position.y + 6, 2, 2)
    }
  }

  // Game API methods for interpreter

  public async moveRight(): Promise<void> {
    if (this.result !== ResultType.UNSET) return

    this.player.velocity.x = MOVE_SPEED
    this.player.facingRight = true
    await this.animateMove()
  }

  public async moveLeft(): Promise<void> {
    if (this.result !== ResultType.UNSET) return

    this.player.velocity.x = -MOVE_SPEED
    this.player.facingRight = false
    await this.animateMove()
  }

  public async jump(): Promise<void> {
    if (this.result !== ResultType.UNSET) return
    if (!this.player.onGround) return  // Can only jump when on ground

    this.player.velocity.y = JUMP_POWER
    this.player.onGround = false
    await this.animateMove()
  }

  private async animateMove(): Promise<void> {
    return new Promise<void>((resolve) => {
      const frames = 10
      let currentFrame = 0

      const animate = () => {
        if (currentFrame >= frames) {
          this.player.velocity.x = 0
          resolve()
          return
        }

        this.updatePhysics()
        this.checkCollisions()
        this.render()

        if (this.result !== ResultType.UNSET) {
          resolve()
          return
        }

        currentFrame++
        this.animationFrameId = requestAnimationFrame(animate)
      }

      animate()
    })
  }

  public updatePhysics(): void {
    // Apply gravity
    if (!this.player.onGround) {
      this.player.velocity.y += GRAVITY
      if (this.player.velocity.y > TERMINAL_VELOCITY) {
        this.player.velocity.y = TERMINAL_VELOCITY
      }
    }

    // Update position
    this.player.position.x += this.player.velocity.x
    this.player.position.y += this.player.velocity.y

    // Apply friction
    this.player.velocity.x *= 0.8

    // Check world bounds
    this.checkWorldBounds()
  }

  private checkWorldBounds(): void {
    // Left bound
    if (this.player.position.x < 0) {
      this.player.position.x = 0
      this.player.velocity.x = 0
    }

    // Right bound
    if (this.player.position.x + this.player.width > this.levelConfig.worldWidth) {
      this.player.position.x = this.levelConfig.worldWidth - this.player.width
      this.player.velocity.x = 0
    }

    // Fell off world (bottom)
    if (this.player.position.y > this.levelConfig.worldHeight) {
      this.result = ResultType.FAILURE
      this.onComplete?.(this.result)
    }
  }

  private checkCollisions(): void {
    this.player.onGround = false

    // Check platform collisions
    for (const platform of this.platforms) {
      if (this.isColliding(this.player, platform)) {
        // Landing on top
        if (this.player.velocity.y > 0 &&
            this.player.position.y + this.player.height - this.player.velocity.y <= platform.y) {
          this.player.position.y = platform.y - this.player.height
          this.player.velocity.y = 0
          this.player.onGround = true
        }
      }
    }

    // Check obstacle collisions (spikes)
    for (const obstacle of this.obstacles) {
      if (this.isColliding(this.player, obstacle)) {
        this.result = ResultType.CRASH
        this.onComplete?.(this.result)
        return
      }
    }

    // Check collectible collisions
    for (const collectible of this.collectibles) {
      if (!collectible.collected && this.isCollidingWithPoint(collectible.x, collectible.y)) {
        collectible.collected = true
        this.collectedCount++
      }
    }

    // Check goal collision
    if (this.isColliding(this.player, this.goal)) {
      if (this.collectedCount >= this.levelConfig.requiredCollectibles) {
        this.result = ResultType.SUCCESS
      } else {
        this.result = ResultType.FAILURE  // Reached goal but not enough collectibles
      }
      this.onComplete?.(this.result)
    }
  }

  private isColliding(a: PlayerState, b: Platform | Obstacle | Goal): boolean {
    const ax = a.position.x
    const ay = a.position.y
    const aw = a.width
    const ah = a.height

    return (
      ax < b.x + b.width &&
      ax + aw > b.x &&
      ay < b.y + b.height &&
      ay + ah > b.y
    )
  }

  private isCollidingWithPoint(x: number, y: number): boolean {
    const p = this.player.position
    const w = this.player.width
    const h = this.player.height

    // Check if point (x, y) is inside player bounding box (with some margin)
    return (
      x >= p.x - 10 &&
      x <= p.x + w + 10 &&
      y >= p.y - 10 &&
      y <= p.y + h + 10
    )
  }

  // Conditional checks for blocks
  public isSpikeAhead(): boolean {
    const lookAheadX = this.player.facingRight
      ? this.player.position.x + this.player.width + 30
      : this.player.position.x - 30

    for (const obstacle of this.obstacles) {
      if (
        obstacle.type === 'spike' &&
        lookAheadX >= obstacle.x &&
        lookAheadX <= obstacle.x + obstacle.width &&
        this.player.position.y + this.player.height > obstacle.y
      ) {
        return true
      }
    }
    return false
  }

  public isGapAhead(): boolean {
    const lookAheadX = this.player.facingRight
      ? this.player.position.x + this.player.width + 20
      : this.player.position.x + 20

    const playerBottom = this.player.position.y + this.player.height

    // Check if there's no platform below at lookAhead position
    for (const platform of this.platforms) {
      if (
        lookAheadX >= platform.x &&
        lookAheadX <= platform.x + platform.width &&
        playerBottom <= platform.y + 10 &&
        playerBottom >= platform.y - 20
      ) {
        return false  // There's a platform below
      }
    }
    return true  // No platform below = gap
  }

  public reset(): void {
    this.stopAnimation()
    this.player = this.createInitialState()
    this.result = ResultType.UNSET
    this.collectedCount = 0
    this.collectibles = this.levelConfig.collectibles.map(
      ([x, y, type]) => ({ x, y, type: type as 'coin' | 'gem', collected: false })
    )
    this.render()
  }

  public setLevel(levelConfig: PlatformerLevelConfig): void {
    this.levelConfig = levelConfig
    this.goal = {
      x: levelConfig.goalX,
      y: levelConfig.goalY,
      width: 40,
      height: 60,
    }
    this.player = this.createInitialState()
    this.parseLevelElements()
    this.result = ResultType.UNSET
    this.collectedCount = 0
    this.render()
  }

  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  public getResult(): ResultType {
    return this.result
  }

  public getCollectedCount(): number {
    return this.collectedCount
  }

  public getRequiredCollectibles(): number {
    return this.levelConfig.requiredCollectibles
  }

  public setOnComplete(callback: (result: ResultType) => void): void {
    this.onComplete = callback
  }

  public destroy(): void {
    this.stopAnimation()
    this.canvas = null
    this.ctx = null
  }
}
```

**Step 2: Write tests for PlatformerEngine**

```typescript
// app/frontend/components/PlatformerGame/__tests__/PlatformerEngine.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PlatformerEngine } from '../PlatformerEngine'
import { level1, level2, level7 } from '../PlatformerLevels'
import { ResultType } from '../PlatformerTypes'

describe('PlatformerEngine', () => {
  let engine: PlatformerEngine
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    // Create mock canvas
    mockCanvas = document.createElement('canvas')
    mockCanvas.width = 800
    mockCanvas.height = 400
    vi.spyOn(mockCanvas, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillStyle: '',
      beginPath: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      font: '',
      fillText: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
    } as unknown as CanvasRenderingContext2D)
  })

  describe('Initialization', () => {
    it('should initialize with level 1 config', async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)

      expect(mockCanvas.width).toBe(600)  // level1 worldWidth
      expect(mockCanvas.height).toBe(400)
    })

    it('should start player at spawn position', async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)

      engine.reset()  // This sets initial state
      // Player position should be at spawn
      expect(engine['player'].position.x).toBe(level1.spawnX)
      expect(engine['player'].position.y).toBe(level1.spawnY)
    })
  })

  describe('Physics', () => {
    beforeEach(async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)
    })

    it('should apply gravity when not on ground', () => {
      engine['player'].onGround = false
      engine['player'].velocity.y = 0

      engine.updatePhysics()

      expect(engine['player'].velocity.y).toBeGreaterThan(0)
    })

    it('should limit velocity to terminal velocity', () => {
      engine['player'].onGround = false
      engine['player'].velocity.y = 100

      engine.updatePhysics()

      expect(engine['player'].velocity.y).toBeLessThanOrEqual(15)
    })

    it('should apply friction to horizontal velocity', () => {
      engine['player'].velocity.x = 10

      engine.updatePhysics()

      expect(engine['player'].velocity.x).toBeLessThan(10)
      expect(engine['player'].velocity.x).toBeGreaterThan(0)
    })
  })

  describe('Movement', () => {
    beforeEach(async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)
    })

    it('should move player right', async () => {
      const initialX = engine['player'].position.x

      // Mock requestAnimationFrame to run immediately
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        setTimeout(() => cb(0), 0)
        return 0
      })

      await engine.moveRight()

      expect(engine['player'].position.x).toBeGreaterThan(initialX)
      expect(engine['player'].facingRight).toBe(true)
    })

    it('should move player left', async () => {
      const initialX = engine['player'].position.x

      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        setTimeout(() => cb(0), 0)
        return 0
      })

      await engine.moveLeft()

      // In level 1, starting at x=50, moving left should keep at 0 (boundary)
      expect(engine['player'].facingRight).toBe(false)
    })

    it('should make player jump', async () => {
      engine['player'].onGround = true

      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        setTimeout(() => cb(0), 0)
        return 0
      })

      await engine.jump()

      expect(engine['player'].velocity.y).toBeLessThan(0)  // Negative = upward
      expect(engine['player'].onGround).toBe(false)
    })

    it('should not jump when not on ground', async () => {
      engine['player'].onGround = false
      const initialVelocityY = engine['player'].velocity.y

      await engine.jump()

      expect(engine['player'].velocity.y).toBe(initialVelocityY)
    })
  })

  describe('Collision Detection', () => {
    beforeEach(async () => {
      engine = new PlatformerEngine(level2)  // Level 2 has platforms
      await engine.initialize(mockCanvas)
    })

    it('should detect platform collision and set onGround', () => {
      // Place player above a platform
      engine['player'].position.x = 100
      engine['player'].position.y = 300
      engine['player'].velocity.y = 10

      engine.checkCollisions()

      expect(engine['player'].onGround).toBe(true)
      expect(engine['player'].velocity.y).toBe(0)
    })
  })

  describe('Conditional Checks', () => {
    beforeEach(async () => {
      engine = new PlatformerEngine(level7)  // Level 7 has spikes
      await engine.initialize(mockCanvas)
    })

    it('should detect spike ahead', () => {
      engine['player'].position.x = 150
      engine['player'].facingRight = true

      const hasSpike = engine.isSpikeAhead()

      expect(hasSpike).toBe(true)
    })

    it('should not detect spike when none ahead', () => {
      engine['player'].position.x = 50
      engine['player'].facingRight = true

      const hasSpike = engine.isSpikeAhead()

      expect(hasSpike).toBe(false)
    })
  })

  describe('World Bounds', () => {
    beforeEach(async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)
    })

    it('should prevent moving left past 0', () => {
      engine['player'].position.x = -10

      engine.checkWorldBounds()

      expect(engine['player'].position.x).toBe(0)
    })

    it('should detect falling off world', () => {
      engine['player'].position.y = 500  // Below worldHeight (400)

      engine.checkWorldBounds()

      expect(engine.getResult()).toBe(ResultType.FAILURE)
    })
  })

  describe('Reset', () => {
    it('should reset player to spawn position', async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)

      // Move player
      engine['player'].position.x = 200
      engine['player'].position.y = 100

      engine.reset()

      expect(engine['player'].position.x).toBe(level1.spawnX)
      expect(engine['player'].position.y).toBe(level1.spawnY)
    })

    it('should reset result to UNSET', async () => {
      engine = new PlatformerEngine(level1)
      await engine.initialize(mockCanvas)

      engine['result'] = ResultType.SUCCESS
      engine.reset()

      expect(engine.getResult()).toBe(ResultType.UNSET)
    })
  })
})
```

**Step 3: Run tests to verify they pass**

Run: `yarn test app/frontend/components/PlatformerGame/__tests__/PlatformerEngine.test.ts`

Expected: PASS (all engine tests pass)

**Step 4: Commit**

```bash
git add app/frontend/components/PlatformerGame/
git commit -m "feat(platformer): add physics engine and rendering

- Implement PlatformerEngine with gravity, collision detection
- Canvas rendering for player, platforms, spikes, coins, goal
- Movement methods: moveRight, moveLeft, jump
- Conditional checks: isSpikeAhead, isGapAhead
- World bounds checking and reset functionality
- Add comprehensive engine tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Platformer Interpreter

**Files:**
- Create: `app/frontend/components/PlatformerGame/PlatformerInterpreter.ts`
- Test: `app/frontend/components/PlatformerGame/__tests__/PlatformerInterpreter.test.ts`

**Step 1: Write the PlatformerInterpreter class**

```typescript
// app/frontend/components/PlatformerGame/PlatformerInterpreter.ts

import { PlatformerEngine } from './PlatformerEngine'

const MAX_EXECUTION_STEPS = 1000
const MAX_EXECUTION_TIME = 30000  // 30 seconds

export class PlatformerInterpreter {
  private engine: PlatformerEngine
  private isRunning = false
  private shouldStop = false
  private stepCount = 0
  private startTime = 0

  constructor(engine: PlatformerEngine) {
    this.engine = engine
  }

  public async execute(code: string): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    this.shouldStop = false
    this.stepCount = 0
    this.startTime = Date.now()

    try {
      const api = this.createApi()
      await this.executeCode(code, api)
    } catch (error) {
      console.error('Execution error:', error)
      throw error
    } finally {
      this.isRunning = false
    }
  }

  private createApi() {
    return {
      // Movement blocks
      moveright: async () => {
        this.checkExecutionLimits()
        if (this.shouldStop) return
        await this.engine.moveRight()
        await this.delay(300)
      },
      moveleft: async () => {
        this.checkExecutionLimits()
        if (this.shouldStop) return
        await this.engine.moveLeft()
        await this.delay(300)
      },
      jump: async () => {
        this.checkExecutionLimits()
        if (this.shouldStop) return
        await this.engine.jump()
        await this.delay(300)
      },

      // Conditional blocks
      isspikeahead: () => {
        return this.engine.isSpikeAhead()
      },
      isgapahead: () => {
        return this.engine.isGapAhead()
      },
    }
  }

  private checkExecutionLimits(): void {
    this.stepCount++

    if (this.stepCount > MAX_EXECUTION_STEPS) {
      throw new Error('Program terlalu panjang! Gunakan loop dengan bijak.')
    }

    if (Date.now() - this.startTime > MAX_EXECUTION_TIME) {
      throw new Error('Waktu habis! Program terlalu lama.')
    }
  }

  private async executeCode(code: string, api: ReturnType<typeof this.createApi>): Promise<void> {
    // Transform code to async
    const asyncCode = this.transformToAsync(code)

    const wrappedCode = `
      return (async function() {
        ${asyncCode}
      })();
    `

    try {
      const fn = new Function(
        'moveright',
        'moveleft',
        'jump',
        'isspikeahead',
        'isgapahead',
        wrappedCode
      )

      await fn(
        api.moveright,
        api.moveleft,
        api.jump,
        api.isspikeahead,
        api.isgapahead
      )
    } catch (error) {
      console.error('Code execution error:', error)
      throw error
    }
  }

  private transformToAsync(code: string): string {
    let asyncCode = code

    // Add await to movement functions
    asyncCode = asyncCode.replace(/moveright\(\)/g, 'await moveright()')
    asyncCode = asyncCode.replace(/moveleft\(\)/g, 'await moveleft()')
    asyncCode = asyncCode.replace(/jump\(\)/g, 'await jump()')

    // Handle for loops
    asyncCode = asyncCode.replace(
      /for\s*\(\s*var\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\s*\)\s*\{/g,
      'for (let $1 = $2; $1 < $3; $1++) {'
    )

    return asyncCode
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public stop(): void {
    this.shouldStop = true
    this.isRunning = false
  }

  public isExecuting(): boolean {
    return this.isRunning
  }
}
```

**Step 2: Write tests for PlatformerInterpreter**

```typescript
// app/frontend/components/PlatformerGame/__tests__/PlatformerInterpreter.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PlatformerInterpreter } from '../PlatformerInterpreter'
import { PlatformerEngine } from '../PlatformerEngine'
import { level1 } from '../PlatformerLevels'

describe('PlatformerInterpreter', () => {
  let engine: PlatformerEngine
  let interpreter: PlatformerInterpreter
  let mockCanvas: HTMLCanvasElement

  beforeEach(async () => {
    mockCanvas = document.createElement('canvas')
    mockCanvas.width = 800
    mockCanvas.height = 400

    vi.spyOn(mockCanvas, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillStyle: '',
      beginPath: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      font: '',
      fillText: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
    } as unknown as CanvasRenderingContext2D)

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(0), 0)
      return 0
    })

    engine = new PlatformerEngine(level1)
    await engine.initialize(mockCanvas)
    interpreter = new PlatformerInterpreter(engine)
  })

  describe('execute', () => {
    it('should execute moveright block', async () => {
      const initialX = engine['player'].position.x

      await interpreter.execute('moveright()')

      expect(engine['player'].position.x).toBeGreaterThan(initialX)
    })

    it('should execute moveleft block', async () => {
      engine['player'].position.x = 50
      const initialX = engine['player'].position.x

      await interpreter.execute('moveleft()')

      // Should stay at 0 (boundary)
      expect(engine['player'].position.x).toBeLessThanOrEqual(initialX)
    })

    it('should execute jump block', async () => {
      engine['player'].onGround = true

      await interpreter.execute('jump()')

      expect(engine['player'].velocity.y).toBeLessThan(0)
    })

    it('should execute multiple blocks in sequence', async () => {
      const initialX = engine['player'].position.x

      await interpreter.execute('moveright(); await moveright();')

      expect(engine['player'].position.x).toBeGreaterThan(initialX)
    })

    it('should execute repeat loop', async () => {
      const initialX = engine['player'].position.x

      await interpreter.execute('for (let i = 0; i < 3; i++) { await moveright(); }')

      expect(engine['player'].position.x).toBeGreaterThan(initialX)
    })
  })

  describe('stop', () => {
    it('should stop execution', async () => {
      const code = 'for (let i = 0; i < 100; i++) { await moveright(); }'

      // Start execution but don't wait
      const execution = interpreter.execute(code)

      // Stop immediately
      interpreter.stop()

      await execution

      expect(interpreter.isExecuting()).toBe(false)
    })
  })

  describe('isExecuting', () => {
    it('should return true while executing', async () => {
      const code = 'moveright()'

      const execution = interpreter.execute(code)

      expect(interpreter.isExecuting()).toBe(true)

      await execution

      expect(interpreter.isExecuting()).toBe(false)
    })
  })

  describe('Execution limits', () => {
    it('should throw error for too many steps', async () => {
      // Create code that will exceed step limit
      const code = 'for (let i = 0; i < 10000; i++) { isspikeahead(); }'

      await expect(interpreter.execute(code)).rejects.toThrow('terlalu panjang')
    })
  })
})
```

**Step 3: Run tests to verify they pass**

Run: `yarn test app/frontend/components/PlatformerGame/__tests__/PlatformerInterpreter.test.ts`

Expected: PASS (all interpreter tests pass)

**Step 4: Commit**

```bash
git add app/frontend/components/PlatformerGame/
git commit -m "feat(platformer): add interpreter for Blockly execution

- Implement PlatformerInterpreter with async execution
- Support movement blocks: moveright, moveleft, jump
- Support conditional checks: isspikeahead, isgapahead
- Add execution limits (max steps, max time)
- Transform Blockly code to async JavaScript
- Add comprehensive interpreter tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Blockly Toolbox Definitions

**Files:**
- Create: `app/frontend/components/PlatformerGame/PlatformerToolbox.ts`

**Step 1: Write the toolbox definitions**

```typescript
// app/frontend/components/PlatformerGame/PlatformerToolbox.ts

import type { PlatformerLevelConfig } from './PlatformerTypes'

interface ToolboxCategory {
  kind: 'category'
  name: string
  colour: string
  contents: any[]
}

interface Toolbox {
  kind: 'categoryToolboxCategory'
  contents: any[]
}

export function createPlatformerToolbox(
  levelConfig: PlatformerLevelConfig,
  t: (key: string, params?: Record<string, string | number>) => string
): Toolbox {
  const contents: any[] = []

  // Movement category
  if (levelConfig.availableBlocks.includes('move_right') || levelConfig.availableBlocks.includes('move_left')) {
    const movementBlocks: any[] = []

    if (levelConfig.availableBlocks.includes('move_right')) {
      movementBlocks.push({
        kind: 'block',
        type: 'move_right',
      })
    }

    if (levelConfig.availableBlocks.includes('move_left')) {
      movementBlocks.push({
        kind: 'block',
        type: 'move_left',
      })
    }

    if (levelConfig.availableBlocks.includes('jump')) {
      movementBlocks.push({
        kind: 'block',
        type: 'jump',
      })
    }

    contents.push({
      kind: 'category',
      name: t('platformer.blocks.movement', { defaultValue: 'Movement' }),
      colour: '120',
      contents: movementBlocks,
    } as ToolboxCategory)
  }

  // Loops category
  if (levelConfig.availableBlocks.includes('repeat')) {
    contents.push({
      kind: 'category',
      name: t('platformer.blocks.loops', { defaultValue: 'Loops' }),
      colour: '180',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              shadow: { type: 'math_number', fields: { NUM: 3 } },
            },
          },
        },
      ],
    } as ToolboxCategory)
  }

  // Logic category
  if (levelConfig.availableBlocks.includes('if_spike_ahead') || levelConfig.availableBlocks.includes('if_gap_ahead')) {
    const logicBlocks: any[] = []

    if (levelConfig.availableBlocks.includes('if_spike_ahead')) {
      logicBlocks.push({
        kind: 'block',
        type: 'if_spike_ahead',
      })
    }

    if (levelConfig.availableBlocks.includes('if_gap_ahead')) {
      logicBlocks.push({
        kind: 'block',
        type: 'if_gap_ahead',
      })
    }

    contents.push({
      kind: 'category',
      name: t('platformer.blocks.logic', { defaultValue: 'Logic' }),
      colour: '210',
      contents: logicBlocks,
    } as ToolboxCategory)
  }

  return {
    kind: 'categoryToolboxCategory',
    contents,
  }
}

// Block definitions for Blockly
export function definePlatformerBlocks(): void {
  if (typeof Blockly === 'undefined') return

  // Move right block
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'move_right',
      message0: 'gerak kanan',
      previousStatement: null,
      nextStatement: null,
      colour: '120',
      tooltip: 'Gerakkan karakter ke kanan',
      helpUrl: '',
    },
    {
      type: 'move_left',
      message0: 'gerak kiri',
      previousStatement: null,
      nextStatement: null,
      colour: '120',
      tooltip: 'Gerakkan karakter ke kiri',
      helpUrl: '',
    },
    {
      type: 'jump',
      message0: 'lompat',
      previousStatement: null,
      nextStatement: null,
      colour: '120',
      tooltip: 'Buat karakter melompat',
      helpUrl: '',
    },
    {
      type: 'if_spike_ahead',
      message0: 'jika ada duri di depan',
      message1: 'lakukan %1',
      args1: [
        {
          type: 'input_statement',
          name: 'DO',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '210',
      tooltip: 'Cek jika ada duri di depan karakter',
      helpUrl: '',
    },
    {
      type: 'if_gap_ahead',
      message0: 'jika ada lubang di depan',
      message1: 'lakukan %1',
      args1: [
        {
          type: 'input_statement',
          name: 'DO',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '210',
      tooltip: 'Cek jika ada lubang di depan karakter',
      helpUrl: '',
    },
  ])

  // Generator for JavaScript
  const javascriptGenerator = (Blockly as any).javascriptGenerator
  if (!javascriptGenerator) return

  javascriptGenerator['move_right'] = function (block: any) {
    return 'moveright();\n'
  }

  javascriptGenerator['move_left'] = function (block: any) {
    return 'moveleft();\n'
  }

  javascriptGenerator['jump'] = function (block: any) {
    return 'jump();\n'
  }

  javascriptGenerator['if_spike_ahead'] = function (block: any) {
    const statementsDo = javascriptGenerator.statementToCode(block, 'DO')
    return `if (isspikeahead()) {\n  ${statementsDo}}\n`
  }

  javascriptGenerator['if_gap_ahead'] = function (block: any) {
    const statementsDo = javascriptGenerator.statementToCode(block, 'DO')
    return `if (isgapahead()) {\n  ${statementsDo}}\n`
  }
}
```

**Step 2: Update locale files with translations**

Read: `config/locales/en.yml`

Add to en.yml under `en:`:

```yaml
platformer:
  blocks:
    movement: "Movement"
    loops: "Loops"
    logic: "Logic"
  title: "Dungeon Platformer"
  subtitle: "Help the adventurer reach the goal!"
  level: "Level %{level}/%{total}"
  reset: "Reset"
  run: "Run"
  running: "Running..."
  generated_code: "Generated Code"
  block_limit: "Block limit"
  instructions:
    title: "📋 Instructions"
    step1: "1. Drag blocks to create a program"
    step2: "2. Click Run to execute"
    step3: "3. Guide the adventurer 🧙 to the goal 🚩"
    collect: "🪙 Collect %{count} item(s)!"
  success:
    title: "🎉 Congratulations!"
    message: "You completed Level %{level}!"
    xp_earned: "+%{points} XP Earned!"
    close: "Close"
    next_level: "Next Level →"
  failure:
    title: "😢 Try Again!"
    crash: "You hit a spike!"
    fell: "You fell into the abyss!"
    not_enough_items: "Collect more items first!"
    try_again: "Try Again"
```

Read: `config/locales/id.yml`

Add to id.yml under `id:`:

```yaml
platformer:
  blocks:
    movement: "Pergerakan"
    loops: "Perulangan"
    logic: "Logika"
  title: "Platformer Dungeon"
  subtitle: "Bantu petualang mencapai tujuan!"
  level: "Level %{level}/%{total}"
  reset: "Reset"
  run: "Jalankan"
  running: "Menjalankan..."
  generated_code: "Kode Yang Dibuat"
  block_limit: "Batas blok"
  instructions:
    title: "📋 Instruksi"
    step1: "1. Tarik blok untuk membuat program"
    step2: "2. Klik Jalankan untuk eksekusi"
    step3: "3. Pandu petualang 🧙 ke tujuan 🚩"
    collect: "🪙 Kumpulkan %{count} item!"
  success:
    title: "🎉 Selamat!"
    message: "Kamu menyelesaikan Level %{level}!"
    xp_earned: "+%{points} XP Didapat!"
    close: "Tutup"
    next_level: "Level Berikutnya →"
  failure:
    title: "😢 Coba Lagi!"
    crash: "Kamu menabrak duri!"
    fell: "Kamu jatuh ke jurang!"
    not_enough_items: "Kumpulkan lebih banyak item dulu!"
    try_again: "Coba Lagi"
```

**Step 3: Commit**

```bash
git add app/frontend/components/PlatformerGame/ config/locales/
git commit -m "feat(platformer): add Blockly toolbox and block definitions

- Movement blocks: move_right, move_left, jump
- Loop block: controls_repeat_ext
- Logic blocks: if_spike_ahead, if_gap_ahead
- Add translations for English and Indonesian
- Dynamic toolbox based on level config

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create Main PlatformerGame React Component

**Files:**
- Create: `app/frontend/components/PlatformerGame/PlatformerGame.tsx`

**Step 1: Write the PlatformerGame component**

```typescript
// app/frontend/components/PlatformerGame/PlatformerGame.tsx

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { Play, RotateCcw, ChevronLeft, ChevronRight, Trophy, XCircle } from 'lucide-react'

import { PlatformerEngine } from './PlatformerEngine'
import { PlatformerInterpreter } from './PlatformerInterpreter'
import { getLevelConfig } from './PlatformerLevels'
import { createPlatformerToolbox, definePlatformerBlocks } from './PlatformerToolbox'
import { ResultType, MAX_LEVEL, CANVAS_WIDTH, CANVAS_HEIGHT } from './PlatformerTypes'
import { useTranslation } from '@/hooks/useTranslation'

// Initialize blocks
definePlatformerBlocks()

interface PlatformerGameProps {
  initialLevel?: number
  onComplete?: (resultType: ResultType) => void
}

const PlatformerGame: React.FC<PlatformerGameProps> = ({ initialLevel = 1, onComplete }) => {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<PlatformerEngine | null>(null)
  const interpreterRef = useRef<PlatformerInterpreter | null>(null)

  const [level, setLevel] = useState(initialLevel)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<ResultType>(ResultType.UNSET)
  const [code, setCode] = useState('')
  const [blockCount, setBlockCount] = useState(0)
  const [collectedCount, setCollectedCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFailure, setShowFailure] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState<number>(0)

  const levelConfig = getLevelConfig(level)
  const toolbox = createPlatformerToolbox(levelConfig, t)

  const workspaceConfiguration = {
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
    trashcan: true,
    maxBlocks: levelConfig.maxBlocks === Infinity ? undefined : levelConfig.maxBlocks,
  }

  // Handle Game Completion
  const handleGameComplete = useCallback((resultType: ResultType) => {
    setResult(resultType)
    setIsRunning(false)
    setCollectedCount(engineRef.current?.getCollectedCount() || 0)

    if (onComplete) {
      onComplete(resultType)
    }

    if (resultType === ResultType.SUCCESS) {
      const points = level * 50
      setEarnedPoints(points)
      setShowSuccess(true)
    } else if (resultType === ResultType.FAILURE || resultType === ResultType.CRASH) {
      setShowFailure(true)
    }
  }, [level, onComplete])

  // Initialize engine
  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      const engine = new PlatformerEngine(levelConfig)
      engineRef.current = engine
      interpreterRef.current = new PlatformerInterpreter(engine)

      engine.setOnComplete(handleGameComplete)

      engine.initialize(canvasRef.current)
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update level
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setLevel(levelConfig)
      setResult(ResultType.UNSET)
      setShowSuccess(false)
      setShowFailure(false)
      setEarnedPoints(0)
      setCollectedCount(0)
    }
  }, [level]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleWorkspaceChange = useCallback((workspace: Blockly.WorkspaceSvg) => {
    const generatedCode = javascriptGenerator.workspaceToCode(workspace)
    setCode(generatedCode)
    setBlockCount(workspace.getAllBlocks(false).length)
  }, [])

  const handleRun = async () => {
    if (!interpreterRef.current || isRunning) return

    if (blockCount === 0) {
      setShowFailure(true)
      setResult(ResultType.FAILURE)
      return
    }

    setIsRunning(true)
    setResult(ResultType.UNSET)
    setShowSuccess(false)
    setShowFailure(false)

    try {
      await interpreterRef.current.execute(code)
    } catch (error) {
      console.error('Execution error:', error)
      setShowFailure(true)
      setResult(ResultType.FAILURE)
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.reset()
    }
    if (interpreterRef.current) {
      interpreterRef.current.stop()
    }
    setIsRunning(false)
    setResult(ResultType.UNSET)
    setShowSuccess(false)
    setShowFailure(false)
    setCollectedCount(0)
  }

  const handleNextLevel = () => {
    if (level < MAX_LEVEL) {
      setLevel(level + 1)
      handleReset()
    }
  }

  const handlePrevLevel = () => {
    if (level > 1) {
      setLevel(level - 1)
      handleReset()
    }
  }

  const getFailureMessage = () => {
    switch (result) {
      case ResultType.CRASH:
        return t('platformer.failure.crash', { defaultValue: 'You hit a spike!' })
      case ResultType.FAILURE:
        if (collectedCount < levelConfig.requiredCollectibles) {
          return t('platformer.failure.not_enough_items', {
            defaultValue: `Collect ${levelConfig.requiredCollectibles} item(s) first!`
          })
        }
        return t('platformer.failure.fell', { defaultValue: 'You fell into the abyss!' })
      default:
        return t('platformer.failure.try_again', { defaultValue: 'Try Again!' })
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏰</span>
          <div>
            <h1 className="text-xl font-bold">{t('platformer.title', { defaultValue: 'Dungeon Platformer' })}</h1>
            <p className="text-sm text-indigo-100">{t('platformer.subtitle', { defaultValue: 'Help the adventurer reach the goal!' })}</p>
          </div>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
          <button
            onClick={handlePrevLevel}
            disabled={level <= 1}
            className="p-1 hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold min-w-[100px] text-center">
            {t('platformer.level', {
              level: String(level),
              total: String(MAX_LEVEL),
              defaultValue: `Level ${level}/${MAX_LEVEL}`
            })}
          </span>
          <button
            onClick={handleNextLevel}
            disabled={level >= MAX_LEVEL}
            className="p-1 hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
          >
            <RotateCcw size={18} />
            {t('platformer.reset', { defaultValue: 'Reset' })}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={18} />
            {isRunning
              ? t('platformer.running', { defaultValue: 'Running...' })
              : t('platformer.run', { defaultValue: 'Run' })}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Blockly Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex-1 relative">
            <BlocklyWorkspace
              className="w-full h-full"
              toolboxConfiguration={toolbox}
              workspaceConfiguration={workspaceConfiguration}
              onWorkspaceChange={handleWorkspaceChange}
            />
          </div>
          {/* Code preview */}
          <div className="h-24 bg-gray-900 overflow-y-auto p-3 text-xs font-mono text-green-400 border-t border-gray-700">
            <div className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">
              {t('platformer.generated_code', { defaultValue: 'Generated Code' })}
            </div>
            <pre className="whitespace-pre-wrap">{code || '// Drag blocks to see code...'}</pre>
          </div>
        </div>

        {/* Game canvas and info */}
        <div className="w-[520px] flex flex-col gap-4">
          {/* Canvas container */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="rounded-lg border-4 border-indigo-200 shadow-inner"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* Block limit indicator */}
            {levelConfig.maxBlocks !== Infinity && (
              <div className="mt-3 text-sm text-gray-600">
                {t('platformer.block_limit', { defaultValue: 'Block limit' })}:{' '}
                <span className="font-bold text-indigo-600">{levelConfig.maxBlocks}</span>
              </div>
            )}

            {/* Collectibles counter */}
            {levelConfig.requiredCollectibles > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                🪙 {collectedCount}/{levelConfig.requiredCollectibles}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              {t('platformer.instructions.title', { defaultValue: '📋 Instructions' })}
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>{t('platformer.instructions.step1', { defaultValue: '1. Drag blocks to create a program' })}</li>
              <li>{t('platformer.instructions.step2', { defaultValue: '2. Click Run to execute' })}</li>
              <li>{t('platformer.instructions.step3', { defaultValue: '3. Guide the adventurer 🧙 to the goal 🚩' })}</li>
              {levelConfig.requiredCollectibles > 0 && (
                <li className="text-amber-600 font-medium">
                  {t('platformer.instructions.collect', {
                    count: String(levelConfig.requiredCollectibles),
                    defaultValue: `🪙 Collect ${levelConfig.requiredCollectibles} item(s)!`
                  })}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce-in">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('platformer.success.title', { defaultValue: '🎉 Congratulations!' })}
            </h2>
            <p className="text-gray-600 mb-2">
              {t('platformer.success.message', { level: String(level), defaultValue: `You completed Level ${level}!` })}
            </p>

            {earnedPoints > 0 && (
              <div className="bg-green-100 text-green-700 py-1 px-3 rounded-full inline-block font-bold mb-6">
                {t('platformer.success.xp_earned', { points: String(earnedPoints), defaultValue: `+${earnedPoints} XP Earned!` })}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowSuccess(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                {t('platformer.success.close', { defaultValue: 'Close' })}
              </button>
              {level < MAX_LEVEL && (
                <button
                  onClick={() => {
                    setShowSuccess(false)
                    handleNextLevel()
                  }}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                >
                  {t('platformer.success.next_level', { defaultValue: 'Next Level →' })}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {showFailure && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('platformer.failure.title', { defaultValue: '😢 Try Again!' })}
            </h2>
            <p className="text-gray-600 mb-6">{getFailureMessage()}</p>
            <button
              onClick={() => {
                setShowFailure(false)
                handleReset()
              }}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors"
            >
              {t('platformer.failure.try_again', { defaultValue: 'Try Again' })}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlatformerGame
```

**Step 2: Create test file**

```typescript
// app/frontend/components/PlatformerGame/__tests__/PlatformerGame.test.tsx

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PlatformerGame from '../PlatformerGame'
import { ResultType } from '../PlatformerTypes'

// Mock react-blockly
vi.mock('react-blockly', () => ({
  BlocklyWorkspace: ({ onWorkspaceChange }: any) => {
    React.useEffect(() => {
      // Mock workspace
      const mockWorkspace = {
        getAllBlocks: () => [],
      }
      onWorkspaceChange(mockWorkspace)
    }, [onWorkspaceChange])
    return <div data-testid="blockly-workspace">Blockly Workspace</div>
  }
}))

// Mock Blockly
vi.mock('blockly/core', () => ({}))
vi.mock('blockly/javascript', () => ({
  javascriptGenerator: {
    workspaceToCode: () => ''
  }
}))

// Mock canvas context
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  fillStyle: '',
  beginPath: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  font: '',
  fillText: vi.fn(),
  strokeStyle: '',
  lineWidth: 0,
}))

// Mock requestAnimationFrame
vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
  setTimeout(() => cb(0), 0)
  return 0
})

describe('PlatformerGame', () => {
  it('should render the game component', () => {
    render(<PlatformerGame />)

    expect(screen.getByText('Dungeon Platformer')).toBeInTheDocument()
    expect(screen.getByTestId('blockly-workspace')).toBeInTheDocument()
  })

  it('should show level indicator', () => {
    render(<PlatformerGame initialLevel={1} />)

    expect(screen.getByText(/Level 1\/10/)).toBeInTheDocument()
  })

  it('should render controls', () => {
    render(<PlatformerGame />)

    expect(screen.getByText('Reset')).toBeInTheDocument()
    expect(screen.getByText('Run')).toBeInTheDocument()
  })
})
```

**Step 3: Run tests**

Run: `yarn test app/frontend/components/PlatformerGame/__tests__/PlatformerGame.test.tsx`

Expected: PASS (component renders correctly)

**Step 4: Commit**

```bash
git add app/frontend/components/PlatformerGame/
git commit -m "feat(platformer): add main React component

- PlatformerGame with header, canvas, Blockly workspace
- Level selector and controls (Run, Reset)
- Success and failure modals
- Instructions panel with level-specific info
- Collectibles counter display
- Responsive layout with proper styling

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Create Playground Page for Platformer Game

**Files:**
- Create: `app/frontend/Pages/Student/Playground/Platformer.tsx`
- Modify: `config/routes.rb`

**Step 1: Create the playground page**

```typescript
// app/frontend/Pages/Student/Playground/Platformer.tsx

import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import PlatformerGame from '@/components/PlatformerGame/PlatformerGame'
import { useTranslation } from '@/hooks/useTranslation'

export default function Platformer() {
  const { t } = useTranslation()

  return (
    <>
      <Head title="Platformer Playground" />
      <StudentLayout>
        <div className="h-full p-6">
          <PlatformerGame />
        </div>
      </StudentLayout>
    </>
  )
}

Platformer.layout = StudentLayout
```

**Step 2: Add route**

Add to `config/routes.rb` under `namespace :student do`:

```ruby
get 'playground/platformer', to: 'playground#platformer'
```

**Step 3: Add controller action**

Update `app/controllers/student/playground_controller.rb`:

```ruby
class Student::PlaygroundController < StudentController
  def index
    # Existing maze playground
  end

  def platformer
    # Platformer playground - just render the page
  end
end
```

**Step 4: Commit**

```bash
git add app/frontend/Pages/Student/Playground/Platformer.tsx config/routes.rb app/controllers/student/playground_controller.rb
git commit -m "feat(platformer): add playground page

- Create /student/playground/platformer route
- Add Platformer.tsx page component
- Add platformer action to playground controller

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Final Testing and Polish

**Step 1: Run full test suite**

Run: `yarn test app/frontend/components/PlatformerGame/`

Expected: All tests pass

**Step 2: Manual testing checklist**

- [ ] Navigate to `/student/playground/platformer`
- [ ] Canvas renders with player, platform, goal
- [ ] Can drag blocks from toolbox
- [ ] Can click Run and see animation
- [ ] Level 1: Can complete by moving right
- [ ] Level 2: Need to jump over gap
- [ ] Level 4: Repeat block works
- [ ] Level 7: Spike detection works
- [ ] Reset button works
- [ ] Level selector works
- [ ] Success modal shows on completion
- [ ] Failure modal shows on crash/fall

**Step 3: Fix any bugs found during testing**

(Depends on what issues are found)

**Step 4: Final commit**

```bash
git add .
git commit -m "feat(platformer): complete platformer game implementation

- All 10 levels with progressive difficulty
- Physics engine with gravity and collision detection
- Blockly interpreter with all block types
- Full UI with modals and instructions
- Translations for English and Indonesian
- Comprehensive test coverage

Playable at /student/playground/platformer

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

This implementation plan creates a complete platformer game for teaching programming:

**Components Created:**
1. `PlatformerTypes.ts` - Type definitions and constants
2. `PlatformerLevels.ts` - 10 level configurations
3. `PlatformerEngine.ts` - Physics, rendering, collision
4. `PlatformerInterpreter.ts` - Blockly code execution
5. `PlatformerToolbox.ts` - Block definitions and toolbox
6. `PlatformerGame.tsx` - Main React component
7. `Platformer.tsx` - Playground page

**Total Tasks:** 8
**Estimated Time:** 5-8 days
**Test Files:** 7 test files covering all components
