/**
 * @deprecated This file is no longer used. Use MazeInterpreter.ts instead.
 * LessonMaze.tsx now uses MazeInterpreter with MazeEngine for database-driven levels.
 * This file is kept for reference only and will be removed in a future version.
 * 
 * LessonMazeInterpreter - Executes Blockly-generated code using LessonMazeEngine
 */

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
                moveForward: async (): Promise<void> => {
                    if (this.shouldStop) return
                    const moved = await this.engine.moveForward()
                    if (!moved) {
                        this.shouldStop = true
                        throw new Error('Blocked or crashed')
                    }
                    await this.delay(100)
                },
                turnLeft: async (): Promise<void> => {
                    if (this.shouldStop) return
                    await this.engine.turnLeft()
                    await this.delay(50)
                },
                turnRight: async (): Promise<void> => {
                    if (this.shouldStop) return
                    await this.engine.turnRight()
                    await this.delay(50)
                }
            }

            // Execute code
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

    private async executeCode(
        code: string,
        api: { moveForward: () => Promise<void>; turnLeft: () => Promise<void>; turnRight: () => Promise<void> }
    ): Promise<void> {
        // Wrap code in async IIFE
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

export default LessonMazeInterpreter
