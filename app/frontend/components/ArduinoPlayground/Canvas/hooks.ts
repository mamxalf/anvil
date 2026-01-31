import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import type {
    Dispatch,
    MutableRefObject,
    PointerEvent as ReactPointerEvent,
    RefObject,
    SetStateAction,
} from "react";
import type {
    CanvasSize,
    DiagramPart,
    DragState,
    Point,
} from "./diagram";
import { parsePinInfo, rotatePoint } from "./diagram";

type PinPositions = Record<string, Record<string, Point>>;

export function useCanvasSize(ref: RefObject<HTMLDivElement | null>) {
    const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);

    return size;
}

export function usePinPositions(
    parts: DiagramPart[],
    partRefs: MutableRefObject<Map<string, HTMLElement>>,
    canvasSize: CanvasSize
) {
    const [pinPositions, setPinPositions] = useState<PinPositions>({});

    useLayoutEffect(() => {
        let cancelled = false;
        const updatePins = async () => {
            const types = Array.from(new Set(parts.map((part) => part.type)));
            await Promise.all(
                types.map((type) =>
                    customElements
                        .whenDefined(type)
                        .catch(() => undefined)
                )
            );
            if (cancelled) {
                return;
            }
            const nextPositions: PinPositions = {};
            for (const part of parts) {
                const element = partRefs.current.get(part.id);
                if (!element) {
                    continue;
                }
                // Try getting pinInfo from instance or constructor
                const rawPinInfo =
                    (element as unknown as { pinInfo?: unknown }).pinInfo ??
                    (element.constructor as { pinInfo?: unknown }).pinInfo;

                const pinInfo = parsePinInfo(rawPinInfo);

                // If no pinInfo found, we can't calculate positions
                if (!pinInfo.length) {
                    continue;
                }

                const width = element.offsetWidth || 0;
                const height = element.offsetHeight || 0;
                const center = {
                    x: (part.left ?? 0) + width / 2,
                    y: (part.top ?? 0) + height / 2,
                };
                const partPins: Record<string, Point> = {};
                for (const pin of pinInfo) {
                    const basePoint = {
                        x: (part.left ?? 0) + pin.x,
                        y: (part.top ?? 0) + pin.y,
                    };
                    const rotatedPoint = rotatePoint(
                        basePoint,
                        center,
                        part.rotate ?? 0
                    );
                    partPins[pin.name] = rotatedPoint;
                }
                nextPositions[part.id] = partPins;
            }
            setPinPositions(nextPositions);
        };
        updatePins();
        return () => {
            cancelled = true;
        };
    }, [parts, canvasSize.width, canvasSize.height, partRefs]);

    return pinPositions;
}

export function useDragParts(
    parts: DiagramPart[],
    setParts: Dispatch<SetStateAction<DiagramPart[]>>,
    onPartsChange?: (parts: DiagramPart[]) => void
) {
    const dragRef = useRef<DragState | null>(null);
    const partsRef = useRef(parts);

    useEffect(() => {
        partsRef.current = parts;
    }, [parts]);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            const dragState = dragRef.current;
            if (!dragState) {
                return;
            }
            const dx = event.clientX - dragState.startX;
            const dy = event.clientY - dragState.startY;

            const newParts = partsRef.current.map((part) =>
                part.id === dragState.id
                    ? {
                        ...part,
                        // Snap to grid (optional, can be 10px)
                        left: Math.round(((dragState.originLeft ?? 0) + dx) / 10) * 10,
                        top: Math.round(((dragState.originTop ?? 0) + dy) / 10) * 10,
                    }
                    : part
            );

            setParts(newParts);
            if (onPartsChange) onPartsChange(newParts);
        };
        const handlePointerUp = () => {
            dragRef.current = null;
        };
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [setParts, onPartsChange]);

    const startDrag = (partId: string, event: ReactPointerEvent) => {
        if (event.button !== 0) {
            return;
        }
        const current = partsRef.current.find((item) => item.id === partId);
        if (!current) {
            return;
        }
        dragRef.current = {
            id: partId,
            startX: event.clientX,
            startY: event.clientY,
            originLeft: current.left ?? 0,
            originTop: current.top ?? 0,
        };
    };

    return { startDrag };
}
