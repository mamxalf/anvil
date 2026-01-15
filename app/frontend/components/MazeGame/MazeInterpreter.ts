// Code interpreter for executing Blockly-generated JavaScript
import { MazeEngine } from './MazeEngine';

export class MazeInterpreter {
    private engine: MazeEngine;
    private isRunning = false;
    private shouldStop = false;

    constructor(engine: MazeEngine) {
        this.engine = engine;
    }

    public async execute(code: string): Promise<void> {
        if (this.isRunning) return;

        this.isRunning = true;
        this.shouldStop = false;

        try {
            // Create API functions that will be available to the generated code
            const api = this.createApi();

            // Parse and execute the code step by step
            await this.executeCode(code, api);

            // Check result after execution
            if (!this.shouldStop) {
                this.engine.checkResult();
            }
        } catch (error) {
            console.error('Execution error:', error);
        } finally {
            this.isRunning = false;
        }
    }

    private createApi() {
        return {
            moveforward: async () => {
                if (this.shouldStop) return;
                await this.engine.moveForward();
                await this.delay(300);
            },
            turnleft: async () => {
                if (this.shouldStop) return;
                await this.engine.turnLeft();
                await this.delay(300);
            },
            turnright: async () => {
                if (this.shouldStop) return;
                await this.engine.turnRight();
                await this.delay(300);
            },
            collect: async () => {
                if (this.shouldStop) return;
                await this.engine.collect();
                await this.delay(200);
            },
            isPathForward: () => {
                return this.engine.isPathForward();
            },
            isPathLeft: () => {
                return this.engine.isPathLeft();
            },
            isPathRight: () => {
                return this.engine.isPathRight();
            },
            isPathBackward: () => {
                return this.engine.isPathBackward();
            },
        };
    }

    private async executeCode(code: string, api: ReturnType<typeof this.createApi>): Promise<void> {
        // Transform the code to use async/await
        const asyncCode = this.transformToAsync(code);

        // Create an async function wrapper
        const wrappedCode = `
            return (async function() {
                ${asyncCode}
            })();
        `;

        try {
            // Create function with API in scope
            const fn = new Function(
                'moveforward',
                'turnleft',
                'turnright',
                'collect',
                'isPathForward',
                'isPathLeft',
                'isPathRight',
                'isPathBackward',
                wrappedCode
            );

            await fn(
                api.moveforward,
                api.turnleft,
                api.turnright,
                api.collect,
                api.isPathForward,
                api.isPathLeft,
                api.isPathRight,
                api.isPathBackward
            );
        } catch (error) {
            console.error('Code execution error:', error);
            throw error;
        }
    }

    private transformToAsync(code: string): string {
        // Replace function calls with await
        let asyncCode = code;

        // Add await to movement and action functions
        asyncCode = asyncCode.replace(/moveforward\(\)/g, 'await moveforward()');
        asyncCode = asyncCode.replace(/turnleft\(\)/g, 'await turnleft()');
        asyncCode = asyncCode.replace(/turnright\(\)/g, 'await turnright()');
        asyncCode = asyncCode.replace(/collect\(\)/g, 'await collect()');

        // Handle for loops - convert to async-friendly version
        asyncCode = asyncCode.replace(
            /for\s*\(\s*var\s+(\w+)\s*=\s*(\d+)\s*;\s*\1\s*<\s*(\d+)\s*;\s*\1\+\+\s*\)\s*\{/g,
            'for (let $1 = $2; $1 < $3; $1++) {'
        );

        return asyncCode;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public stop(): void {
        this.shouldStop = true;
        this.isRunning = false;
    }

    public isExecuting(): boolean {
        return this.isRunning;
    }
}
