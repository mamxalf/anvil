import type { Wire } from "./canvasTypes";

type WireLayerProps = {
    wires: Wire[];
    selectedWireId: string | null;
    onWireClick: (id: string) => void;
};

export function WireLayer({
    wires,
    selectedWireId,
    onWireClick,
}: WireLayerProps) {
    return (
        <svg
            className="absolute inset-0 z-20 pointer-events-none"
            width="100%"
            height="100%"
        >
            {wires.map((wire) => (
                <g key={wire.id}>
                    {/* Transparent wide path for easier clicking */}
                    <path
                        d={wire.path}
                        stroke="transparent"
                        strokeWidth={12}
                        fill="none"
                        className="cursor-pointer pointer-events-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            onWireClick(wire.id);
                        }}
                    />
                    {/* Visible wire path */}
                    <path
                        d={wire.path}
                        stroke={selectedWireId === wire.id ? "#f97316" : wire.color} // Kodibot orange on select
                        strokeWidth={selectedWireId === wire.id ? 4 : 3}
                        fill="none"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="pointer-events-none transition-colors"
                        style={{
                            filter: selectedWireId === wire.id ? "drop-shadow(0 0 2px rgba(249, 115, 22, 0.5))" : undefined
                        }}
                    />
                </g>
            ))}
        </svg>
    );
}
