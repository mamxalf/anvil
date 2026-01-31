import { createElement, MutableRefObject, PointerEvent } from "react";
import type { Part } from "./canvasTypes";

type PartLayerProps = {
    parts: Part[];
    partRefs: MutableRefObject<Map<string, HTMLElement>>;
    selectedPartId: string | null;
    onPartPointerDown: (partId: string, event: PointerEvent) => void;
};

export function PartLayer({
    parts,
    partRefs,
    selectedPartId,
    onPartPointerDown,
}: PartLayerProps) {
    return (
        <>
            {parts.map((part) => {
                const attrs = Object.entries(part.attrs ?? {}).reduce(
                    (acc, [key, value]) => ({
                        ...acc,
                        [key]: String(value),
                    }),
                    {} as Record<string, string>
                );
                const element = createElement(part.type, {
                    ref: (instance: HTMLElement | null) => {
                        if (instance) {
                            partRefs.current.set(part.id, instance);
                        } else {
                            partRefs.current.delete(part.id);
                        }
                    },
                    ...attrs,
                });
                return (
                    <div
                        key={part.id}
                        className="absolute z-10"
                        style={{
                            left: part.left,
                            top: part.top,
                            transform: part.rotate ? `rotate(${part.rotate}deg)` : undefined,
                            transformOrigin: "center center",
                            cursor: "grab",
                            touchAction: "none",
                            outline:
                                selectedPartId === part.id
                                    ? "2px solid rgba(249, 115, 22, 0.9)" // Kodibot orange
                                    : undefined,
                        }}
                        onPointerDown={(event) => onPartPointerDown(part.id, event)}
                    >
                        {element}
                    </div>
                );
            })}
        </>
    );
}
