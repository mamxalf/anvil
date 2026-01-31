declare namespace JSX {
    interface IntrinsicElements {
        'wokwi-arduino-uno': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            led13?: string | boolean;
            ledPower?: string | boolean;
        };
        'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            color?: string;
            value?: boolean | string;
            brightness?: number;
            label?: string;
            lightColor?: string;
        };
        'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            color?: string;
            pressed?: boolean | string;
            label?: string;
        };
        'wokwi-lcd1602': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            text?: string;
            backlight?: boolean | string;
            color?: string;
        };
        'wokwi-buzzer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            hasSignal?: boolean | string;
            label?: string;
        };
        'wokwi-resistor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            value?: string | number;
        };
    }
}
