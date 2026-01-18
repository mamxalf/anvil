import { useState, useCallback, useRef, useEffect } from 'react'
import { CPU, avrInstruction, AVRIOPort, portDConfig, portBConfig, AVRTimer, timer0Config } from 'avr8js'

// Intel HEX parser - returns Uint16Array for avr8js CPU
function parseHex(hex: string): Uint16Array {
    const program = new Uint16Array(16384).fill(0xffff)
    const lines = hex.split('\n')

    for (const line of lines) {
        if (!line.startsWith(':')) continue

        const byteCount = parseInt(line.slice(1, 3), 16)
        const address = parseInt(line.slice(3, 7), 16)
        const recordType = parseInt(line.slice(7, 9), 16)

        if (recordType === 0) {
            // Data record - combine bytes into 16-bit words (little-endian)
            for (let i = 0; i < byteCount; i += 2) {
                const dataOffset = 9 + i * 2
                const lowByte = parseInt(line.slice(dataOffset, dataOffset + 2), 16)
                const highByte = i + 1 < byteCount
                    ? parseInt(line.slice(dataOffset + 2, dataOffset + 4), 16)
                    : 0xff
                const wordAddress = (address + i) / 2
                if (wordAddress < program.length) {
                    program[wordAddress] = (highByte << 8) | lowByte
                }
            }
        } else if (recordType === 1) {
            // End of file
            break
        }
    }

    return program
}

export interface PinState {
    pin: number
    value: boolean
}

export interface SimulationState {
    isRunning: boolean
    isCompiling: boolean
    error: string | null
    pinStates: Record<number, boolean>
    serialOutput: string[]
}

export interface UseArduinoSimulationReturn {
    state: SimulationState
    compile: (code: string, board?: string) => Promise<boolean>
    run: () => void
    stop: () => void
    reset: () => void
}

export function useArduinoSimulation(): UseArduinoSimulationReturn {
    const [state, setState] = useState<SimulationState>({
        isRunning: false,
        isCompiling: false,
        error: null,
        pinStates: {},
        serialOutput: [],
    })

    const cpuRef = useRef<CPU | null>(null)
    const programRef = useRef<Uint16Array | null>(null)
    const animationRef = useRef<number | null>(null)
    const portBRef = useRef<AVRIOPort | null>(null)
    const portDRef = useRef<AVRIOPort | null>(null)

    // Compile code via backend API
    const compile = useCallback(async (code: string, board = 'uno'): Promise<boolean> => {
        setState(prev => ({ ...prev, isCompiling: true, error: null }))

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

            const response = await fetch('/api/arduino/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken || '',
                },
                body: JSON.stringify({ code, board }),
            })

            const result = await response.json()

            if (result.success && result.hex) {
                programRef.current = parseHex(result.hex)
                setState(prev => ({
                    ...prev,
                    isCompiling: false,
                    error: null,
                    serialOutput: [...prev.serialOutput, '✅ Compilation successful!'],
                }))
                return true
            } else {
                setState(prev => ({
                    ...prev,
                    isCompiling: false,
                    error: result.error || 'Compilation failed',
                    serialOutput: [...prev.serialOutput, `❌ Error: ${result.error}`],
                }))
                return false
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            setState(prev => ({
                ...prev,
                isCompiling: false,
                error: message,
                serialOutput: [...prev.serialOutput, `❌ Error: ${message}`],
            }))
            return false
        }
    }, [])

    // Run the simulation
    const run = useCallback(() => {
        if (!programRef.current) {
            setState(prev => ({
                ...prev,
                error: 'No program loaded. Please compile first.',
                serialOutput: [...prev.serialOutput, '⚠️ No program loaded. Compile first!'],
            }))
            return
        }

        // Initialize CPU
        const program = programRef.current
        const cpu = new CPU(program)
        cpuRef.current = cpu

        // Setup I/O ports
        const portB = new AVRIOPort(cpu, portBConfig)
        const portD = new AVRIOPort(cpu, portDConfig)
        portBRef.current = portB
        portDRef.current = portD

        // Setup timer (we'll track it but not call tick - avr8js handles this via CPU cycles)
        new AVRTimer(cpu, timer0Config)

        // Listen for pin changes on Port B (pins 8-13)
        portB.addListener(() => {
            const newStates: Record<number, boolean> = {}
            for (let i = 0; i < 6; i++) {
                const pin = 8 + i
                newStates[pin] = ((portB.pinState(i) & 1) === 1)
            }
            // Pin 13 is PB5
            newStates[13] = ((portB.pinState(5) & 1) === 1)
            setState(prev => ({
                ...prev,
                pinStates: { ...prev.pinStates, ...newStates },
            }))
        })

        // Listen for pin changes on Port D (pins 0-7)
        portD.addListener(() => {
            const newStates: Record<number, boolean> = {}
            for (let i = 0; i < 8; i++) {
                newStates[i] = ((portD.pinState(i) & 1) === 1)
            }
            setState(prev => ({
                ...prev,
                pinStates: { ...prev.pinStates, ...newStates },
            }))
        })

        setState(prev => ({
            ...prev,
            isRunning: true,
            error: null,
            serialOutput: [...prev.serialOutput, '🚀 Simulation started!'],
        }))

        // Simulation loop
        const cpuCyclesPerFrame = 16000000 / 60 // 16MHz / 60fps
        let lastTime = performance.now()

        const runFrame = () => {
            const now = performance.now()
            const deltaMs = now - lastTime
            lastTime = now

            // Execute CPU cycles
            const cyclesToRun = Math.min((deltaMs / 1000) * 16000000, cpuCyclesPerFrame * 2)
            const targetCycles = cpu.cycles + cyclesToRun

            while (cpu.cycles < targetCycles) {
                avrInstruction(cpu)
                // Timer updates automatically through CPU cycle tracking
            }

            animationRef.current = requestAnimationFrame(runFrame)
        }

        animationRef.current = requestAnimationFrame(runFrame)
    }, [])

    // Stop the simulation
    const stop = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }

        cpuRef.current = null
        portBRef.current = null
        portDRef.current = null

        setState(prev => ({
            ...prev,
            isRunning: false,
            pinStates: {},
            serialOutput: [...prev.serialOutput, '⏹️ Simulation stopped.'],
        }))
    }, [])

    // Reset the simulation
    const reset = useCallback(() => {
        stop()
        setState({
            isRunning: false,
            isCompiling: false,
            error: null,
            pinStates: {},
            serialOutput: [],
        })
        programRef.current = null
    }, [stop])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    return {
        state,
        compile,
        run,
        stop,
        reset,
    }
}
