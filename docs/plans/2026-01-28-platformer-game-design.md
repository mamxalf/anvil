# Platformer Game Design Document

**Date:** 2026-01-28
**Status:** Design Approved
**Author:** Design Collaboration with User

## Table of Contents
1. [Concept Overview](#concept-overview)
2. [Architecture](#architecture)
3. [Game Mechanics & Physics](#game-mechanics--physics)
4. [Blockly Blocks](#blockly-blocks)
5. [Level Design](#level-design)
6. [UI/UX Design](#uiux-design)
7. [Asset & Visual Design](#asset--visual-design)
8. [Error Handling](#error-handling)
9. [Testing Strategy](#testing-strategy)
10. [Implementation Phases](#implementation-phases)

---

## Concept Overview

### Vision
Create a platformer game (Mario-style) where children learn programming through Blockly blocks. The game features a tiny adventurer navigating dungeon environments, collecting coins, avoiding obstacles, and reaching the goal.

### Key Design Decisions

1. **Simple Side-Scroller**: Easier to implement, can reuse patterns from MazeEngine
2. **Dungeon/Adventure Theme**: Classic and engaging for kids
3. **Tiny Adventurer Character**: Simple sprite (canvas-drawn for MVP)
4. **Incremental Difficulty**: Introduce blocks gradually (movement → loop → conditional)
5. **Standalone First**: Build independent game, integrate with lesson system later

### Learning Objectives

- **Level 1-3**: Sequencing (movement + jump)
- **Level 4-6**: Loops (repeat patterns)
- **Level 7+**: Conditionals (if_spike_ahead, if_gap_ahead)
- **Collectibles**: Encourage exploration and optimal paths

---

## Architecture

### High-Level Structure

```
PlatformerGame.tsx          # Main container component
├── PlatformerEngine.ts      # Physics, rendering, collision detection
├── PlatformerInterpreter.ts # Execute Blockly blocks with animation
├── PlatformerLevels.ts      # Level configuration data
├── PlatformerToolbox.ts     # Blockly toolbox definitions
└── PlatformerTypes.ts       # TypeScript type definitions
```

### Type System

```typescript
// Game State
export enum ResultType {
  UNSET = 0,
  FAILURE = 1,
  SUCCESS = 2,
  CRASH = 3,
}

export interface Position {
  x: number
  y: number
}

export interface PlayerState {
  position: Position
  velocity: { x: number; y: number }
  width: number
  height: number
  onGround: boolean
}

export interface Collectible {
  x: number
  y: number
  type: 'coin' | 'gem'
  collected: boolean
}

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'spike' | 'lava'
}

export interface Platform {
  x: number
  y: number
  width: number
  height: number
}

// Level Configuration
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
```

---

## Game Mechanics & Physics

### Physics Constants

```typescript
const GRAVITY = 0.5           // pixels per frame^2
const MOVE_SPEED = 5          // pixels per frame
const JUMP_POWER = -12        // initial velocity
const TERMINAL_VELOCITY = 15  // max fall speed
```

### Game Loop

```typescript
class PlatformerEngine {
  update(): void {
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

    // Check collisions
    this.checkPlatformCollisions()
    this.checkObstacleCollisions()
    this.checkCollectibleCollisions()
    this.checkGoalCollision()
    this.checkWorldBounds()

    // Render
    this.render()
  }
}
```

### Collision Detection (AABB)

```typescript
private isColliding(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

private checkPlatformCollisions(): void {
  this.player.onGround = false

  for (const platform of this.level.platforms) {
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
}
```

---

## Blockly Blocks

### Level 1-3: Movement Blocks

```typescript
// move_forward
{
  type: 'move_right',
  message0: 'gerak kanan'
}

// move_left
{
  type: 'move_left',
  message0: 'gerak kiri'
}

// jump
{
  type: 'jump',
  message0: 'lompat',
  args0: [{
    type: 'field_number',
    name: 'power',
    value: 1
  }]
}
```

### Level 4-6: Loop Blocks

```typescript
// repeat
{
  type: 'controls_repeat_ext',
  message0: 'ulangi %1 kali',
  args0: [{
    type: 'field_number',
    name: 'TIMES',
    value: 3
  }],
  message1: '%1',
  args1: [{
    type: 'input_statement',
    name: 'DO'
  }]
}
```

### Level 7+: Conditional Blocks

```typescript
// if_spike_ahead
{
  type: 'if_spike_ahead',
  message0: 'jika ada duri di depan',
  message1: 'lakukan %1',
  args1: [{
    type: 'input_statement',
    name: 'DO'
  }]
}

// if_gap_ahead
{
  type: 'if_gap_ahead',
  message0: 'jika ada lubang di depan',
  message1: 'lakukan %1',
  args1: [{
    type: 'input_statement',
    name: 'DO'
  }]
}
```

---

## Level Design

### Level 1: Movement Basics

```typescript
{
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
```

### Level 2: Introduction to Jump

```typescript
{
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
  collectibles: [[300, 330, 'coin']],
  availableBlocks: ['move_right', 'jump'],
  maxBlocks: 6,
  requiredCollectibles: 0
}
```

### Level 4: Introduction to Loops

```typescript
{
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
```

### Level 7: Introduction to Conditionals

```typescript
{
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
    [200, 340, 30, 30, 'spike'],
    [350, 340, 30, 30, 'spike'],
    [500, 340, 30, 30, 'spike'],
  ],
  collectibles: [],
  availableBlocks: ['move_right', 'jump', 'if_spike_ahead'],
  maxBlocks: 10,
  requiredCollectibles: 0
}
```

See implementation file for all 10 levels.

---

## UI/UX Design

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header: 🏰 Dungeon Platformer          Level 1/10    [Reset] [Run]  │
├─────────────────────────────────┬───────────────────────────────────┤
│                                 │                                   │
│  ┌─────────────────────────┐   │  ┌─────────────────────────────┐ │
│  │                         │   │  │  Blockly Workspace           │ │
│  │   Game Canvas           │   │  │                              │ │
│  │   (scrollable if wide)  │   │  │  ┌──────┐ ┌──────┐           │ │
│  │                         │   │  │  │move  │ │jump  │           │ │
│  │   🧙─→      🚩         │   │  │  └──────┘ └──────┘           │ │
│  │   █             █       │   │  │                              │ │
│  │   ▲             ▲       │   │  │  ┌──────────────────┐        │ │
│  │                         │   │  │  │ repeat 3 times   │        │ │
│  └─────────────────────────┘   │  │  └──────────────────┘        │ │
│                                 │  └─────────────────────────────┘ │
│  Block limit: 5                 │                                   │
│  Coins: 0/3                     │  Generated Code:                 │
│                                 │  move_right()                    │
│  ┌─────────────────────────┐   │  jump()                          │
│  │ 📋 Instructions         │   │  repeat(3) {                     │
│  │ 1. Drag blocks          │   │    move_right()                  │
│  │ 2. Click Run            │   │  }                               │
│  │ 3. Reach the flag!      │   │                                   │
│  └─────────────────────────┘   │                                   │
└─────────────────────────────────┴───────────────────────────────────┘
```

### Component Props

```typescript
interface PlatformerGameProps {
  initialLevel?: number
  onComplete?: (result: ResultType, stars: number) => void
}

interface PlatformerGameState {
  level: number
  isRunning: boolean
  result: ResultType
  code: string
  blockCount: number
  collectedItems: number
  showSuccess: boolean
  showFailure: boolean
  earnedStars: number
}
```

---

## Asset & Visual Design

### Canvas Drawing (MVP)

```typescript
// Draw player (tiny adventurer)
ctx.fillStyle = '#3B82F6'  // Blue tunic
ctx.fillRect(x, y, 24, 32)
ctx.fillStyle = '#FCD34D'  // Gold helmet
ctx.fillRect(x + 4, y - 4, 16, 8)

// Draw platform
ctx.fillStyle = '#78350F'  // Brown dungeon floor
ctx.fillRect(px, py, pw, ph)
ctx.strokeStyle = '#92400E'
ctx.strokeRect(px, py, pw, ph)

// Draw spike
ctx.fillStyle = '#DC2626'  // Red spike
ctx.beginPath()
ctx.moveTo(sx, sy + 30)
ctx.moveTo(sx + 15, sy)
ctx.moveTo(sx + 30, sy + 30)
ctx.fill()

// Draw coin
ctx.fillStyle = '#FBBF24'
ctx.beginPath()
ctx.arc(cx, cy, 10, 0, Math.PI * 2)
ctx.fill()
```

### Future: Kenney.nl Assets

- **Platformer Pack Redux**: https://kenney.nl/assets/platformer-pack-redux
- Can integrate after MVP is working

---

## Error Handling

### Infinite Loop Protection

```typescript
const MAX_EXECUTION_STEPS = 1000
const MAX_EXECUTION_TIME = 30000  // 30 seconds

async execute(code: string) {
  this.steps = 0
  this.startTime = Date.now()

  try {
    await this.executeStatements(this.parse(code))
  } catch (e) {
    if (this.steps >= MAX_EXECUTION_STEPS) {
      return this.showError('Program terlalu panjang! Gunakan loop dengan bijak.')
    }
    if (Date.now() - this.startTime > MAX_EXECUTION_TIME) {
      return this.showError('Waktu habis! Program terlalu lama.')
    }
    return this.showError('Terjadi kesalahan: ' + e.message)
  }
}
```

### Edge Cases

1. **Player falls off world** → ResultType.FAILURE
2. **Player gets stuck** → Show hint after 3 seconds
3. **All coins collected but goal not reached** → Show hint
4. **Empty workspace** → Error message before run

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
describe('PlatformerEngine', () => {
  it('should apply gravity to player')
  it('should detect collision with platform')
  it('should detect goal reached')
})

describe('PlatformerInterpreter', () => {
  it('should execute move_right block')
  it('should execute jump block')
  it('should execute repeat block')
  it('should execute conditional block')
})
```

### Manual Testing Checklist

- [ ] Level 1: Player bisa gerak kanan sampai goal
- [ ] Level 2: Player bisa jump atas gap
- [ ] Level 4: Repeat block berfungsi
- [ ] Level 7: Spike detection bekerja
- [ ] Fall off world → failure
- [ ] Collect coin → counter increases
- [ ] All coins collected tapi belum goal → hint muncul
- [ ] Run tanpa blok → error message
- [ ] Reset button → kembali ke spawn

---

## Implementation Phases

### Phase 1: Core Engine (2-3 days)
```
Files:
├── PlatformerTypes.ts          # Type definitions
├── PlatformerEngine.ts         # Physics, rendering, collision
└── PlatformerLevels.ts         # 10 level configs

Tasks:
- Define all types
- Implement physics (gravity, movement, jump)
- Implement collision detection (AABB)
- Implement canvas rendering
- Create 10 level configurations
- Unit tests for Engine
```

### Phase 2: Interpreter (1-2 days)
```
Files:
├── PlatformerInterpreter.ts    # Execute Blockly blocks

Tasks:
- Parse Blockly XML to AST
- Implement executeStatement for each block type
- Add execution delays for animation
- Add infinite loop protection
- Unit tests for Interpreter
```

### Phase 3: UI Component (1-2 days)
```
Files:
├── PlatformerGame.tsx          # Main component
├── PlatformerToolbox.ts        # Blockly toolbox

Tasks:
- Build React component with state management
- Integrate BlocklyWorkspace
- Add controls (Run, Reset, level selector)
- Add success/failure modals
- Add instruction panel
```

### Phase 4: Polish (1 day)
```
Tasks:
- Add sound effects (optional)
- Add particle effects
- Smooth animations
- Error feedback UX
- Mobile responsiveness
```

**Total Estimate:** 5-8 days

---

## Summary

A platformer game for teaching programming with Blockly, featuring:
- Simple side-scroller mechanics with dungeon theme
- Tiny adventurer character (canvas-drawn)
- Progressive difficulty: movement → loops → conditionals
- 10 hand-designed levels
- Comprehensive error handling
- Standalone implementation (lesson integration later)

Ready to start implementation!
