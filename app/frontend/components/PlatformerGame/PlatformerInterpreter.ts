// Platformer Interpreter - Execute Blockly-generated code

import { PlatformerEngine } from './PlatformerEngine'

const MAX_EXECUTION_STEPS = 1000
const MAX_EXECUTION_TIME = 30000 // 30 seconds

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
            // Combo movement blocks
            jumpright: async () => {
                this.checkExecutionLimits()
                if (this.shouldStop) return
                await this.engine.jumpRight()
                await this.delay(400)
            },
            jumpleft: async () => {
                this.checkExecutionLimits()
                if (this.shouldStop) return
                await this.engine.jumpLeft()
                await this.delay(400)
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

    private async executeCode(
        code: string,
        api: ReturnType<typeof this.createApi>
    ): Promise<void> {
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
                'jumpright',
                'jumpleft',
                'isspikeahead',
                'isgapahead',
                wrappedCode
            )

            await fn(
                api.moveright,
                api.moveleft,
                api.jump,
                api.jumpright,
                api.jumpleft,
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
        asyncCode = asyncCode.replace(/jumpright\(\)/g, 'await jumpright()')
        asyncCode = asyncCode.replace(/jumpleft\(\)/g, 'await jumpleft()')

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
