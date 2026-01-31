import React from 'react';
import type { ActivePin, Part, Pin, Wire } from "./canvasTypes";
import { PinLayer } from "./PinLayer";
import { PartLayer } from "./PartLayer";
import { WireLayer } from "./WireLayer";

type CanvasProps = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    wires: Wire[];
    isWiringMode: boolean;
    pins: Pin[];
    activePin: ActivePin;
    onPinClick: (partId: string, pinName: string) => void;
    parts: Part[];
    partRefs: React.MutableRefObject<Map<string, HTMLElement>>;
    selectedPartId: string | null;
    selectedWireId: string | null;
    onWireClick: (id: string) => void;
    onPartPointerDown: (partId: string, event: React.PointerEvent) => void;
};

export function PlaygroundCanvas({
    containerRef,
    wires,
    isWiringMode,
    pins,
    activePin,
    onPinClick,
    parts,
    partRefs,
    selectedPartId,
    selectedWireId,
    onWireClick,
    onPartPointerDown,
}: CanvasProps) {
    return (
        <div className="relative w-full h-full bg-slate-500 overflow-hidden">
            <div
                ref={containerRef}
                className="absolute inset-0"
                style={{ userSelect: "none" }}
            >
                <WireLayer
                    wires={wires}
                    selectedWireId={selectedWireId}
                    onWireClick={onWireClick}
                />
                <PinLayer
                    isWiringMode={isWiringMode}
                    pins={pins}
                    activePin={activePin}
                    onPinClick={onPinClick}
                />
                <PartLayer
                    parts={parts}
                    partRefs={partRefs}
                    selectedPartId={selectedPartId}
                    onPartPointerDown={onPartPointerDown}
                />
            </div>
        </div>
    );
}
