// Type definitions for Platformer Game

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
  platforms: [number, number, number, number][] // [x, y, w, h]
  obstacles: [number, number, number, number, string][] // [x, y, w, h, type]
  collectibles: [number, number, string][] // [x, y, type]
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
export const GRAVITY = 0.8
export const GRID_SIZE = 50 // One step = one grid cell
export const MOVE_SPEED = GRID_SIZE // Move exactly one grid cell
export const JUMP_POWER = -14
export const TERMINAL_VELOCITY = 15

// Player dimensions
export const PLAYER_WIDTH = 24
export const PLAYER_HEIGHT = 32

// Maximum level
export const MAX_LEVEL = 10
