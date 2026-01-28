/**
 * @deprecated This file is no longer used. Use MazeEngine.ts instead.
 * LessonMaze.tsx now uses MazeEngine with config object for database-driven levels.
 * This file is kept for reference only and will be removed in a future version.
 * 
 * LessonMazeEngine - Custom maze engine that reads configuration from database (activity_config)
 * Unlike MazeEngine.ts, this doesn't use hardcoded levels - all config comes from lesson data
 */

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
    character: string
    goalItem: string
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
    private padding: number = 10

    // Images
    private characterImage: HTMLImageElement | null = null
    private goalImage: HTMLImageElement | null = null
    private obstacleImage: HTMLImageElement | null = null
    private imagesLoaded: boolean = false

    // Callbacks
    private onComplete?: (success: boolean) => void

    constructor() {
        // Images loaded on initialize
    }

    private async loadImages(): Promise<void> {
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve(img)
                img.onerror = () => {
                    console.warn(`Failed to load image: ${src}`)
                    resolve(img) // Resolve anyway, we'll use fallback
                }
                img.src = src
            })
        }

        // Load character sprite based on config
        const characterSrc = this.config?.character === 'astronaut'
            ? '/images/maze/astronaut.png'
            : '/images/maze/idle.png'

        const goalSrc = this.config?.goalItem === 'star'
            ? '/images/maze/star.png'
            : '/images/maze/carrot.png'

        try {
            this.characterImage = await loadImage(characterSrc)
            this.goalImage = await loadImage(goalSrc)
            this.obstacleImage = await loadImage('/images/maze/obstacle.png')
        } catch {
            // Will use fallback drawing
        }

        this.imagesLoaded = true
    }

    public async initialize(canvas: HTMLCanvasElement, config: MazeLevelConfig): Promise<void> {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        if (!this.ctx) {
            throw new Error('Could not get canvas context')
        }

        // Parse config from database
        this.config = {
            gridWidth: config.grid_size[0],
            gridHeight: config.grid_size[1],
            startPos: { x: config.start_pos[0], y: config.start_pos[1] },
            goalPos: { x: config.goal_pos[0], y: config.goal_pos[1] },
            obstacles: config.obstacles.map(([x, y]) => ({ x, y })),
            character: config.character || 'rabbit',
            goalItem: config.goal_item || 'carrot'
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

        // Load images and render
        await this.loadImages()
        this.render()
    }

    private render(): void {
        if (!this.canvas || !this.ctx || !this.config) return

        const { ctx, canvas } = this
        const { gridWidth, gridHeight, obstacles, goalPos } = this.config

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background
        ctx.fillStyle = '#f0fdf4' // Light green
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw grid
        this.drawGrid()

        // Draw obstacles
        obstacles.forEach(pos => {
            const canvasPos = this.gridToCanvas(pos.x, pos.y)
            this.drawObstacle(canvasPos.x, canvasPos.y)
        })

        // Draw goal
        const goalCanvasPos = this.gridToCanvas(goalPos.x, goalPos.y)
        this.drawGoal(goalCanvasPos.x, goalCanvasPos.y)

        // Draw character
        const charCanvasPos = this.gridToCanvas(this.characterPos.x, this.characterPos.y)
        this.drawCharacter(charCanvasPos.x, charCanvasPos.y)
    }

    private drawGrid(): void {
        if (!this.ctx || !this.config) return

        const { ctx } = this
        const { gridWidth, gridHeight } = this.config

        // Draw cells with alternating colors
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const pos = this.gridToCanvas(x, y)
                const isPathCell = (x + y) % 2 === 0
                ctx.fillStyle = isPathCell ? '#dcfce7' : '#bbf7d0'
                ctx.fillRect(pos.x, pos.y, this.cellSize, this.cellSize)
            }
        }

        // Draw grid lines
        ctx.strokeStyle = '#86efac'
        ctx.lineWidth = 1

        for (let x = 0; x <= gridWidth; x++) {
            const startX = this.padding + (x * this.cellSize)
            ctx.beginPath()
            ctx.moveTo(startX, this.padding)
            ctx.lineTo(startX, this.padding + (gridHeight * this.cellSize))
            ctx.stroke()
        }

        for (let y = 0; y <= gridHeight; y++) {
            const startY = this.padding + (y * this.cellSize)
            ctx.beginPath()
            ctx.moveTo(this.padding, startY)
            ctx.lineTo(this.padding + (gridWidth * this.cellSize), startY)
            ctx.stroke()
        }
    }

    private drawObstacle(canvasX: number, canvasY: number): void {
        if (!this.ctx) return

        const { ctx } = this
        const size = this.cellSize - 4
        const offset = 2

        if (this.obstacleImage && this.obstacleImage.complete && this.obstacleImage.naturalWidth > 0) {
            ctx.drawImage(this.obstacleImage, canvasX + offset, canvasY + offset, size, size)
        } else {
            // Fallback: draw red block
            ctx.fillStyle = '#ef4444'
            ctx.fillRect(canvasX + offset, canvasY + offset, size, size)
            ctx.strokeStyle = '#b91c1c'
            ctx.lineWidth = 2
            ctx.strokeRect(canvasX + offset, canvasY + offset, size, size)

            // Draw X
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.moveTo(canvasX + offset + 8, canvasY + offset + 8)
            ctx.lineTo(canvasX + size - 4, canvasY + size - 4)
            ctx.moveTo(canvasX + size - 4, canvasY + offset + 8)
            ctx.lineTo(canvasX + offset + 8, canvasY + size - 4)
            ctx.stroke()
        }
    }

    private drawGoal(canvasX: number, canvasY: number): void {
        if (!this.ctx) return

        const { ctx } = this
        const size = this.cellSize * 0.7
        const offset = (this.cellSize - size) / 2

        // Draw goal cell background
        ctx.fillStyle = '#fef3c7'
        ctx.fillRect(canvasX, canvasY, this.cellSize, this.cellSize)
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.strokeRect(canvasX + 2, canvasY + 2, this.cellSize - 4, this.cellSize - 4)

        if (this.goalImage && this.goalImage.complete && this.goalImage.naturalWidth > 0) {
            ctx.drawImage(this.goalImage, canvasX + offset, canvasY + offset, size, size)
        } else {
            // Fallback: draw emoji
            ctx.font = `${size * 0.8}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('🥕', canvasX + this.cellSize / 2, canvasY + this.cellSize / 2)
        }
    }

    private drawCharacter(canvasX: number, canvasY: number): void {
        if (!this.ctx) return

        const { ctx } = this
        const size = this.cellSize * 0.8
        const offset = (this.cellSize - size) / 2

        if (this.characterImage && this.characterImage.complete && this.characterImage.naturalWidth > 0) {
            // Draw character with rotation based on direction
            ctx.save()
            const centerX = canvasX + this.cellSize / 2
            const centerY = canvasY + this.cellSize / 2
            ctx.translate(centerX, centerY)
            ctx.rotate(this.getDirectionAngle())
            ctx.drawImage(this.characterImage, -size / 2, -size / 2, size, size)
            ctx.restore()
        } else {
            // Fallback: draw colored circle with direction indicator
            const centerX = canvasX + (this.cellSize / 2)
            const centerY = canvasY + (this.cellSize / 2)

            ctx.fillStyle = '#f59e0b'
            ctx.beginPath()
            ctx.arc(centerX, centerY, this.cellSize * 0.35, 0, Math.PI * 2)
            ctx.fill()

            // Direction indicator (arrow)
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 3
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            const indicatorLength = this.cellSize * 0.2
            const angle = this.getDirectionAngle()
            ctx.lineTo(
                centerX + Math.cos(angle - Math.PI / 2) * indicatorLength,
                centerY + Math.sin(angle - Math.PI / 2) * indicatorLength
            )
            ctx.stroke()

            // Draw bunny emoji on top
            ctx.font = `${size * 0.5}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('🐰', centerX, centerY)
        }
    }

    private getDirectionAngle(): number {
        switch (this.characterDirection) {
            case 'up': return 0
            case 'right': return Math.PI / 2
            case 'down': return Math.PI
            case 'left': return -Math.PI / 2
            default: return Math.PI / 2
        }
    }

    private gridToCanvas(gridX: number, gridY: number): { x: number, y: number } {
        return {
            x: this.padding + (gridX * this.cellSize),
            y: this.padding + (gridY * this.cellSize)
        }
    }

    public reset(): void {
        if (!this.config) return

        this.characterPos = { ...this.config.startPos }
        this.characterDirection = 'right'
        this.moveCount = 0
        this.isAnimating = false
        this.render()
    }

    // Movement API
    public async moveForward(): Promise<boolean> {
        if (!this.config || this.isAnimating) return false

        const { gridWidth, gridHeight, obstacles } = this.config

        // Calculate new position based on direction
        const newPos = { ...this.characterPos }

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
        const directions: Direction[] = ['up', 'right', 'down', 'left']
        const currentIndex = directions.indexOf(this.characterDirection)
        this.characterDirection = directions[(currentIndex + 3) % 4]

        await this.delay(150)
        this.isAnimating = false
        this.render()
    }

    public async turnRight(): Promise<void> {
        if (this.isAnimating) return

        this.isAnimating = true
        const directions: Direction[] = ['up', 'right', 'down', 'left']
        const currentIndex = directions.indexOf(this.characterDirection)
        this.characterDirection = directions[(currentIndex + 1) % 4]

        await this.delay(150)
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

                // Easing function (ease out cubic)
                const eased = 1 - Math.pow(1 - progress, 3)

                // Interpolate position
                const currentX = fromCanvas.x + (toCanvas.x - fromCanvas.x) * eased
                const currentY = fromCanvas.y + (toCanvas.y - fromCanvas.y) * eased

                // Re-render base and draw character at interpolated position
                this.render()
                // Override with animation position
                if (this.ctx) {
                    // Clear character from grid position
                    const charGridPos = this.gridToCanvas(this.characterPos.x, this.characterPos.y)
                    const isPathCell = (this.characterPos.x + this.characterPos.y) % 2 === 0
                    this.ctx.fillStyle = isPathCell ? '#dcfce7' : '#bbf7d0'
                    this.ctx.fillRect(charGridPos.x, charGridPos.y, this.cellSize, this.cellSize)

                    // Draw character at animated position
                    this.drawCharacter(currentX, currentY)
                }

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    resolve()
                }
            }

            requestAnimationFrame(animate)
        })
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Result checking
    public checkResult(): 'success' | 'failure' | 'inprogress' {
        if (!this.config) return 'inprogress'

        const { goalPos } = this.config

        // Check if character reached goal
        if (this.characterPos.x === goalPos.x && this.characterPos.y === goalPos.y) {
            return 'success'
        }

        return 'inprogress'
    }

    public getMoveCount(): number {
        return this.moveCount
    }

    public getCharacterPosition(): Position {
        return { ...this.characterPos }
    }

    public setOnComplete(callback: (success: boolean) => void): void {
        this.onComplete = callback
    }

    public destroy(): void {
        this.canvas = null
        this.ctx = null
        this.config = null
    }
}

export default LessonMazeEngine
