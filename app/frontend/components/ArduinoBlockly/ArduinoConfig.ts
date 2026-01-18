import { BoardConfig, ModuleConfig } from './ArduinoTypes'


// Re-export types and examples for backward compatibility
export * from './ArduinoTypes'
export * from './ArduinoExamples'

/**
 * Arduino Board Configurations
 */
export const ARDUINO_BOARDS: Record<string, BoardConfig> = {
  uno: {
    name: 'Arduino Uno',
    image: '🔵',
    digitalPins: 14,
    analogPins: 6,
    pwmPins: [3, 5, 6, 9, 10, 11],
    description: 'Most popular board for beginners',
  },
  nano: {
    name: 'Arduino Nano',
    image: '🟢',
    digitalPins: 14,
    analogPins: 8,
    pwmPins: [3, 5, 6, 9, 10, 11],
    description: 'Compact version of Uno',
  },
  mega: {
    name: 'Arduino Mega',
    image: '🟣',
    digitalPins: 54,
    analogPins: 16,
    pwmPins: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 44, 45, 46],
    description: 'More pins for complex projects',
  },
  esp32: {
    name: 'ESP32',
    image: '🟠',
    digitalPins: 34,
    analogPins: 18,
    pwmPins: [0, 2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27],
    description: 'WiFi & Bluetooth enabled',
  },
}

/**
 * Available Modules
 */
export const ARDUINO_MODULES: Record<string, ModuleConfig> = {
  led: {
    name: 'LED',
    icon: '💡',
    color: '#EAB308',
    defaultPin: 13,
    category: 'output',
    description: 'Light Emitting Diode',
  },
  rgb_led: {
    name: 'RGB LED',
    icon: '🌈',
    color: '#EC4899',
    defaultPin: 9,
    category: 'output',
    description: 'Multi-color LED',
  },
  button: {
    name: 'Push Button',
    icon: '🔘',
    color: '#6B7280',
    defaultPin: 2,
    category: 'input',
    description: 'Momentary switch',
  },
  potentiometer: {
    name: 'Potentiometer',
    icon: '🎚️',
    color: '#3B82F6',
    defaultPin: 0, // A0
    category: 'input',
    description: 'Analog rotary dial',
  },
  servo: {
    name: 'Servo Motor',
    icon: '🔧',
    color: '#8B5CF6',
    defaultPin: 9,
    category: 'output',
    description: '0-180 degree motor',
  },
  buzzer: {
    name: 'Buzzer',
    icon: '🔊',
    color: '#F59E0B',
    defaultPin: 8,
    category: 'output',
    description: 'Piezo speaker',
  },
  lcd: {
    name: 'LCD 16x2',
    icon: '📺',
    color: '#10B981',
    defaultPin: 'I2C',
    category: 'output',
    description: 'Character display',
  },
  ultrasonic: {
    name: 'Ultrasonic Sensor',
    icon: '📏',
    color: '#06B6D4',
    defaultPin: 9,
    category: 'input',
    description: 'Distance measurement',
  },
  photoresistor: {
    name: 'Light Sensor',
    icon: '☀️',
    color: '#FBBF24',
    defaultPin: 0, // A0
    category: 'input',
    description: 'Light intensity sensor',
  },
  dht11: {
    name: 'DHT11 Sensor',
    icon: '🌡️',
    color: '#22C55E',
    defaultPin: 7,
    category: 'input',
    description: 'Temperature & humidity',
  },
}
