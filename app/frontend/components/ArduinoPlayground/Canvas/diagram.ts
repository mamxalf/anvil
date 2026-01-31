export type DiagramConnection = [string, string, string, string[]?];

export type DiagramPart = {
    id: string;
    type: string;
    left?: number;
    top?: number;
    rotate?: number;
    attrs?: Record<string, string | number | boolean>;
};

export type Point = { x: number; y: number };

export type PinInfoEntry = {
    name: string;
    x: number;
    y: number;
};

export type DragState = {
    id: string;
    startX: number;
    startY: number;
    originLeft: number;
    originTop: number;
};

export type CanvasSize = { width: number; height: number };

export function normalizeParts(parts: DiagramPart[]) {
    return parts.map((part) => ({
        ...part,
        left: part.left ?? 0,
        top: part.top ?? 0,
        rotate: part.rotate ?? 0,
    }));
}

export function rotatePoint(point: Point, center: Point, angleDeg: number): Point {
    if (!angleDeg) {
        return point;
    }
    const angle = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
    };
}

export function parsePinInfo(pinInfo: unknown): PinInfoEntry[] {
    if (!pinInfo) {
        return [];
    }
    if (Array.isArray(pinInfo)) {
        return pinInfo.filter(Boolean) as PinInfoEntry[];
    }
    if (
        typeof pinInfo === "object" &&
        pinInfo !== null &&
        Array.isArray((pinInfo as { pins?: unknown }).pins)
    ) {
        return (pinInfo as { pins: PinInfoEntry[] }).pins;
    }
    if (typeof pinInfo === "object" && pinInfo !== null) {
        return Object.entries(pinInfo).flatMap(([name, value]) => {
            if (
                value &&
                typeof value === "object" &&
                "x" in value &&
                "y" in value
            ) {
                return [{ name, x: (value as { x: number }).x, y: (value as { y: number }).y }];
            }
            return [];
        });
    }
    return [];
}

export function parseEndpoint(endpoint: string) {
    const [partId, pinName] = endpoint.split(":");
    return { partId, pinName };
}

export function formatEndpoint(partId: string, pinName: string) {
    return `${partId}:${pinName}`;
}

export function applyStep(point: Point, step: string): Point {
    const direction = step[0];
    const amount = Number(step.slice(1));
    if (direction === "h") {
        return { x: point.x + amount, y: point.y };
    }
    if (direction === "v") {
        return { x: point.x, y: point.y + amount };
    }
    return point;
}

export function buildWirePath(
    source: Point,
    target: Point,
    instructions: string[] | undefined
) {
    const steps = instructions ?? [];
    const starIndex = steps.indexOf("*");
    const sourceSteps = starIndex >= 0 ? steps.slice(0, starIndex) : steps;
    const targetSteps = starIndex >= 0 ? steps.slice(starIndex + 1) : [];

    const sourcePoints: Point[] = [source];
    let current = source;
    for (const step of sourceSteps) {
        current = applyStep(current, step);
        sourcePoints.push(current);
    }
    const sourceEnd = current;

    const targetOutward: Point[] = [target];
    let targetCurrent = target;
    for (let i = targetSteps.length - 1; i >= 0; i -= 1) {
        targetCurrent = applyStep(targetCurrent, targetSteps[i]);
        targetOutward.push(targetCurrent);
    }
    const targetEnd = targetCurrent;

    const pathPoints: Point[] = [...sourcePoints];
    if (sourceEnd.x !== targetEnd.x || sourceEnd.y !== targetEnd.y) {
        pathPoints.push({ x: targetEnd.x, y: sourceEnd.y });
        pathPoints.push(targetEnd);
    }

    const targetReturn = targetOutward.slice(0, -1).reverse();
    pathPoints.push(...targetReturn);

    return pathPoints
        .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
        .join(" ");
}
