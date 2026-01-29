/**
 * Arduino Playground Types
 * Core types for the circuit editor and wiring system
 */

// Pin types for Arduino Uno
export type ArduinoPinType = 'digital' | 'analog' | 'power' | 'ground' | 'pwm'

export interface ArduinoPin {
    id: string          // 'D0', 'D1', ..., 'A0', ..., 'GND', '5V', '3.3V'
    label: string       // Display label
    type: ArduinoPinType
    number?: number     // Pin number for digital/analog
    isPWM?: boolean     // Is PWM capable
    x: number           // X position on board
    y: number           // Y position on board
}

// Module pin definition
export interface ModulePin {
    id: string          // 'anode', 'cathode', 'signal', 'gnd', etc.
    label: string       // Display label
    type: 'input' | 'output' | 'power' | 'ground'
    x: number           // Relative X position on module
    y: number           // Relative Y position on module
}

// Wire connecting two components
export interface Wire {
    id: string
    fromComponent: string   // 'arduino' or module id
    fromPin: string         // Pin id
    toComponent: string
    toPin: string
    color: string           // Wire color
}

// Component position on canvas
export interface ComponentPosition {
    x: number
    y: number
    rotation?: number
}

// Module instance in the circuit
export interface CircuitModule {
    id: string
    type: ModuleType
    position: ComponentPosition
    properties: ModuleProperties
}

// Properties for different module types
export interface ModuleProperties {
    color?: string          // LED color
    value?: number          // Potentiometer value, servo angle
    text?: string           // LCD text
    pressed?: boolean       // Button state
}

// Module types available
export type ModuleType = 'led' | 'button' | 'buzzer' | 'lcd'

// Full circuit state
export interface CircuitState {
    arduino: ComponentPosition
    modules: CircuitModule[]
    wires: Wire[]
    selectedId: string | null
    wiringMode: WiringMode | null
}

// Active wiring mode
export interface WiringMode {
    fromComponent: string
    fromPin: string
    mouseX: number
    mouseY: number
}

// Module configuration for the palette
export interface ModuleConfig {
    type: ModuleType
    name: string
    icon: string
    description: string
    pins: ModulePin[]
    defaultProperties: ModuleProperties
    width: number
    height: number
}

// Arduino Uno pin definitions
export const ARDUINO_UNO_PINS: ArduinoPin[] = [
    // Digital pins (right side, top to bottom)
    { id: 'D0', label: '0', type: 'digital', number: 0, x: 268, y: 32 },
    { id: 'D1', label: '1', type: 'digital', number: 1, x: 268, y: 42 },
    { id: 'D2', label: '2', type: 'digital', number: 2, x: 268, y: 52 },
    { id: 'D3', label: '3~', type: 'pwm', number: 3, isPWM: true, x: 268, y: 62 },
    { id: 'D4', label: '4', type: 'digital', number: 4, x: 268, y: 72 },
    { id: 'D5', label: '5~', type: 'pwm', number: 5, isPWM: true, x: 268, y: 82 },
    { id: 'D6', label: '6~', type: 'pwm', number: 6, isPWM: true, x: 268, y: 92 },
    { id: 'D7', label: '7', type: 'digital', number: 7, x: 268, y: 102 },
    { id: 'D8', label: '8', type: 'digital', number: 8, x: 268, y: 122 },
    { id: 'D9', label: '9~', type: 'pwm', number: 9, isPWM: true, x: 268, y: 132 },
    { id: 'D10', label: '10~', type: 'pwm', number: 10, isPWM: true, x: 268, y: 142 },
    { id: 'D11', label: '11~', type: 'pwm', number: 11, isPWM: true, x: 268, y: 152 },
    { id: 'D12', label: '12', type: 'digital', number: 12, x: 268, y: 162 },
    { id: 'D13', label: '13', type: 'digital', number: 13, x: 268, y: 172 },
    { id: 'GND_D', label: 'GND', type: 'ground', x: 268, y: 182 },
    { id: 'AREF', label: 'AREF', type: 'digital', x: 268, y: 192 },

    // Analog pins (left side, bottom to top)
    { id: 'A0', label: 'A0', type: 'analog', number: 0, x: 10, y: 172 },
    { id: 'A1', label: 'A1', type: 'analog', number: 1, x: 10, y: 162 },
    { id: 'A2', label: 'A2', type: 'analog', number: 2, x: 10, y: 152 },
    { id: 'A3', label: 'A3', type: 'analog', number: 3, x: 10, y: 142 },
    { id: 'A4', label: 'A4', type: 'analog', number: 4, x: 10, y: 132 },
    { id: 'A5', label: 'A5', type: 'analog', number: 5, x: 10, y: 122 },

    // Power pins (left side, top)
    { id: 'VIN', label: 'VIN', type: 'power', x: 10, y: 32 },
    { id: 'GND1', label: 'GND', type: 'ground', x: 10, y: 42 },
    { id: 'GND2', label: 'GND', type: 'ground', x: 10, y: 52 },
    { id: '5V', label: '5V', type: 'power', x: 10, y: 62 },
    { id: '3.3V', label: '3.3V', type: 'power', x: 10, y: 72 },
    { id: 'RESET', label: 'RST', type: 'digital', x: 10, y: 82 },
]

