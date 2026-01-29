import { useMemo } from 'react'
import { ARDUINO_UNO_PINS, ArduinoPin, MODULE_CONFIGS, CircuitModule, ModulePin } from './types'

interface PinPosition {
    x: number
    y: number
    componentId: string
    pinId: string
}

/**
 * Calculate the absolute position of a pin in the canvas
 */
export function usePinPositions(
    arduinoPosition: { x: number; y: number },
    modules: CircuitModule[]
): Map<string, PinPosition> {
    return useMemo(() => {
        const positions = new Map<string, PinPosition>()

        // Arduino pins
        ARDUINO_UNO_PINS.forEach((pin: ArduinoPin) => {
            positions.set(`arduino:${pin.id}`, {
                x: arduinoPosition.x + pin.x,
                y: arduinoPosition.y + pin.y,
                componentId: 'arduino',
                pinId: pin.id,
            })
        })

        // Module pins
        modules.forEach(module => {
            const config = MODULE_CONFIGS[module.type]
            config.pins.forEach((pin: ModulePin) => {
                positions.set(`${module.id}:${pin.id}`, {
                    x: module.position.x + pin.x,
                    y: module.position.y + pin.y,
                    componentId: module.id,
                    pinId: pin.id,
                })
            })
        })

        return positions
    }, [arduinoPosition, modules])
}

/**
 * Get the position of a specific pin
 */
export function getPinPosition(
    positions: Map<string, PinPosition>,
    componentId: string,
    pinId: string
): PinPosition | undefined {
    return positions.get(`${componentId}:${pinId}`)
}

/**
 * Find the nearest pin to a position within a threshold
 */
export function findNearestPin(
    positions: Map<string, PinPosition>,
    x: number,
    y: number,
    threshold: number = 15
): PinPosition | null {
    let nearest: PinPosition | null = null
    let minDistance = threshold

    positions.forEach(pos => {
        const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2)
        if (distance < minDistance) {
            minDistance = distance
            nearest = pos
        }
    })

    return nearest
}
