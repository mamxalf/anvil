
import { Wire } from './types'
import { getPinPosition } from './usePinPositions'

interface WireConnectionProps {
    wire: Wire
    pinPositions: Map<string, { x: number; y: number; componentId: string; pinId: string }>
    isSelected: boolean
    onClick: () => void
}

/**
 * Generate a smooth bezier curve path between two points
 */
function generateWirePath(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
): string {
    const dx = toX - fromX
    const dy = toY - fromY
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Control point offset based on distance
    const offset = Math.min(distance * 0.4, 80)

    // Determine curve direction based on relative positions
    let cp1x: number, cp1y: number, cp2x: number, cp2y: number

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal-ish connection
        cp1x = fromX + offset
        cp1y = fromY
        cp2x = toX - offset
        cp2y = toY
    } else {
        // Vertical-ish connection
        cp1x = fromX
        cp1y = fromY + offset
        cp2x = toX
        cp2y = toY - offset
    }

    return `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`
}

export function WireConnection({ wire, pinPositions, isSelected, onClick }: WireConnectionProps) {
    const fromPos = getPinPosition(pinPositions, wire.fromComponent, wire.fromPin)
    const toPos = getPinPosition(pinPositions, wire.toComponent, wire.toPin)

    if (!fromPos || !toPos) return null

    const path = generateWirePath(fromPos.x, fromPos.y, toPos.x, toPos.y)

    return (
        <g className="wire-connection" onClick={onClick}>
            {/* Invisible wider stroke for easier clicking */}
            <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={12}
                style={{ cursor: 'pointer' }}
            />
            {/* Visible wire */}
            <path
                d={path}
                fill="none"
                stroke={wire.color}
                strokeWidth={isSelected ? 4 : 3}
                strokeLinecap="round"
                className={`transition-all duration-150 ${isSelected ? 'drop-shadow-lg' : ''}`}
                style={{
                    filter: isSelected ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' : undefined,
                }}
            />
            {/* Connector dots at endpoints */}
            <circle
                cx={fromPos.x}
                cy={fromPos.y}
                r={4}
                fill={wire.color}
                className="transition-all duration-150"
            />
            <circle
                cx={toPos.x}
                cy={toPos.y}
                r={4}
                fill={wire.color}
                className="transition-all duration-150"
            />
        </g>
    )
}

interface WiringPreviewProps {
    fromX: number
    fromY: number
    toX: number
    toY: number
    color?: string
}

/**
 * Preview wire while dragging to create a new connection
 */
export function WiringPreview({ fromX, fromY, toX, toY, color = '#3b82f6' }: WiringPreviewProps) {
    const path = generateWirePath(fromX, fromY, toX, toY)

    return (
        <g className="wiring-preview" style={{ pointerEvents: 'none' }}>
            <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="8 4"
                className="animate-pulse"
                opacity={0.8}
            />
            <circle
                cx={fromX}
                cy={fromY}
                r={5}
                fill={color}
                className="animate-pulse"
            />
            <circle
                cx={toX}
                cy={toY}
                r={5}
                fill={color}
                opacity={0.5}
            />
        </g>
    )
}