// Module configurations
export const MODULE_CONFIGS: Record<ModuleType, ModuleConfig> = {
    led: {
        type: 'led',
        name: 'LED',
        icon: '💡',
        description: 'Light Emitting Diode',
        pins: [
            { id: 'anode', label: '+', type: 'input', x: 20, y: 5 },
            { id: 'cathode', label: '-', type: 'ground', x: 40, y: 5 },
        ],
        defaultProperties: { color: 'red' },
        width: 60,
        height: 80,
    },
    button: {
        type: 'button',
        name: 'Push Button',
        icon: '🔘',
        description: 'Momentary switch',
        pins: [
            { id: 'terminal1a', label: '1a', type: 'input', x: 5, y: 20 },
            { id: 'terminal1b', label: '1b', type: 'input', x: 5, y: 50 },
            { id: 'terminal2a', label: '2a', type: 'output', x: 55, y: 20 },
            { id: 'terminal2b', label: '2b', type: 'output', x: 55, y: 50 },
        ],
        defaultProperties: { color: 'red', pressed: false },
        width: 60,
        height: 70,
    },
    buzzer: {
        type: 'buzzer',
        name: 'Buzzer',
        icon: '🔊',
        description: 'Piezo speaker',
        pins: [
            { id: 'signal', label: '+', type: 'input', x: 20, y: 5 },
            { id: 'gnd', label: '-', type: 'ground', x: 40, y: 5 },
        ],
        defaultProperties: {},
        width: 60,
        height: 60,
    },
    lcd: {
        type: 'lcd',
        name: 'LCD 16x2',
        icon: '📺',
        description: 'Character display',
        pins: [
            { id: 'gnd', label: 'GND', type: 'ground', x: 10, y: 5 },
            { id: 'vcc', label: 'VCC', type: 'power', x: 30, y: 5 },
            { id: 'sda', label: 'SDA', type: 'input', x: 50, y: 5 },
            { id: 'scl', label: 'SCL', type: 'input', x: 70, y: 5 },
        ],
        defaultProperties: { text: 'Hello World!' },
        width: 180,
        height: 80,
    },
}

// Wire color palette
export const WIRE_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#6b7280', // gray
    '#000000', // black
]

// Get next wire color based on existing wires
export function getNextWireColor(existingWires: Wire[]): string {
    const usedColors = existingWires.map(w => w.color)
    for (const color of WIRE_COLORS) {
        if (!usedColors.includes(color)) return color
    }
    return WIRE_COLORS[existingWires.length % WIRE_COLORS.length]
}

