import { javascriptGenerator, Order } from 'blockly/javascript'
import * as Blockly from 'blockly/core'

/**
 * Arduino C++ Code Generator
 * Generates Arduino-compatible C++ code from Blockly blocks
 */
export const configureArduinoGenerator = () => {
    // Track required includes and global variables
    const includes = new Set<string>()
    const globals = new Set<string>()

    // Helper to add include
    const addInclude = (include: string) => includes.add(include)
    const addGlobal = (global: string) => globals.add(global)

    // =====================
    // SETUP & LOOP
    // =====================

    javascriptGenerator.forBlock['arduino_setup'] = function (block: Blockly.Block) {
        const setupCode = javascriptGenerator.statementToCode(block, 'SETUP_CODE')
        return `void setup() {\n${setupCode}}\n\n`
    }

    javascriptGenerator.forBlock['arduino_loop'] = function (block: Blockly.Block) {
        const loopCode = javascriptGenerator.statementToCode(block, 'LOOP_CODE')
        return `void loop() {\n${loopCode}}\n`
    }

    // =====================
    // DIGITAL I/O
    // =====================

    javascriptGenerator.forBlock['pin_mode'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const mode = block.getFieldValue('MODE')
        return `  pinMode(${pin}, ${mode});\n`
    }

    javascriptGenerator.forBlock['digital_write'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const state = block.getFieldValue('STATE')
        return `  digitalWrite(${pin}, ${state});\n`
    }

    javascriptGenerator.forBlock['digital_read'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        return [`digitalRead(${pin})`, Order.ATOMIC]
    }

    // =====================
    // ANALOG I/O
    // =====================

    javascriptGenerator.forBlock['analog_read'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        return [`analogRead(A${pin})`, Order.ATOMIC]
    }

    javascriptGenerator.forBlock['analog_write'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0'
        return `  analogWrite(${pin}, ${value});\n`
    }

    // =====================
    // TIMING
    // =====================

    javascriptGenerator.forBlock['delay_ms'] = function (block: Blockly.Block) {
        const ms = block.getFieldValue('MS')
        return `  delay(${ms});\n`
    }

    javascriptGenerator.forBlock['millis'] = function () {
        return ['millis()', Order.ATOMIC]
    }

    // =====================
    // SERIAL
    // =====================

    javascriptGenerator.forBlock['serial_begin'] = function (block: Blockly.Block) {
        const baud = block.getFieldValue('BAUD')
        return `  Serial.begin(${baud});\n`
    }

    javascriptGenerator.forBlock['serial_print'] = function (block: Blockly.Block) {
        const text = javascriptGenerator.valueToCode(block, 'TEXT', Order.ATOMIC) || '""'
        return `  Serial.print(${text});\n`
    }

    javascriptGenerator.forBlock['serial_println'] = function (block: Blockly.Block) {
        const text = javascriptGenerator.valueToCode(block, 'TEXT', Order.ATOMIC) || '""'
        return `  Serial.println(${text});\n`
    }

    // =====================
    // LED MODULE
    // =====================

    javascriptGenerator.forBlock['led_set'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const state = block.getFieldValue('STATE')
        return `  digitalWrite(${pin}, ${state});\n`
    }

    javascriptGenerator.forBlock['led_blink'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const delayMs = block.getFieldValue('DELAY')
        return `  digitalWrite(${pin}, HIGH);\n  delay(${delayMs});\n  digitalWrite(${pin}, LOW);\n  delay(${delayMs});\n`
    }

    // =====================
    // SERVO MODULE
    // =====================

    javascriptGenerator.forBlock['servo_attach'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        addInclude('#include <Servo.h>')
        addGlobal(`Servo servo_${pin};`)
        return `  servo_${pin}.attach(${pin});\n`
    }

    javascriptGenerator.forBlock['servo_write'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const angle = block.getFieldValue('ANGLE')
        return `  servo_${pin}.write(${angle});\n`
    }

    // =====================
    // BUZZER MODULE
    // =====================

    javascriptGenerator.forBlock['tone_play'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        const freq = block.getFieldValue('FREQ')
        return `  tone(${pin}, ${freq});\n`
    }

    javascriptGenerator.forBlock['tone_stop'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        return `  noTone(${pin});\n`
    }

    // =====================
    // LCD MODULE
    // =====================

    javascriptGenerator.forBlock['lcd_init'] = function (block: Blockly.Block) {
        const cols = block.getFieldValue('COLS')
        const rows = block.getFieldValue('ROWS')
        addInclude('#include <LiquidCrystal_I2C.h>')
        addGlobal(`LiquidCrystal_I2C lcd(0x27, ${cols}, ${rows});`)
        return `  lcd.init();\n  lcd.backlight();\n`
    }

    javascriptGenerator.forBlock['lcd_print'] = function (block: Blockly.Block) {
        const text = javascriptGenerator.valueToCode(block, 'TEXT', Order.ATOMIC) || '""'
        return `  lcd.print(${text});\n`
    }

    javascriptGenerator.forBlock['lcd_set_cursor'] = function (block: Blockly.Block) {
        const col = block.getFieldValue('COL')
        const row = block.getFieldValue('ROW')
        return `  lcd.setCursor(${col}, ${row});\n`
    }

    javascriptGenerator.forBlock['lcd_clear'] = function () {
        return '  lcd.clear();\n'
    }

    // =====================
    // SENSORS
    // =====================

    javascriptGenerator.forBlock['ultrasonic_distance'] = function (block: Blockly.Block) {
        const trig = block.getFieldValue('TRIG')
        const echo = block.getFieldValue('ECHO')
        // Generate helper function
        addGlobal(`
long readUltrasonic_${trig}_${echo}() {
  digitalWrite(${trig}, LOW);
  delayMicroseconds(2);
  digitalWrite(${trig}, HIGH);
  delayMicroseconds(10);
  digitalWrite(${trig}, LOW);
  return pulseIn(${echo}, HIGH) / 58;
}`)
        return [`readUltrasonic_${trig}_${echo}()`, Order.ATOMIC]
    }

    javascriptGenerator.forBlock['button_pressed'] = function (block: Blockly.Block) {
        const pin = block.getFieldValue('PIN')
        return [`(digitalRead(${pin}) == LOW)`, Order.ATOMIC]
    }

    // =====================
    // TEXT & MATH
    // =====================

    javascriptGenerator.forBlock['text_string'] = function (block: Blockly.Block) {
        const text = block.getFieldValue('TEXT')
        return [`"${text}"`, Order.ATOMIC]
    }

    javascriptGenerator.forBlock['math_number_arduino'] = function (block: Blockly.Block) {
        const num = block.getFieldValue('NUM')
        return [String(num), Order.ATOMIC]
    }

    // =====================
    // VARIABLES
    // =====================

    javascriptGenerator.forBlock['variable_set'] = function (block: Blockly.Block) {
        const varName = block.getFieldValue('VAR')
        const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0'
        addGlobal(`int ${varName};`)
        return `  ${varName} = ${value};\n`
    }

    javascriptGenerator.forBlock['variable_get'] = function (block: Blockly.Block) {
        const varName = block.getFieldValue('VAR')
        return [varName, Order.ATOMIC]
    }

    // =====================
    // CONTROL FLOW
    // =====================

    javascriptGenerator.forBlock['controls_if_arduino'] = function (block: Blockly.Block) {
        const condition = javascriptGenerator.valueToCode(block, 'CONDITION', Order.ATOMIC) || 'false'
        const doCode = javascriptGenerator.statementToCode(block, 'DO')
        return `  if (${condition}) {\n${doCode}  }\n`
    }

    javascriptGenerator.forBlock['controls_repeat_arduino'] = function (block: Blockly.Block) {
        const times = block.getFieldValue('TIMES')
        const doCode = javascriptGenerator.statementToCode(block, 'DO')
        return `  for (int i = 0; i < ${times}; i++) {\n${doCode}  }\n`
    }

    javascriptGenerator.forBlock['controls_forever'] = function (block: Blockly.Block) {
        const doCode = javascriptGenerator.statementToCode(block, 'DO')
        return `  while (true) {\n${doCode}  }\n`
    }

    // =====================
    // COMPARISON & LOGIC
    // =====================

    javascriptGenerator.forBlock['logic_compare_arduino'] = function (block: Blockly.Block) {
        const op = block.getFieldValue('OP')
        const a = javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC) || '0'
        const b = javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC) || '0'
        return [`(${a} ${op} ${b})`, Order.RELATIONAL]
    }

    javascriptGenerator.forBlock['logic_operation_arduino'] = function (block: Blockly.Block) {
        const op = block.getFieldValue('OP')
        const a = javascriptGenerator.valueToCode(block, 'A', Order.ATOMIC) || 'false'
        const b = javascriptGenerator.valueToCode(block, 'B', Order.ATOMIC) || 'false'
        return [`(${a} ${op} ${b})`, Order.LOGICAL_AND]
    }

    javascriptGenerator.forBlock['logic_not_arduino'] = function (block: Blockly.Block) {
        const bool = javascriptGenerator.valueToCode(block, 'BOOL', Order.ATOMIC) || 'false'
        return [`!${bool}`, Order.NONE]
    }

    // Return helper to get full code with includes
    return {
        getIncludes: () => Array.from(includes).join('\n'),
        getGlobals: () => Array.from(globals).join('\n'),
        reset: () => {
            includes.clear()
            globals.clear()
        },
    }
}
