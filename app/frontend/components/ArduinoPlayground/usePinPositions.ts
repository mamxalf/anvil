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
/**
 * Calculate the absolute position of a pin in the canvas
 */
export function usePinPositions(
    arduinoPosition: { x: number; y: number; rotation?: number },
    modules: CircuitModule[]
): Map<string, PinPosition> {
    return useMemo(() => {
        const positions = new Map<string, PinPosition>()

        // Helper to rotate point around center - logic inlined below

        // Arduino pins
        // Wokwi Uno size is approx 300x230
        const arduinoWidth = 300
        const arduinoHeight = 230
        const arduinoCX = arduinoWidth / 2
        const arduinoCY = arduinoHeight / 2

        ARDUINO_UNO_PINS.forEach((pin: ArduinoPin) => {
            // Pin coordinates are relative to top-left (0,0)
            // To rotate around center, we treat pin.x/pin.y as point and arduinoCX/CY as center
            // But wait, the rotation transform happens on the component's <g> at center usually?
            // Actually, in SVG rotate(angle, cx, cy) rotates around cx,cy.
            // If we rotate the component around its center (width/2, height/2), the pins move accordingly.

            // Calculate relative to center
            const relX = pin.x - arduinoCX
            const relY = pin.y - arduinoCY

            // Rotate
            const angle = arduinoPosition.rotation || 0
            const rad = (angle * Math.PI) / 180

            const rotX = relX * Math.cos(rad) - relY * Math.sin(rad)
            const rotY = relX * Math.sin(rad) + relY * Math.cos(rad)

            positions.set(`arduino:${pin.id}`, {
                x: arduinoPosition.x + arduinoCX + rotX,
                y: arduinoPosition.y + arduinoCY + rotY,
                componentId: 'arduino',
                pinId: pin.id,
            })
        })

        // Module pins
        modules.forEach(module => {
            const config = MODULE_CONFIGS[module.type]
            if (!config) return

            const width = config.width
            const height = config.height
            const cx = width / 2
            const cy = height / 2
            const angle = module.position.rotation || 0
            const rad = (angle * Math.PI) / 180

            config.pins.forEach((pin: ModulePin) => {
                const relX = pin.x - cx
                const relY = pin.y - cy

                const rotX = relX * Math.cos(rad) - relY * Math.sin(rad)
                const rotY = relX * Math.sin(rad) + relY * Math.cos(rad)

                positions.set(`${module.id}:${pin.id}`, {
                    x: module.position.x + cx + rotX,
                    y: module.position.y + cy + rotY,
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
