type Command = 'MOVE_FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';

export class SimulationEngine {
    private commands: Command[] = [];

    // Reset the engine state
    reset() {
        this.commands = [];
    }

    // These methods will be called by the generated code
    moveForward() {
        this.commands.push('MOVE_FORWARD');
    }

    turnLeft() {
        this.commands.push('TURN_LEFT');
    }

    turnRight() {
        this.commands.push('TURN_RIGHT');
    }

    // Parse the code string and extract commands
    parse(code: string): Command[] {
        this.reset();

        // Create a safe execution context
        // We use a Function constructor here to execute the generated string
        // In a real app, we might want a safer sandboxing approach, 
        // but for these specific commands it's relatively contained.

        const context = {
            moveForward: this.moveForward.bind(this),
            turnLeft: this.turnLeft.bind(this),
            turnRight: this.turnRight.bind(this)
        };

        try {
            // Function extraction to execute code with our custom context
            const runCode = new Function('moveForward', 'turnLeft', 'turnRight', code);
            runCode(context.moveForward, context.turnLeft, context.turnRight);
        } catch (e) {
            console.error("Error executing blockly code:", e);
        }

        return [...this.commands];
    }
}
