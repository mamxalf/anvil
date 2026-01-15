// Core game engine for Maze Game
import {
  PathType,
  DirectionType,
  ResultType,
  AnimationStateType,
  Position,
  MazeState,
  RoleState,
  MAZE_WIDTH,
  MAZE_HEIGHT,
  GRID_COLS,
  GRID_ROWS,
  SQUARE_SIZE,
  SPRITE_WIDTH,
} from './MazeTypes'
import { LevelConfig, getLevelConfig } from './MazeLevels'

// Asset paths - served from public/images/maze/
const ASSET_BASE = '/images/maze/'

export class MazeEngine {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private state: MazeState
  private levelConfig: LevelConfig
  private startPosition: Position = { x: 0, y: 0 }
  private finishPosition: Position = { x: 0, y: 0 }

  // Images
  private images: { [key: string]: HTMLImageElement } = {}
  private imagesLoaded = false

  // Animation
  private animationFrameId: number | null = null
  private animationQueue: (() => Promise<void>)[] = []
  private isAnimating = false

  // Callbacks
  private onStateChange?: (state: MazeState) => void
  private onComplete?: (result: ResultType) => void

  constructor(level = 1) {
    this.levelConfig = getLevelConfig(level)
    this.state = this.createInitialState(level)
  }

  private createInitialState(level: number): MazeState {
    const config = getLevelConfig(level)
    this.levelConfig = config

    // Find start position
    for (let i = 0; i < GRID_ROWS; i++) {
      for (let j = 0; j < GRID_COLS; j++) {
        if (config.map[i][j] === PathType.START) {
          this.startPosition = { x: j * SQUARE_SIZE, y: i * SQUARE_SIZE }
        } else if (config.map[i][j] === PathType.FINISH) {
          this.finishPosition = { x: j * SQUARE_SIZE, y: i * SQUARE_SIZE }
        }
      }
    }

    const sx = this.getDirectionSx(config.initialDirection)

    return {
      level,
      role: {
        position: { ...this.startPosition },
        direction: config.initialDirection,
        sx,
        sy: 0,
      },
      result: ResultType.UNSET,
      animationState: AnimationStateType.UNSET,
      collectiblesCollected: 0,
      isRunning: false,
    }
  }

  private getDirectionSx(direction: DirectionType): number {
    switch (direction) {
      case DirectionType.NORTH:
        return 0
      case DirectionType.EAST:
        return SPRITE_WIDTH
      case DirectionType.SOUTH:
        return 2 * SPRITE_WIDTH
      case DirectionType.WEST:
        return 3 * SPRITE_WIDTH
      default:
        return SPRITE_WIDTH
    }
  }

  public async initialize(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    canvas.width = MAZE_WIDTH
    canvas.height = MAZE_HEIGHT

    await this.loadImages()
    this.render()
  }

