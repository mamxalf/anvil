// Type definitions for Maze Game

export enum PathType {
  WALL = 0,
  PATH = 1,
  START = 2,
  FINISH = 3,
  PICK = 4,
}

export enum DirectionType {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

export enum ResultType {
  UNSET = 0,
  FAILURE = 1,
  SUCCESS = 2,
  CRASH = 3,
}

export enum AnimationStateType {
  UNSET = 0,
  MOVE_FORWARD = 1,
  TURN_RIGHT = 2,
  TURN_LEFT = 3,
}

export type LevelMap = PathType[][]

export interface Position {
  x: number
  y: number
}

export interface LevelConfig {
  level: number
  map: LevelMap
  blocks: string[]
  maxBlocks: number
  initialDirection: DirectionType
  collectiblesCount: number
}

export interface RoleState {
  position: Position
  direction: DirectionType
  sx: number
  sy: number
}

export interface MazeState {
  level: number
  role: RoleState
  result: ResultType
  animationState: AnimationStateType
  collectiblesCollected: number
  isRunning: boolean
}

// Constants
export const MAZE_WIDTH = 500
export const MAZE_HEIGHT = 500
export const GRID_COLS = 10
export const GRID_ROWS = 10
export const SQUARE_SIZE = MAZE_WIDTH / GRID_COLS
export const SPRITE_WIDTH = 150
export const MAX_LEVEL = 10

// Activity Config Types for Lesson Integration
export interface MazeLevelConfig {
  maze_level: number
  grid_size: [number, number] // [width, height]
  start_pos: [number, number] // [x, y]
  goal_pos: [number, number] // [x, y]
  obstacles: [number, number][] // Array of [x, y] positions
  optimal_blocks: number
  optimal_time_seconds: number
  available_blocks: string[]
  initial_blocks?: unknown[] // Optional pre-placed blocks
  required_blocks?: string[] // Blocks that must be used
  character?: string // Character type
  goal_item?: string // Goal item type
}

export interface ExecutionResult {
  success: boolean
  duration: number // milliseconds
  blocks_executed: number
  error?: string
}
