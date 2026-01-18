/**
 * Arduino Blockly Toolbox Configuration
 * Organized by category with Arduino-specific blocks
 */
export const arduinoToolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: '⚙️ Setup & Loop',
            colour: '180',
            contents: [
                { kind: 'block', type: 'arduino_setup' },
                { kind: 'block', type: 'arduino_loop' },
            ],
        },
        {
            kind: 'category',
            name: '💡 LED',
            colour: '30',
            contents: [
                { kind: 'block', type: 'led_set' },
                { kind: 'block', type: 'led_blink' },
            ],
        },
        {
            kind: 'category',
            name: '📌 Digital I/O',
            colour: '230',
            contents: [
                { kind: 'block', type: 'pin_mode' },
                { kind: 'block', type: 'digital_write' },
                { kind: 'block', type: 'digital_read' },
                { kind: 'block', type: 'button_pressed' },
            ],
        },
        {
            kind: 'category',
            name: '📊 Analog I/O',
            colour: '290',
            contents: [
                { kind: 'block', type: 'analog_read' },
                { kind: 'block', type: 'analog_write' },
            ],
        },
        {
            kind: 'category',
            name: '⏱️ Timing',
            colour: '120',
            contents: [
                { kind: 'block', type: 'delay_ms' },
                { kind: 'block', type: 'millis' },
            ],
        },
        {
            kind: 'category',
            name: '📡 Serial',
            colour: '160',
            contents: [
                { kind: 'block', type: 'serial_begin' },
                { kind: 'block', type: 'serial_print' },
                { kind: 'block', type: 'serial_println' },
                { kind: 'block', type: 'text_string' },
            ],
        },
        {
            kind: 'category',
            name: '🔧 Servo',
            colour: '330',
            contents: [
                { kind: 'block', type: 'servo_attach' },
                { kind: 'block', type: 'servo_write' },
            ],
        },
        {
            kind: 'category',
            name: '🔊 Buzzer',
            colour: '60',
            contents: [
                { kind: 'block', type: 'tone_play' },
                { kind: 'block', type: 'tone_stop' },
            ],
        },
        {
            kind: 'category',
            name: '📺 LCD Display',
            colour: '200',
            contents: [
                { kind: 'block', type: 'lcd_init' },
                { kind: 'block', type: 'lcd_print' },
                { kind: 'block', type: 'lcd_set_cursor' },
                { kind: 'block', type: 'lcd_clear' },
            ],
        },
        {
            kind: 'category',
            name: '📏 Sensors',
            colour: '290',
            contents: [
                { kind: 'block', type: 'ultrasonic_distance' },
                { kind: 'block', type: 'button_pressed' },
            ],
        },
        {
            kind: 'category',
            name: '🔁 Control',
            colour: '120',
            contents: [
                { kind: 'block', type: 'controls_if_arduino' },
                { kind: 'block', type: 'controls_repeat_arduino' },
                { kind: 'block', type: 'controls_forever' },
            ],
        },
        {
            kind: 'category',
            name: '📐 Logic',
            colour: '210',
            contents: [
                { kind: 'block', type: 'logic_compare_arduino' },
                { kind: 'block', type: 'logic_operation_arduino' },
                { kind: 'block', type: 'logic_not_arduino' },
            ],
        },
        {
            kind: 'category',
            name: '📦 Variables',
            colour: '330',
            contents: [
                { kind: 'block', type: 'variable_set' },
                { kind: 'block', type: 'variable_get' },
                { kind: 'block', type: 'math_number_arduino' },
            ],
        },
    ],
}