// Starter circuit templates for testing
export const STARTER_CIRCUITS = {
    // Simple LED blink circuit
    ledBlink: {
        arduino: { x: 50, y: 80 },
        modules: [
            {
                id: 'led_1',
                type: 'led' as ModuleType,
                position: { x: 380, y: 120 },
                properties: { color: 'red' }
            }
        ],
        wires: [
            {
                id: 'wire_led_signal',
                fromComponent: 'arduino',
                fromPin: 'D13',
                toComponent: 'led_1',
                toPin: 'anode',
                color: '#ef4444' // red
            },
            {
                id: 'wire_led_gnd',
                fromComponent: 'arduino',
                fromPin: 'GND_D',
                toComponent: 'led_1',
                toPin: 'cathode',
                color: '#000000' // black
            }
        ],
        selectedId: null,
        wiringMode: null
    },

    // LED + Button circuit
    ledWithButton: {
        arduino: { x: 50, y: 80 },
        modules: [
            {
                id: 'led_1',
                type: 'led' as ModuleType,
                position: { x: 400, y: 80 },
                properties: { color: 'green' }
            },
            {
                id: 'button_1',
                type: 'button' as ModuleType,
                position: { x: 400, y: 200 },
                properties: { color: 'red', pressed: false }
            }
        ],
        wires: [
            // LED wires
            {
                id: 'wire_led_signal',
                fromComponent: 'arduino',
                fromPin: 'D13',
                toComponent: 'led_1',
                toPin: 'anode',
                color: '#22c55e' // green
            },
            {
                id: 'wire_led_gnd',
                fromComponent: 'arduino',
                fromPin: 'GND_D',
                toComponent: 'led_1',
                toPin: 'cathode',
                color: '#000000' // black
            },
            // Button wires
            {
                id: 'wire_btn_signal',
                fromComponent: 'arduino',
                fromPin: 'D2',
                toComponent: 'button_1',
                toPin: 'terminal1a',
                color: '#3b82f6' // blue
            },
            {
                id: 'wire_btn_gnd',
                fromComponent: 'arduino',
                fromPin: 'GND1',
                toComponent: 'button_1',
                toPin: 'terminal1b',
                color: '#6b7280' // gray
            }
        ],
        selectedId: null,
        wiringMode: null
    },

    // Buzzer circuit
    buzzerCircuit: {
        arduino: { x: 50, y: 80 },
        modules: [
            {
                id: 'buzzer_1',
                type: 'buzzer' as ModuleType,
                position: { x: 400, y: 120 },
                properties: {}
            }
        ],
        wires: [
            {
                id: 'wire_buzz_signal',
                fromComponent: 'arduino',
                fromPin: 'D8',
                toComponent: 'buzzer_1',
                toPin: 'signal',
                color: '#f97316' // orange
            },
            {
                id: 'wire_buzz_gnd',
                fromComponent: 'arduino',
                fromPin: 'GND1',
                toComponent: 'buzzer_1',
                toPin: 'gnd',
                color: '#000000' // black
            }
        ],
        selectedId: null,
        wiringMode: null
    },

    // LCD display circuit  
    lcdCircuit: {
        arduino: { x: 50, y: 100 },
        modules: [
            {
                id: 'lcd_1',
                type: 'lcd' as ModuleType,
                position: { x: 380, y: 100 },
                properties: { text: 'Hello World!    KodiLearn :)' }
            }
        ],
        wires: [
            {
                id: 'wire_lcd_gnd',
                fromComponent: 'arduino',
                fromPin: 'GND1',
                toComponent: 'lcd_1',
                toPin: 'gnd',
                color: '#000000' // black
            },
            {
                id: 'wire_lcd_vcc',
                fromComponent: 'arduino',
                fromPin: '5V',
                toComponent: 'lcd_1',
                toPin: 'vcc',
                color: '#ef4444' // red
            },
            {
                id: 'wire_lcd_sda',
                fromComponent: 'arduino',
                fromPin: 'A4',
                toComponent: 'lcd_1',
                toPin: 'sda',
                color: '#3b82f6' // blue
            },
            {
                id: 'wire_lcd_scl',
                fromComponent: 'arduino',
                fromPin: 'A5',
                toComponent: 'lcd_1',
                toPin: 'scl',
                color: '#22c55e' // green
            }
        ],
        selectedId: null,
        wiringMode: null
    }
} as const

