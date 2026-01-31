import { CircuitState, ModuleType } from "../types";
import { DiagramPart } from "../Canvas/diagram";

export const TYPE_MAP: Record<string, string> = {
    led: 'wokwi-led',
    button: 'wokwi-pushbutton',
    buzzer: 'wokwi-buzzer',
    lcd: 'wokwi-lcd1602',
    servo: 'wokwi-servo',
    ultrasonic: 'wokwi-hc-sr04',
    potentiometer: 'wokwi-potentiometer',
    photoresistor: 'wokwi-photoresistor',
    dht11: 'wokwi-dht22',
    rgb_led: 'wokwi-neopixel',
};

export const REVERSE_TYPE_MAP: Record<string, string> = Object.entries(TYPE_MAP).reduce(
    (acc, [key, value]) => ({ ...acc, [value]: key }),
    {}
);

export function getPartType(moduleType: string): string {
    return TYPE_MAP[moduleType] || `wokwi-${moduleType}`;
}

export function getModuleType(partType: string): ModuleType {
    // Remove wokwi- prefix if strictly needed, or use reverse map
    const mapped = REVERSE_TYPE_MAP[partType];
    if (mapped) return mapped as ModuleType;
    return partType.replace('wokwi-', '') as ModuleType;
}

export function mapCircuitToParts(
    state: CircuitState,
    pinStates: Record<number, boolean>
): DiagramPart[] {
    // Arduino
    const arduino: DiagramPart = {
        id: 'arduino',
        type: 'wokwi-arduino-uno',
        left: state.arduino.x,
        top: state.arduino.y,
        rotate: state.arduino.rotation || 0,
        attrs: {}
    };

    // Modules
    const modules = state.modules.map(m => {
        const type = getPartType(m.type);
        const attrs: Record<string, string | number | boolean> = { ...m.properties };

        // Specific logic for components
        if (m.type === 'led') {
            const isConnected = state.wires.some(w => w.fromComponent === m.id || w.toComponent === m.id);
            // Simple logic: if connected and any pin is high (this is a simplified logic from original)
            // Real logic involves checking if connected to specific pins that are HIGH.
            // For now, let's just pass `value` if it's in properties, or derived?
            // Original used: connectedPins.size > 0 && Object.values(pinStates).some(state => state)
            const isGlobalHigh = Object.values(pinStates).some(s => s);
            if (isConnected && isGlobalHigh) {
                attrs.value = "true";
                attrs.brightness = 1.0;
            } else {
                attrs.value = "false";
                attrs.brightness = 0.1;
            }
        }

        // Button
        if (m.type === 'button') {
            // Attributes handled by Wokwi element? pressed is in properties
            // If pressed is updated in properties by simulation/user, it flows here.
        }

        return {
            id: m.id,
            type,
            left: m.position.x,
            top: m.position.y,
            rotate: m.position.rotation || 0,
            attrs
        };
    });

    return [arduino, ...modules];
}
