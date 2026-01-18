
export interface ArduinoSketch {
    id: string | null
    name: string
    code: string
    board_type?: string
    modules?: ModuleInstance[]
    blocks_xml?: string
    updated_at?: string
    published?: boolean
    published_at?: string
}

export interface BoardConfig {
    name: string
    image: string
    digitalPins: number
    analogPins: number
    pwmPins: number[]
    description: string
}

export interface ModuleConfig {
    name: string
    icon: string
    color: string
    defaultPin: number | string
    category: 'input' | 'output'
    description: string
}

export type BoardType = 'uno' | 'nano' | 'mega' | 'esp32'

export type ModuleType =
    | 'led'
    | 'rgb_led'
    | 'button'
    | 'potentiometer'
    | 'servo'
    | 'buzzer'
    | 'lcd'
    | 'ultrasonic'
    | 'photoresistor'
    | 'dht11'

export interface ModuleInstance {
    id: string
    type: ModuleType
    pin: number | string
    name: string
}

export interface ExampleTemplate {
    id: string
    name: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard' | 'custom'
    icon: string
    board: BoardType
    modules: ModuleInstance[]
    blocksXml: string
    code: string
}