  private async loadImages(): Promise<void> {
    const imageSources = [
      { key: 'idle', src: `${ASSET_BASE}idle.png` },
      { key: 'frontJump', src: `${ASSET_BASE}front_jump.png` },
      { key: 'backJump', src: `${ASSET_BASE}back_jump.png` },
      { key: 'rightJump', src: `${ASSET_BASE}right_jump.png` },
      { key: 'leftJump', src: `${ASSET_BASE}left_jump.png` },
      { key: 'turn', src: `${ASSET_BASE}turn.png` },
      { key: 'carrot', src: `${ASSET_BASE}carrot.png` },
      { key: 'background', src: `${ASSET_BASE}level${this.state.level}.jpg` },
    ]

    // Load number images
    for (let i = 0; i < 10; i++) {
      imageSources.push({ key: `number${i}`, src: `${ASSET_BASE}number/${i}.png` })
    }

    await Promise.all(
      imageSources.map(
        ({ key, src }) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
              this.images[key] = img
              resolve()
            }
            img.onerror = () => {
              console.warn(`Failed to load image: ${src}`)
              resolve() // Don't reject, just continue
            }
            img.src = src
          })
      )
    )

    this.imagesLoaded = true
  }

  public render(): void {
    if (!this.ctx || !this.imagesLoaded) return

    // Clear canvas
    this.ctx.clearRect(0, 0, MAZE_WIDTH, MAZE_HEIGHT)

    // Draw background
    if (this.images.background) {
      this.ctx.drawImage(this.images.background, 0, 0, MAZE_WIDTH, MAZE_HEIGHT)
    }

    // Draw collectibles
    this.drawCollectibles()

    // Draw counter
    this.drawCounter()

    // Draw role
    this.drawRole()
  }

  private drawCollectibles(): void {
    if (!this.ctx || !this.images.carrot) return

    let count = 0
    for (let i = 0; i < GRID_ROWS; i++) {
      for (let j = 0; j < GRID_COLS; j++) {
        if (this.levelConfig.map[i][j] === PathType.PICK) {
          count++
          if (count > this.state.collectiblesCollected) {
            this.ctx.drawImage(
              this.images.carrot,
              j * SQUARE_SIZE,
              i * SQUARE_SIZE,
              SQUARE_SIZE,
              SQUARE_SIZE
            )
          }
        }
      }
    }
  }

  private drawCounter(): void {
    if (!this.ctx) return

    const numKey = `number${this.state.collectiblesCollected}`
    if (this.images[numKey]) {
      this.ctx.drawImage(this.images[numKey], 385, 16, 11, 21)
    }
  }

  private drawRole(): void {
    if (!this.ctx || !this.images.idle) return

    const { role } = this.state
    let img = this.images.idle

    // Select appropriate image based on animation state
    if (this.state.animationState === AnimationStateType.MOVE_FORWARD) {
      switch (role.direction) {
        case DirectionType.NORTH:
          img = this.images.backJump || img
          break
        case DirectionType.EAST:
          img = this.images.rightJump || img
          break
        case DirectionType.SOUTH:
          img = this.images.frontJump || img
          break
        case DirectionType.WEST:
          img = this.images.leftJump || img
          break
      }
    } else if (
      this.state.animationState === AnimationStateType.TURN_LEFT ||
      this.state.animationState === AnimationStateType.TURN_RIGHT
    ) {
      img = this.images.turn || img
    }

    // Draw sprite
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.drawImage(
      img,
      role.sx,
      role.sy,
      150,
      210,
      role.position.x,
      role.position.y - 70 + SQUARE_SIZE,
      SQUARE_SIZE,
      70
    )
  }

  // Game API methods
  public async moveForward(): Promise<void> {
    if (this.state.result !== ResultType.UNSET) return

    // Check if path is clear
    if (!this.isPathClear(0)) {
      this.state.result = ResultType.CRASH
      this.onComplete?.(this.state.result)
      return
    }

    // Queue animation
    await this.animateMoveForward()
  }

  private async animateMoveForward(): Promise<void> {
    return new Promise<void>((resolve) => {
      const { role } = this.state
      const steps = 8
      const stepSize = SQUARE_SIZE / steps
      let currentStep = 0

      this.state.animationState = AnimationStateType.MOVE_FORWARD
      role.sx = 0

      const animate = () => {
        if (currentStep >= steps) {
          this.state.animationState = AnimationStateType.UNSET
          role.sx = this.getDirectionSx(role.direction)
          this.render()
          resolve()
          return
        }

        // Update position based on direction
        switch (role.direction) {
          case DirectionType.NORTH:
            role.position.y -= stepSize
            break
          case DirectionType.EAST:
            role.position.x += stepSize
            break
          case DirectionType.SOUTH:
            role.position.y += stepSize
            break
          case DirectionType.WEST:
            role.position.x -= stepSize
            break
        }

        role.sx = (currentStep % 8) * SPRITE_WIDTH
        currentStep++
        this.render()

        this.animationFrameId = requestAnimationFrame(animate)
      }

      animate()
    })
  }

  public async turnLeft(): Promise<void> {
    if (this.state.result !== ResultType.UNSET) return
    await this.animateTurn(-1)
    this.state.role.direction = ((this.state.role.direction + 3) % 4) as DirectionType
  }

  public async turnRight(): Promise<void> {
    if (this.state.result !== ResultType.UNSET) return
    await this.animateTurn(1)
    this.state.role.direction = ((this.state.role.direction + 1) % 4) as DirectionType
  }

  private async animateTurn(direction: 1 | -1): Promise<void> {
    return new Promise<void>((resolve) => {
      const { role } = this.state
      const steps = 3
      let currentStep = 0

      this.state.animationState =
        direction === 1 ? AnimationStateType.TURN_RIGHT : AnimationStateType.TURN_LEFT

      // Set initial sprite position for turn animation
      switch (role.direction) {
        case DirectionType.NORTH:
          role.sx = 4 * SPRITE_WIDTH
          break
        case DirectionType.EAST:
          role.sx = 2 * SPRITE_WIDTH
          break
        case DirectionType.SOUTH:
          role.sx = direction === 1 ? 8 * SPRITE_WIDTH : 0
          break
        case DirectionType.WEST:
          role.sx = 6 * SPRITE_WIDTH
          break
      }

      const animate = () => {
        if (currentStep >= steps) {
          this.state.animationState = AnimationStateType.UNSET
          const newDirection = ((role.direction + (direction === 1 ? 1 : 3)) % 4) as DirectionType
          role.sx = this.getDirectionSx(newDirection)
          this.render()
          resolve()
          return
        }

        role.sx += direction === 1 ? -SPRITE_WIDTH : SPRITE_WIDTH
        currentStep++
        this.render()

        setTimeout(() => {
          this.animationFrameId = requestAnimationFrame(animate)
        }, 100)
      }

      animate()
    })
  }

  public async collect(): Promise<void> {
    if (this.state.result !== ResultType.UNSET) return

    const { position } = this.state.role
    const i = Math.floor(position.y / SQUARE_SIZE)
    const j = Math.floor(position.x / SQUARE_SIZE)

    if (this.levelConfig.map[i][j] === PathType.PICK) {
      this.state.collectiblesCollected++
      this.render()
    }
  }

  public isPathForward(): boolean {
    return this.isPathClear(0)
  }

  public isPathLeft(): boolean {
    return this.isPathClear(3)
  }

  public isPathRight(): boolean {
    return this.isPathClear(1)
  }

  public isPathBackward(): boolean {
    return this.isPathClear(2)
  }

  private isPathClear(relativeDirection: number): boolean {
    const { role } = this.state
    const effectiveDirection = (role.direction + relativeDirection) % 4

    let checkX = role.position.x
    let checkY = role.position.y

    switch (effectiveDirection) {
      case DirectionType.NORTH:
        checkY -= SQUARE_SIZE
        break
      case DirectionType.EAST:
        checkX += SQUARE_SIZE
        break
      case DirectionType.SOUTH:
        checkY += SQUARE_SIZE
        break
      case DirectionType.WEST:
        checkX -= SQUARE_SIZE
        break
    }

    const i = Math.floor(checkY / SQUARE_SIZE)
    const j = Math.floor(checkX / SQUARE_SIZE)

    if (i < 0 || i >= GRID_ROWS || j < 0 || j >= GRID_COLS) {
      return false
    }

    return this.levelConfig.map[i][j] !== PathType.WALL
  }

  public checkResult(): void {
    if (this.state.result !== ResultType.UNSET) return

    const { position } = this.state.role
    const i = Math.floor(position.y / SQUARE_SIZE)
    const j = Math.floor(position.x / SQUARE_SIZE)

    if (
      this.levelConfig.map[i][j] === PathType.FINISH &&
      this.state.collectiblesCollected === this.levelConfig.collectiblesCount
    ) {
      this.state.result = ResultType.SUCCESS
    } else {
      this.state.result = ResultType.FAILURE
    }

    this.onComplete?.(this.state.result)
  }

  public reset(): void {
    this.stopAnimation()
    this.state = this.createInitialState(this.state.level)
    this.animationQueue = []
    this.isAnimating = false
    this.render()
    this.onStateChange?.(this.state)
  }

  public setLevel(level: number): void {
    this.state = this.createInitialState(level)
    this.loadImages().then(() => {
      this.render()
      this.onStateChange?.(this.state)
    })
  }

  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  public getState(): MazeState {
    return { ...this.state }
  }

  public getLevelConfig(): LevelConfig {
    return this.levelConfig
  }

  public setOnStateChange(callback: (state: MazeState) => void): void {
    this.onStateChange = callback
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
