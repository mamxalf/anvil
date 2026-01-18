import { ExampleTemplate } from './ArduinoTypes'

export const EXAMPLE_TEMPLATES: ExampleTemplate[] = [
    {
        id: 'blink',
        name: 'Blink LED',
        description: 'Lampu LED berkedip setiap 1 detik',
        difficulty: 'easy',
        icon: '💡',
        board: 'uno',
        modules: [{ id: 'led1', type: 'led', pin: 13, name: 'LED 1' }],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="pin_mode">
        <field name="PIN">13</field>
        <field name="MODE">OUTPUT</field>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="150">
    <statement name="LOOP_CODE">
      <block type="led_blink">
        <field name="PIN">13</field>
        <field name="DELAY">1000</field>
      </block>
    </statement>
  </block>
</xml>`,
        code: `// Blink LED Example
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,
    },
    {
        id: 'traffic_light',
        name: 'Traffic Light',
        description: 'Simulasi lampu lalu lintas dengan 3 LED',
        difficulty: 'easy',
        icon: '🚦',
        board: 'uno',
        modules: [
            { id: 'red', type: 'led', pin: 13, name: 'Red LED' },
            { id: 'yellow', type: 'led', pin: 12, name: 'Yellow LED' },
            { id: 'green', type: 'led', pin: 11, name: 'Green LED' },
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="pin_mode">
        <field name="PIN">13</field>
        <field name="MODE">OUTPUT</field>
        <next>
          <block type="pin_mode">
            <field name="PIN">12</field>
            <field name="MODE">OUTPUT</field>
            <next>
              <block type="pin_mode">
                <field name="PIN">11</field>
                <field name="MODE">OUTPUT</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="200">
    <statement name="LOOP_CODE">
      <block type="led_set">
        <field name="PIN">13</field>
        <field name="STATE">HIGH</field>
        <next>
          <block type="delay_ms">
            <field name="MS">3000</field>
            <next>
              <block type="led_set">
                <field name="PIN">13</field>
                <field name="STATE">LOW</field>
                <next>
                  <block type="led_set">
                    <field name="PIN">12</field>
                    <field name="STATE">HIGH</field>
                    <next>
                      <block type="delay_ms">
                        <field name="MS">1000</field>
                        <next>
                          <block type="led_set">
                            <field name="PIN">12</field>
                            <field name="STATE">LOW</field>
                            <next>
                              <block type="led_set">
                                <field name="PIN">11</field>
                                <field name="STATE">HIGH</field>
                                <next>
                                  <block type="delay_ms">
                                    <field name="MS">3000</field>
                                    <next>
                                      <block type="led_set">
                                        <field name="PIN">11</field>
                                        <field name="STATE">LOW</field>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
        code: `// Traffic Light Example
void setup() {
  pinMode(13, OUTPUT); // Red
  pinMode(12, OUTPUT); // Yellow
  pinMode(11, OUTPUT); // Green
}

void loop() {
  // Red
  digitalWrite(13, HIGH);
  delay(3000);
  digitalWrite(13, LOW);
  
  // Yellow
  digitalWrite(12, HIGH);
  delay(1000);
  digitalWrite(12, LOW);
  
  // Green
  digitalWrite(11, HIGH);
  delay(3000);
  digitalWrite(11, LOW);
}`,
    },
    {
        id: 'button_led',
        name: 'Button Control LED',
        description: 'Nyalakan LED dengan tombol',
        difficulty: 'easy',
        icon: '🔘',
        board: 'uno',
        modules: [
            { id: 'led1', type: 'led', pin: 13, name: 'LED' },
            { id: 'btn1', type: 'button', pin: 2, name: 'Button' },
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="pin_mode">
        <field name="PIN">13</field>
        <field name="MODE">OUTPUT</field>
        <next>
          <block type="pin_mode">
            <field name="PIN">2</field>
            <field name="MODE">INPUT_PULLUP</field>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="150">
    <statement name="LOOP_CODE">
      <block type="controls_if_arduino">
        <value name="CONDITION">
          <block type="button_pressed">
            <field name="PIN">2</field>
          </block>
        </value>
        <statement name="DO">
          <block type="led_set">
            <field name="PIN">13</field>
            <field name="STATE">HIGH</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`,
        code: `// Button Control LED
void setup() {
  pinMode(13, OUTPUT);
  pinMode(2, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(2) == LOW) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
}`,
    },
    {
        id: 'servo_sweep',
        name: 'Servo Sweep',
        description: 'Motor servo bergerak 0-180 derajat',
        difficulty: 'medium',
        icon: '🔧',
        board: 'uno',
        modules: [{ id: 'servo1', type: 'servo', pin: 9, name: 'Servo' }],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="servo_attach">
        <field name="PIN">9</field>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="120">
    <statement name="LOOP_CODE">
      <block type="servo_write">
        <field name="PIN">9</field>
        <field name="ANGLE">0</field>
        <next>
          <block type="delay_ms">
            <field name="MS">1000</field>
            <next>
              <block type="servo_write">
                <field name="PIN">9</field>
                <field name="ANGLE">90</field>
                <next>
                  <block type="delay_ms">
                    <field name="MS">1000</field>
                    <next>
                      <block type="servo_write">
                        <field name="PIN">9</field>
                        <field name="ANGLE">180</field>
                        <next>
                          <block type="delay_ms">
                            <field name="MS">1000</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
        code: `// Servo Sweep Example
#include <Servo.h>

Servo servo_9;

void setup() {
  servo_9.attach(9);
}

void loop() {
  servo_9.write(0);
  delay(1000);
  servo_9.write(90);
  delay(1000);
  servo_9.write(180);
  delay(1000);
}`,
    },
    {
        id: 'melody',
        name: 'Play Melody',
        description: 'Mainkan melodi dengan buzzer',
        difficulty: 'medium',
        icon: '🎵',
        board: 'uno',
        modules: [{ id: 'buzzer1', type: 'buzzer', pin: 8, name: 'Buzzer' }],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="pin_mode">
        <field name="PIN">8</field>
        <field name="MODE">OUTPUT</field>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="120">
    <statement name="LOOP_CODE">
      <block type="tone_play">
        <field name="PIN">8</field>
        <field name="FREQ">262</field>
        <next>
          <block type="delay_ms">
            <field name="MS">500</field>
            <next>
              <block type="tone_play">
                <field name="PIN">8</field>
                <field name="FREQ">294</field>
                <next>
                  <block type="delay_ms">
                    <field name="MS">500</field>
                    <next>
                      <block type="tone_play">
                        <field name="PIN">8</field>
                        <field name="FREQ">330</field>
                        <next>
                          <block type="delay_ms">
                            <field name="MS">500</field>
                            <next>
                              <block type="tone_stop">
                                <field name="PIN">8</field>
                                <next>
                                  <block type="delay_ms">
                                    <field name="MS">1000</field>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
        code: `// Play Melody Example
void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  tone(8, 262); // C
  delay(500);
  tone(8, 294); // D
  delay(500);
  tone(8, 330); // E
  delay(500);
  noTone(8);
  delay(1000);
}`,
    },
    {
        id: 'distance_sensor',
        name: 'Distance Alarm',
        description: 'Alarm jika objek terlalu dekat',
        difficulty: 'medium',
        icon: '📏',
        board: 'uno',
        modules: [
            { id: 'ultrasonic1', type: 'ultrasonic', pin: 9, name: 'Ultrasonic' },
            { id: 'led1', type: 'led', pin: 13, name: 'Warning LED' },
            { id: 'buzzer1', type: 'buzzer', pin: 8, name: 'Buzzer' },
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="pin_mode">
        <field name="PIN">9</field>
        <field name="MODE">OUTPUT</field>
        <next>
          <block type="pin_mode">
            <field name="PIN">10</field>
            <field name="MODE">INPUT</field>
            <next>
              <block type="pin_mode">
                <field name="PIN">13</field>
                <field name="MODE">OUTPUT</field>
                <next>
                  <block type="pin_mode">
                    <field name="PIN">8</field>
                    <field name="MODE">OUTPUT</field>
                    <next>
                      <block type="serial_begin">
                        <field name="BAUD">9600</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="250">
    <statement name="LOOP_CODE">
      <block type="variable_set">
        <field name="VAR">distance</field>
        <value name="VALUE">
          <block type="ultrasonic_distance">
            <field name="TRIG">9</field>
            <field name="ECHO">10</field>
          </block>
        </value>
        <next>
          <block type="controls_if_arduino">
            <value name="CONDITION">
              <block type="logic_compare_arduino">
                <value name="A">
                  <block type="variable_get">
                    <field name="VAR">distance</field>
                  </block>
                </value>
                <field name="OP">&lt;</field>
                <value name="B">
                  <block type="math_number_arduino">
                    <field name="NUM">20</field>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO">
              <block type="led_set">
                <field name="PIN">13</field>
                <field name="STATE">HIGH</field>
                <next>
                  <block type="tone_play">
                    <field name="PIN">8</field>
                    <field name="FREQ">1000</field>
                  </block>
                </next>
              </block>
            </statement>
            <next>
              <block type="delay_ms">
                <field name="MS">100</field>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
        code: `// Distance Alarm Example
int distance;

long readUltrasonic_9_10() {
  digitalWrite(9, LOW);
  delayMicroseconds(2);
  digitalWrite(9, HIGH);
  delayMicroseconds(10);
  digitalWrite(9, LOW);
  return pulseIn(10, HIGH) / 58;
}

void setup() {
  pinMode(9, OUTPUT);  // Trig
  pinMode(10, INPUT);  // Echo
  pinMode(13, OUTPUT); // LED
  pinMode(8, OUTPUT);  // Buzzer
  Serial.begin(9600);
}

void loop() {
  distance = readUltrasonic_9_10();
  
  if (distance < 20) {
    digitalWrite(13, HIGH);
    tone(8, 1000);
  } else {
    digitalWrite(13, LOW);
    noTone(8);
  }
  
  delay(100);
}`,
    },
    {
        id: 'lcd_hello',
        name: 'LCD Hello World',
        description: 'Tampilkan teks di layar LCD',
        difficulty: 'medium',
        icon: '📺',
        board: 'uno',
        modules: [{ id: 'lcd1', type: 'lcd', pin: 'I2C', name: 'LCD 16x2' }],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
    <statement name="SETUP_CODE">
      <block type="lcd_init">
        <field name="COLS">16</field>
        <field name="ROWS">2</field>
        <next>
          <block type="lcd_print">
            <value name="TEXT">
              <block type="text_string">
                <field name="TEXT">Hello World!</field>
              </block>
            </value>
            <next>
              <block type="lcd_set_cursor">
                <field name="COL">0</field>
                <field name="ROW">1</field>
                <next>
                  <block type="lcd_print">
                    <value name="TEXT">
                      <block type="text_string">
                        <field name="TEXT">Kodilearn</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
  <block type="arduino_loop" x="20" y="300">
  </block>
</xml>`,
        code: `// LCD Hello World Example
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Hello World!");
  lcd.setCursor(0, 1);
  lcd.print("Kodilearn");
}

void loop() {
  // Nothing to do here
}`,
    },
    {
        id: 'empty',
        name: 'Blank Project',
        description: 'Mulai dari awal dengan proyek kosong',
        difficulty: 'custom',
        icon: '📝',
        board: 'uno',
        modules: [],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="arduino_setup" x="20" y="20">
  </block>
  <block type="arduino_loop" x="20" y="120">
  </block>
</xml>`,
        code: `// Arduino Sketch

void setup() {
  // Setup code here
}

void loop() {
  // Loop code here
}`,
    },
]
