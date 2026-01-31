import type { ActivePin, Pin } from "./canvasTypes";

type PinLayerProps = {
    isWiringMode: boolean;
    pins: Pin[];
    activePin: ActivePin;
    onPinClick: (partId: string, pinName: string) => void;
};

export function PinLayer({
    isWiringMode,
    pins,
    activePin,
    onPinClick,
}: PinLayerProps) {


    return (
        <>
            {pins.map((pin) => (
                <button
                    key={`${pin.partId}-${pin.pinName}`}
                    type="button"
                    onClick={() => onPinClick(pin.partId, pin.pinName)}
                    className={`absolute z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-sm transition-all duration-200 hover:scale-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${activePin?.partId === pin.partId && activePin.pinName === pin.pinName
                        ? "bg-emerald-500 shadow-emerald-200 opacity-100 scale-125"
                        : isWiringMode
                            ? "bg-amber-400 hover:bg-amber-300 shadow-orange-200 opacity-100"
                            : "bg-amber-400 hover:bg-amber-300 shadow-orange-200 opacity-0 hover:opacity-100"
                        }`}
                    style={{ left: pin.x, top: pin.y }}
                />
            ))}
        </>
    );
}
