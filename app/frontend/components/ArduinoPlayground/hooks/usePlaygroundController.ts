import { useMemo, useCallback, MutableRefObject, RefObject } from 'react';
import { useCircuitState } from '../../../hooks/useCircuitState';
import { useCanvasSize, usePinPositions, useDragParts } from '../Canvas/hooks';
import { buildWirePath, DiagramPart } from '../Canvas/diagram';
import { mapCircuitToParts } from '../utils/mapper';

interface UsePlaygroundControllerProps {
    partRefs: MutableRefObject<Map<string, HTMLElement>>;
    containerRef: RefObject<HTMLDivElement | null>;
    pinStates: Record<number, boolean>;
}

export function usePlaygroundController({ partRefs, containerRef, pinStates }: UsePlaygroundControllerProps) {
    const {
        state: circuitState,
        moveArduino,
        moveModule,
        startWiring,
        updateWiringPosition,
        completeWiring,
        selectItem,
        addModule,
        removeModule,
        rotateComponent,
        updateModuleProperties,
        importCircuit,
        exportCircuit,
        clearCircuit,
        deleteSelected,
        removeWire
    } = useCircuitState();

    const canvasSize = useCanvasSize(containerRef);

    // Derived Parts
    const parts = useMemo(() =>
        mapCircuitToParts(circuitState, pinStates),
        [circuitState, pinStates]);

    // Pin Positions
    const pinPositions = usePinPositions(parts, partRefs, canvasSize);

    // Derived Wires for Canvas
    const wires = useMemo(() => {
        return circuitState.wires.map((wire, index) => {
            const sourceId = wire.fromComponent;
            const targetId = wire.toComponent;
            const sourcePin = wire.fromPin;
            const targetPin = wire.toPin;

            const fromPos = pinPositions[sourceId]?.[sourcePin];
            const toPos = pinPositions[targetId]?.[targetPin];

            if (!fromPos || !toPos) return null;

            const path = buildWirePath(fromPos, toPos, []); // No generic routing logic yet besides default

            return {
                id: wire.id,
                path,
                color: wire.color,
                index
            };
        }).filter(Boolean) as { id: string; path: string; color: string; index: number }[];
    }, [circuitState.wires, pinPositions]);

    // Flattened pins for PinLayer
    const pins = useMemo(() => {
        const result: { partId: string; pinName: string; x: number; y: number }[] = [];
        Object.entries(pinPositions).forEach(([partId, pinsMap]) => {
            Object.entries(pinsMap).forEach(([pinName, pos]) => {
                result.push({ partId, pinName, x: pos.x, y: pos.y });
            });
        });
        return result;
    }, [pinPositions]);

    // Wiring Preview Wire
    const previewWire = useMemo(() => {
        if (!circuitState.wiringMode) return null;

        const { fromComponent, fromPin, mouseX, mouseY } = circuitState.wiringMode;
        const fromPos = pinPositions[fromComponent]?.[fromPin];

        if (!fromPos) return null;

        // Note: mouseX/Y from circuitState might need calibration if it was based on old logic? 
        // But we will update the handler to use raw SVG/div coordinates soon.

        return {
            id: 'preview',
            path: buildWirePath(fromPos, { x: mouseX, y: mouseY }, []),
            color: '#666',
            index: -1
        };
    }, [circuitState.wiringMode, pinPositions]);

    const allWires = useMemo(() => {
        return previewWire ? [...wires, previewWire] : wires;
    }, [wires, previewWire]);

    // Drag Logic
    // We need to sync drag changes back to circuitState
    const handlePartsChange = useCallback((newParts: DiagramPart[]) => {
        newParts.forEach(part => {
            if (part.id === 'arduino') {
                moveArduino(part.left!, part.top!);
            } else {
                moveModule(part.id, part.left!, part.top!);
            }
        });
    }, [moveArduino, moveModule]);



    // Keep localParts in sync when not dragging? 
    // Actually useDragParts handles internal state but we need to pass the INITIAL state.
    // And when drag ends, we update central state. 
    // My updated useDragParts updates the state we pass it.

    // Let's wrapping setLocalParts to also update circuitState? 
    // Or just let useDragParts drive local visual state and `onPointerUp` triggers save?
    // The current useDragParts just updates the state passed to it.

    // Better approach:
    // Pass `parts` (derived from circuitState) to Canvas.
    // Implement `onPartMove` in Canvas -> calls `moveModule`.
    // We don't need `useDragParts` inside the hook if we just implement direct manipulation handlers.
    // BUT `useDragParts` in reference provides smooth dragging.

    // I will use `useDragParts` here.
    const { startDrag } = useDragParts(parts, (value) => {
        // This setter is called during drag.
        // value can be function or value.
        const newParts = typeof value === 'function' ? value(parts) : value;
        handlePartsChange(newParts);
    });

    // Interaction Handlers
    const handlePinClick = useCallback((partId: string, pinName: string) => {
        // Logic from WiringCanvas/CircuitState
        if (circuitState.wiringMode) {
            completeWiring(partId, pinName);
        } else {
            // Need mouse position? startWiring needs it. 
            // But startWiring just starts the mode. The mouse position is updated via mouse move.
            // We can get pin position!
            const pos = pinPositions[partId]?.[pinName];
            if (pos) {
                startWiring(partId, pinName, pos.x, pos.y);
            }
        }
    }, [circuitState.wiringMode, completeWiring, startWiring, pinPositions]);

    const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
        if (circuitState.wiringMode && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateWiringPosition(x, y);
        }
    }, [circuitState.wiringMode, containerRef, updateWiringPosition]);

    const handlePartPointerDown = useCallback((partId: string, e: React.PointerEvent) => {
        if (!circuitState.wiringMode) {
            startDrag(partId, e);
            selectItem(partId);
        }
    }, [circuitState.wiringMode, startDrag, selectItem]);

    return {
        circuitState,
        parts,
        wires: allWires,
        pins,
        pinPositions,
        activePin: circuitState.wiringMode ? { partId: circuitState.wiringMode.fromComponent, pinName: circuitState.wiringMode.fromPin } : null, // Used for highlighting

        // Actions
        handlePinClick,
        handleCanvasMouseMove,
        handlePartPointerDown,

        // Passthrough
        selectItem,
        addModule,
        removeModule,
        rotateComponent,
        updateModuleProperties,
        importCircuit,
        exportCircuit,
        clearCircuit,
        deleteSelected,
        removeWire
    };
}
