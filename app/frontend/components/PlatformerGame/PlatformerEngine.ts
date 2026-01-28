// Platformer Engine - Physics and Rendering

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
    GRID_SIZE,
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
        this.platforms = this.levelConfig.platforms.map(([x, y, w, h]) => ({
            x,
            y,
            width: w,
            height: h,
        }))

        // Parse obstacles
        this.obstacles = this.levelConfig.obstacles.map(([x, y, w, h, type]) => ({
            x,
            y,
            width: w,
            height: h,
            type: type as 'spike' | 'lava',
        }))

        // Parse collectibles
        this.collectibles = this.levelConfig.collectibles.map(([x, y, type]) => ({
            x,
            y,
            type: type as 'coin' | 'gem',
            collected: false,
        }))
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

        const { worldWidth } = this.levelConfig
        const displayWidth = Math.min(worldWidth, CANVAS_WIDTH)

        // Clear canvas
        this.ctx.clearRect(0, 0, displayWidth, CANVAS_HEIGHT)

        // Draw background (dungeon sky)
        this.ctx.fillStyle = '#1a1a2e'
        this.ctx.fillRect(0, 0, displayWidth, CANVAS_HEIGHT)

        // Draw grid to help students estimate steps
        this.drawGrid(displayWidth)

        // Draw platforms
        this.ctx.fillStyle = '#78350F' // Brown
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

    private drawGrid(width: number): void {
        if (!this.ctx) return

        const gridSize = 50 // 50px grid cells - roughly one step

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        this.ctx.lineWidth = 1

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            this.ctx.beginPath()
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, CANVAS_HEIGHT)
            this.ctx.stroke()
        }

        // Horizontal lines
        for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(width, y)
            this.ctx.stroke()
        }

        // Draw step markers at bottom
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
        this.ctx.font = '10px Arial'
        for (let x = gridSize; x < width; x += gridSize) {
            this.ctx.fillText(`${x / gridSize}`, x - 3, CANVAS_HEIGHT - 5)
        }
    }

    private drawSpike(x: number, y: number, width: number, height: number): void {
        if (!this.ctx) return
        this.ctx.fillStyle = '#DC2626' // Red
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
        this.ctx.fillStyle = '#10B981' // Green flag
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
        this.ctx.fillStyle = '#FCD34D' // Gold/helmet
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

    // Game API methods for interpreter - Grid-based movement

    public async moveRight(): Promise<void> {
        if (this.result !== ResultType.UNSET) return

        const targetX = this.player.position.x + GRID_SIZE
        this.player.facingRight = true
        await this.animateToPosition(targetX, null)
    }

    public async moveLeft(): Promise<void> {
        if (this.result !== ResultType.UNSET) return

        const targetX = this.player.position.x - GRID_SIZE
        this.player.facingRight = false
        await this.animateToPosition(targetX, null)
    }

    public async jump(): Promise<void> {
        if (this.result !== ResultType.UNSET) return
        if (!this.player.onGround) return // Can only jump when on ground

        this.player.velocity.y = JUMP_POWER
        this.player.onGround = false
        await this.animateJump(null)
    }

    // Combo move: jump + move right (moves ~100px right while jumping)
    public async jumpRight(): Promise<void> {
        if (this.result !== ResultType.UNSET) return
        if (!this.player.onGround) return

        const targetX = this.player.position.x + GRID_SIZE * 2
        this.player.velocity.y = JUMP_POWER
        this.player.facingRight = true
        this.player.onGround = false
        await this.animateJump(targetX)
    }

    // Combo move: jump + move left
    public async jumpLeft(): Promise<void> {
        if (this.result !== ResultType.UNSET) return
        if (!this.player.onGround) return

        const targetX = this.player.position.x - GRID_SIZE * 2
        this.player.velocity.y = JUMP_POWER
        this.player.facingRight = false
        this.player.onGround = false
        await this.animateJump(targetX)
    }

    // Animate horizontal movement to target X (with gravity!)
    private async animateToPosition(targetX: number | null, _targetY: number | null): Promise<void> {
        return new Promise<void>((resolve) => {
            const startX = this.player.position.x
            const deltaX = targetX !== null ? targetX - startX : 0
            const frames = 12
            let currentFrame = 0

            const animate = () => {
                if (this.result !== ResultType.UNSET) {
                    resolve()
                    return
                }

                // Apply gravity continuously (even during horizontal movement)
                if (!this.player.onGround) {
                    this.player.velocity.y += GRAVITY
                    if (this.player.velocity.y > TERMINAL_VELOCITY) {
                        this.player.velocity.y = TERMINAL_VELOCITY
                    }
                    this.player.position.y += this.player.velocity.y
                }

                // Horizontal movement with easing
                if (currentFrame < frames && targetX !== null) {
                    const progress = (currentFrame + 1) / frames
                    const eased = 1 - Math.pow(1 - progress, 2)
                    this.player.position.x = startX + deltaX * eased
                }

                this.checkWorldBounds()
                this.checkCollisions()
                this.render()

                currentFrame++

                // Continue animation if still moving horizontally OR still falling
                if (currentFrame < frames || !this.player.onGround) {
                    this.animationFrameId = requestAnimationFrame(animate)
                } else {
                    // Done: snap to target and resolve
                    if (targetX !== null) {
                        this.player.position.x = targetX
                    }
                    this.player.velocity.x = 0
                    this.player.velocity.y = 0
                    this.render()
                    resolve()
                }
            }

            animate()
        })
    }

    // Animate jump (with optional horizontal movement)
    private async animateJump(targetX: number | null): Promise<void> {
        return new Promise<void>((resolve) => {
            const startX = this.player.position.x
            const deltaX = targetX !== null ? targetX - startX : 0
            let frameCount = 0
            const maxFrames = 30

            const animate = () => {
                if (this.result !== ResultType.UNSET || frameCount >= maxFrames) {
                    this.player.velocity.x = 0
                    this.player.velocity.y = 0
                    resolve()
                    return
                }

                // Horizontal interpolation
                if (targetX !== null) {
                    const progress = Math.min(frameCount / 20, 1)
                    const eased = 1 - Math.pow(1 - progress, 2)
                    this.player.position.x = startX + deltaX * eased
                }

                // Apply gravity for vertical
                this.player.velocity.y += GRAVITY
                if (this.player.velocity.y > TERMINAL_VELOCITY) {
                    this.player.velocity.y = TERMINAL_VELOCITY
                }
                this.player.position.y += this.player.velocity.y

                this.checkWorldBounds()
                this.checkCollisions()
                this.render()

                // Stop when landed
                if (this.player.onGround && frameCount > 5) {
                    if (targetX !== null) {
                        this.player.position.x = targetX
                    }
                    this.player.velocity.x = 0
                    this.player.velocity.y = 0
                    this.render()
                    resolve()
                    return
                }

                frameCount++
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

    public checkCollisions(): void {
        this.player.onGround = false

        // Check platform collisions
        for (const platform of this.platforms) {
            if (this.isColliding(this.player, platform)) {
                // Landing on top
                if (
                    this.player.velocity.y > 0 &&
                    this.player.position.y + this.player.height - this.player.velocity.y <= platform.y
                ) {
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
                this.result = ResultType.FAILURE // Reached goal but not enough collectibles
            }
            this.onComplete?.(this.result)
        }
    }

    private isColliding(a: PlayerState, b: Platform | Obstacle | Goal): boolean {
        const ax = a.position.x
        const ay = a.position.y
        const aw = a.width
        const ah = a.height

        return ax < b.x + b.width && ax + aw > b.x && ay < b.y + b.height && ay + ah > b.y
    }

    private isCollidingWithPoint(x: number, y: number): boolean {
        const p = this.player.position
        const w = this.player.width
        const h = this.player.height

        // Check if point (x, y) is inside player bounding box (with some margin)
        return x >= p.x - 10 && x <= p.x + w + 10 && y >= p.y - 10 && y <= p.y + h + 10
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
                return false // There's a platform below
            }
        }
        return true // No platform below = gap
    }

    public reset(): void {
        this.stopAnimation()
        this.player = this.createInitialState()
        this.result = ResultType.UNSET
        this.collectedCount = 0
        this.collectibles = this.levelConfig.collectibles.map(([x, y, type]) => ({
            x,
            y,
            type: type as 'coin' | 'gem',
            collected: false,
        }))
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

        // Resize canvas if needed
        if (this.canvas) {
            const displayWidth = Math.min(levelConfig.worldWidth, CANVAS_WIDTH)
            this.canvas.width = displayWidth
        }

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
