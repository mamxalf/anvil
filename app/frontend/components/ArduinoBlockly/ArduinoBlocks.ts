import * as Blockly from 'blockly/core'

/**
 * Define Arduino-specific Blockly blocks
 */
export const defineArduinoBlocks = () => {
    // =====================
    // SETUP & LOOP
    // =====================

    Blockly.Blocks['arduino_setup'] = {
        init: function () {
            this.appendDummyInput().appendField('⚙️ Setup (runs once)')
            this.appendStatementInput('SETUP_CODE').setCheck(null)
            this.setColour(180)
            this.setTooltip('Code here runs once when Arduino starts')
            this.setDeletable(false)
        },
    }

    Blockly.Blocks['arduino_loop'] = {
        init: function () {
            this.appendDummyInput().appendField('🔄 Loop (runs forever)')
            this.appendStatementInput('LOOP_CODE').setCheck(null)
            this.setColour(180)
            this.setTooltip('Code here runs repeatedly forever')
            this.setDeletable(false)
        },
    }

    // =====================
    // DIGITAL I/O
    // =====================

    Blockly.Blocks['pin_mode'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('set pin')
                .appendField(new Blockly.FieldNumber(13, 0, 53), 'PIN')
                .appendField('as')
                .appendField(
                    new Blockly.FieldDropdown([
                        ['OUTPUT', 'OUTPUT'],
                        ['INPUT', 'INPUT'],
                        ['INPUT_PULLUP', 'INPUT_PULLUP'],
                    ]),
                    'MODE'
                )
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(230)
            this.setTooltip('Set a pin as input or output')
        },
    }

    Blockly.Blocks['digital_write'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('set pin')
                .appendField(new Blockly.FieldNumber(13, 0, 53), 'PIN')
                .appendField('to')
                .appendField(
                    new Blockly.FieldDropdown([
                        ['HIGH', 'HIGH'],
                        ['LOW', 'LOW'],
                    ]),
                    'STATE'
                )
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(230)
            this.setTooltip('Set a digital pin HIGH or LOW')
        },
    }

    Blockly.Blocks['digital_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('read digital pin')
                .appendField(new Blockly.FieldNumber(2, 0, 53), 'PIN')
            this.setOutput(true, 'Boolean')
            this.setColour(230)
            this.setTooltip('Read the state of a digital pin')
        },
    }

    // =====================
    // ANALOG I/O
    // =====================

    Blockly.Blocks['analog_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('read analog pin A')
                .appendField(new Blockly.FieldNumber(0, 0, 15), 'PIN')
            this.setOutput(true, 'Number')
            this.setColour(290)
            this.setTooltip('Read analog value (0-1023)')
        },
    }

    Blockly.Blocks['analog_write'] = {
        init: function () {
            this.appendValueInput('VALUE').setCheck('Number').appendField('set PWM pin')
                .appendField(new Blockly.FieldNumber(9, 0, 53), 'PIN')
                .appendField('to')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(290)
            this.setTooltip('Set PWM value (0-255)')
        },
    }

    // =====================
    // TIMING
    // =====================

    Blockly.Blocks['delay_ms'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('⏱️ wait')
                .appendField(new Blockly.FieldNumber(1000, 0), 'MS')
                .appendField('milliseconds')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(120)
            this.setTooltip('Pause program for specified milliseconds')
        },
    }

    Blockly.Blocks['millis'] = {
        init: function () {
            this.appendDummyInput().appendField('⏱️ time since start (ms)')
            this.setOutput(true, 'Number')
            this.setColour(120)
            this.setTooltip('Returns milliseconds since Arduino started')
        },
    }

    // =====================
    // SERIAL
    // =====================

    Blockly.Blocks['serial_begin'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('📡 Serial begin at')
                .appendField(
                    new Blockly.FieldDropdown([
                        ['9600', '9600'],
                        ['115200', '115200'],
                        ['57600', '57600'],
                        ['38400', '38400'],
                    ]),
                    'BAUD'
                )
                .appendField('baud')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(160)
            this.setTooltip('Start serial communication')
        },
    }

    Blockly.Blocks['serial_print'] = {
        init: function () {
            this.appendValueInput('TEXT').appendField('📡 Serial print')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(160)
            this.setTooltip('Print to serial monitor (no new line)')
        },
    }

    Blockly.Blocks['serial_println'] = {
        init: function () {
            this.appendValueInput('TEXT').appendField('📡 Serial print line')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(160)
            this.setTooltip('Print to serial monitor with new line')
        },
    }

    // =====================
    // LED MODULE
    // =====================

    Blockly.Blocks['led_set'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('💡 LED on pin')
                .appendField(new Blockly.FieldNumber(13, 0, 53), 'PIN')
                .appendField(
                    new Blockly.FieldDropdown([
                        ['ON', 'HIGH'],
                        ['OFF', 'LOW'],
                    ]),
                    'STATE'
                )
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(30)
            this.setTooltip('Turn LED on or off')
        },
    }

    Blockly.Blocks['led_blink'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('💡 Blink LED on pin')
                .appendField(new Blockly.FieldNumber(13, 0, 53), 'PIN')
                .appendField('for')
                .appendField(new Blockly.FieldNumber(500, 0), 'DELAY')
                .appendField('ms')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(30)
            this.setTooltip('Blink LED once (on then off)')
        },
    }

    // =====================
    // SERVO MODULE
    // =====================

    Blockly.Blocks['servo_attach'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('🔧 Attach servo to pin')
                .appendField(new Blockly.FieldNumber(9, 0, 53), 'PIN')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(330)
            this.setTooltip('Attach servo motor to a pin')
        },
    }

    Blockly.Blocks['servo_write'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('🔧 Set servo on pin')
                .appendField(new Blockly.FieldNumber(9, 0, 53), 'PIN')
                .appendField('to')
                .appendField(new Blockly.FieldNumber(90, 0, 180), 'ANGLE')
                .appendField('degrees')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(330)
            this.setTooltip('Set servo angle (0-180 degrees)')
        },
    }

    // =====================
    // BUZZER MODULE
    // =====================

    Blockly.Blocks['tone_play'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('🔊 Play tone on pin')
                .appendField(new Blockly.FieldNumber(8, 0, 53), 'PIN')
                .appendField('frequency')
                .appendField(new Blockly.FieldNumber(1000, 20, 20000), 'FREQ')
                .appendField('Hz')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(60)
            this.setTooltip('Play a tone at specified frequency')
        },
    }

    Blockly.Blocks['tone_stop'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('🔇 Stop tone on pin')
                .appendField(new Blockly.FieldNumber(8, 0, 53), 'PIN')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(60)
            this.setTooltip('Stop playing tone')
        },
    }

    // =====================
    // LCD MODULE (I2C)
    // =====================

    Blockly.Blocks['lcd_init'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('📺 Initialize LCD')
                .appendField(new Blockly.FieldNumber(16, 8, 20), 'COLS')
                .appendField('x')
                .appendField(new Blockly.FieldNumber(2, 1, 4), 'ROWS')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(200)
            this.setTooltip('Initialize LCD display')
        },
    }

    Blockly.Blocks['lcd_print'] = {
        init: function () {
            this.appendValueInput('TEXT').appendField('📺 LCD print')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(200)
            this.setTooltip('Print text to LCD')
        },
    }

    Blockly.Blocks['lcd_set_cursor'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('📺 LCD cursor to col')
                .appendField(new Blockly.FieldNumber(0, 0, 19), 'COL')
                .appendField('row')
                .appendField(new Blockly.FieldNumber(0, 0, 3), 'ROW')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(200)
            this.setTooltip('Set LCD cursor position')
        },
    }

    Blockly.Blocks['lcd_clear'] = {
        init: function () {
            this.appendDummyInput().appendField('📺 LCD clear')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(200)
            this.setTooltip('Clear LCD display')
        },
    }

    // =====================
    // SENSOR MODULES
    // =====================

    Blockly.Blocks['ultrasonic_distance'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('📏 Ultrasonic distance (cm)')
                .appendField('trig:')
                .appendField(new Blockly.FieldNumber(9, 0, 53), 'TRIG')
                .appendField('echo:')
                .appendField(new Blockly.FieldNumber(10, 0, 53), 'ECHO')
            this.setOutput(true, 'Number')
            this.setColour(290)
            this.setTooltip('Read distance from ultrasonic sensor')
        },
    }

    Blockly.Blocks['button_pressed'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('🔘 Button on pin')
                .appendField(new Blockly.FieldNumber(2, 0, 53), 'PIN')
                .appendField('pressed?')
            this.setOutput(true, 'Boolean')
            this.setColour(230)
            this.setTooltip('Check if button is pressed')
        },
    }

    // =====================
    // TEXT & MATH
    // =====================

    Blockly.Blocks['text_string'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('"')
                .appendField(new Blockly.FieldTextInput('Hello'), 'TEXT')
                .appendField('"')
            this.setOutput(true, 'String')
            this.setColour(160)
            this.setTooltip('A text string')
        },
    }

    Blockly.Blocks['math_number_arduino'] = {
        init: function () {
            this.appendDummyInput().appendField(new Blockly.FieldNumber(0), 'NUM')
            this.setOutput(true, 'Number')
            this.setColour(230)
            this.setTooltip('A number')
        },
    }

    // =====================
    // VARIABLES
    // =====================

    Blockly.Blocks['variable_set'] = {
        init: function () {
            this.appendValueInput('VALUE')
                .appendField('set')
                .appendField(new Blockly.FieldTextInput('myVar'), 'VAR')
                .appendField('to')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(330)
            this.setTooltip('Set a variable value')
        },
    }

    Blockly.Blocks['variable_get'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('get')
                .appendField(new Blockly.FieldTextInput('myVar'), 'VAR')
            this.setOutput(true)
            this.setColour(330)
            this.setTooltip('Get a variable value')
        },
    }

    // =====================
    // CONTROL FLOW
    // =====================

    Blockly.Blocks['controls_if_arduino'] = {
        init: function () {
            this.appendValueInput('CONDITION').setCheck('Boolean').appendField('if')
            this.appendStatementInput('DO').appendField('do')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(120)
            this.setTooltip('If condition is true, do something')
        },
    }

    Blockly.Blocks['controls_repeat_arduino'] = {
        init: function () {
            this.appendDummyInput()
                .appendField('repeat')
                .appendField(new Blockly.FieldNumber(10, 1), 'TIMES')
                .appendField('times')
            this.appendStatementInput('DO').appendField('do')
            this.setPreviousStatement(true)
            this.setNextStatement(true)
            this.setColour(120)
            this.setTooltip('Repeat blocks a number of times')
        },
    }

    Blockly.Blocks['controls_forever'] = {
        init: function () {
            this.appendDummyInput().appendField('forever')
            this.appendStatementInput('DO').appendField('do')
            this.setPreviousStatement(true)
            this.setColour(120)
            this.setTooltip('Repeat blocks forever')
        },
    }

    // =====================
    // COMPARISON
    // =====================

    Blockly.Blocks['logic_compare_arduino'] = {
        init: function () {
            this.appendValueInput('A')
            this.appendDummyInput().appendField(
                new Blockly.FieldDropdown([
                    ['=', '=='],
                    ['≠', '!='],
                    ['<', '<'],
                    ['≤', '<='],
                    ['>', '>'],
                    ['≥', '>='],
                ]),
                'OP'
            )
            this.appendValueInput('B')
            this.setInputsInline(true)
            this.setOutput(true, 'Boolean')
            this.setColour(210)
            this.setTooltip('Compare two values')
        },
    }

    Blockly.Blocks['logic_operation_arduino'] = {
        init: function () {
            this.appendValueInput('A').setCheck('Boolean')
            this.appendDummyInput().appendField(
                new Blockly.FieldDropdown([
                    ['and', '&&'],
                    ['or', '||'],
                ]),
                'OP'
            )
            this.appendValueInput('B').setCheck('Boolean')
            this.setInputsInline(true)
            this.setOutput(true, 'Boolean')
            this.setColour(210)
            this.setTooltip('Logical AND/OR')
        },
    }

    Blockly.Blocks['logic_not_arduino'] = {
        init: function () {
            this.appendValueInput('BOOL').setCheck('Boolean').appendField('not')
            this.setOutput(true, 'Boolean')
            this.setColour(210)
            this.setTooltip('Returns the opposite')
        },
    }
}
