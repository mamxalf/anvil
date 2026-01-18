/// <reference types="react" />

namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
        'wokwi-arduino-uno': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                led13?: string
                ledPower?: string
                ledTX?: string
                ledRX?: string
                pinInfo?: string
            },
            HTMLElement
        >
        'wokwi-led': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                color?: string
                value?: boolean
                brightness?: number
                lightColor?: string
                label?: string
            },
            HTMLElement
        >
        'wokwi-pushbutton': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                color?: string
                pressed?: boolean
                label?: string
            },
            HTMLElement
        >
        'wokwi-resistor': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                value?: string
            },
            HTMLElement
        >
        'wokwi-servo': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                angle?: number
                horn?: 'single' | 'double' | 'cross'
            },
            HTMLElement
        >
        'wokwi-lcd1602': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                text?: string
                cursor?: boolean
                blink?: boolean
                backlight?: boolean
                color?: string
            },
            HTMLElement
        >
        'wokwi-buzzer': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                hasSignal?: boolean
            },
            HTMLElement
        >
        'wokwi-7segment': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                values?: number[]
                colonOn?: boolean
            },
            HTMLElement
        >
        'wokwi-rgb-led': React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                r?: number
                g?: number
                b?: number
            },
            HTMLElement
        >
    }
}


