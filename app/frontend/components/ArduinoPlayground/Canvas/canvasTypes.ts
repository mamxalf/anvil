import type { DiagramPart } from "./diagram";

export type { DiagramPart as Part };

export type ActivePin = {
    partId: string;
    pinName: string;
} | null;

export type Pin = {
    partId: string;
    pinName: string;
    x: number;
    y: number;
};

export type Wire = {
    id: string;
    path: string;
    color: string;
    index: number;
};
