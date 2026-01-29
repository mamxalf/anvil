import React, { useCallback, useState } from 'react'
import { ArduinoPin, ARDUINO_UNO_PINS } from './types'

interface PinSlotProps {
    pin: ArduinoPin
    offsetX: number
    offsetY: number
    isConnected: boolean
    isHovered: boolean
    isWiringMode: boolean
    onMouseEnter: (pinId: string) => void
    onMouseLeave: () => void
    onPinClick: (pinId: string) => void
}

/**
 * Get pin color based on type
 */
function getPinColor(type: ArduinoPin['type'], isConnected: boolean): string {
    if (isConnected) return '#22c55e' // green when connected

    switch (type) {
        case 'power':
            return '#ef4444' // red
        case 'ground':
            return '#1f2937' // dark gray
        case 'pwm':
            return '#8b5cf6' // purple
        case 'analog':
            return '#06b6d4' // cyan
        case 'digital':
        default:
            return '#3b82f6' // blue
    }
}

export function PinSlot({
    pin,
    offsetX,
    offsetY,
    isConnected,
    isHovered,
    isWiringMode,
    onMouseEnter,
    onMouseLeave,
    onPinClick,
}: PinSlotProps) {
    const x = offsetX + pin.x
    const y = offsetY + pin.y
    const color = getPinColor(pin.type, isConnected)
    const radius = isHovered ? 7 : 5

    return (
        <g
            className="pin-slot"
            onMouseEnter={() => onMouseEnter(pin.id)}
            onMouseLeave={onMouseLeave}
            onClick={() => onPinClick(pin.id)}
            style={{ cursor: isWiringMode ? 'crosshair' : 'pointer' }}
        >
            {/* Pin circle */}
            <circle
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke={isHovered ? '#fbbf24' : '#fff'}
                strokeWidth={isHovered ? 3 : 1}
                className="transition-all duration-100"
            />

            {/* Hover glow effect */}
            {isHovered && (
                <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    opacity={0.5}
                    className="animate-ping"
                />
            )}

            {/* Pin label tooltip (shown on hover) */}
            {isHovered && (
                <g>
                    <rect
                        x={x + 10}
                        y={y - 12}
                        width={pin.label.length * 8 + 8}
                        height={20}
                        rx={4}
                        fill="#1f2937"
                        stroke="#374151"
                    />
                    <text
                        x={x + 14}
                        y={y + 2}
                        fill="#fff"
                        fontSize={11}
                        fontFamily="monospace"
                        fontWeight="bold"
                    >
                        {pin.label}
                    </text>
                </g>
            )}
        </g>
    )
}

interface ArduinoBoardProps {
    x: number
    y: number
    isSelected: boolean
    connectedPins: Set<string>
    hoveredPin: string | null
    isWiringMode: boolean
    pinStates: Record<number, boolean>
    onSelect: () => void
    onPinHover: (pinId: string | null) => void
    onPinClick: (pinId: string) => void
    onDragStart: (e: React.MouseEvent) => void
}

export function ArduinoBoard({
    x,
    y,
    isSelected,
    connectedPins,
    hoveredPin,
    isWiringMode,
    pinStates,
    onSelect,
    onPinHover,
    onPinClick,
    onDragStart,
}: ArduinoBoardProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isWiringMode) return
        setIsDragging(true)
        onDragStart(e)
    }, [isWiringMode, onDragStart])

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!isDragging && !isWiringMode) {
            e.stopPropagation()
            onSelect()
        }
        setIsDragging(false)
    }, [isDragging, isWiringMode, onSelect])

    // Board dimensions (scaled representation of Arduino Uno)
    const boardWidth = 280
    const boardHeight = 220

    const led13On = pinStates[13] || false

    return (
        <g
            className="arduino-board"
            style={{ cursor: isWiringMode ? 'default' : 'grab' }}
        >
            {/* Board body */}
            <rect
                x={x}
                y={y}
                width={boardWidth}
                height={boardHeight}
                rx={8}
                fill="#0d4c73"
                stroke={isSelected ? '#fbbf24' : '#0a3a5c'}
                strokeWidth={isSelected ? 3 : 2}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                className="transition-all duration-150"
            />

            {/* Board texture lines */}
            {[...Array(8)].map((_, i) => (
                <line
                    key={i}
                    x1={x + 20}
                    y1={y + 40 + i * 20}
                    x2={x + boardWidth - 20}
                    y2={y + 40 + i * 20}
                    stroke="#0a3a5c"
                    strokeWidth={1}
                    opacity={0.3}
                />
            ))}

            {/* USB Port */}
            <rect
                x={x + 110}
                y={y - 10}
                width={40}
                height={20}
                rx={3}
                fill="#94a3b8"
                stroke="#64748b"
                strokeWidth={1}
            />
            <text
                x={x + 130}
                y={y + 5}
                fill="#475569"
                fontSize={8}
                textAnchor="middle"
                fontWeight="bold"
            >
                USB
            </text>

            {/* Power Jack */}
            <circle
                cx={x + 240}
                cy={y + 10}
                r={10}
                fill="#1f2937"
                stroke="#374151"
                strokeWidth={2}
            />

            {/* Arduino Logo Area */}
            <text
                x={x + boardWidth / 2}
                y={y + boardHeight / 2 - 20}
                fill="#10b981"
                fontSize={24}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
            >
                ARDUINO
            </text>
            <text
                x={x + boardWidth / 2}
                y={y + boardHeight / 2 + 10}
                fill="#10b981"
                fontSize={32}
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
            >
                UNO
            </text>

            {/* LED 13 indicator */}
            <circle
                cx={x + 230}
                cy={y + 50}
                r={6}
                fill={led13On ? '#fbbf24' : '#374151'}
                stroke="#1f2937"
                strokeWidth={2}
                className="transition-colors duration-75"
            />
            <text
                x={x + 230}
                y={y + 65}
                fill="#94a3b8"
                fontSize={8}
                textAnchor="middle"
            >
                L
            </text>

            {/* Power LED */}
            <circle
                cx={x + 30}
                cy={y + 50}
                r={5}
                fill="#22c55e"
                stroke="#1f2937"
                strokeWidth={2}
            />
            <text
                x={x + 30}
                y={y + 65}
                fill="#94a3b8"
                fontSize={8}
                textAnchor="middle"
            >
                PWR
            </text>

            {/* Reset Button */}
            <circle
                cx={x + 60}
                cy={y + 50}
                r={8}
                fill="#ef4444"
                stroke="#b91c1c"
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
            />
            <text
                x={x + 60}
                y={y + 65}
                fill="#94a3b8"
                fontSize={8}
                textAnchor="middle"
            >
                RST
            </text>

            {/* Pin labels - Digital side */}
            <text
                x={x + boardWidth - 15}
                y={y + 25}
                fill="#94a3b8"
                fontSize={10}
                textAnchor="end"
                fontWeight="bold"
            >
                DIGITAL
            </text>

            {/* Pin labels - Analog side */}
            <text
                x={x + 15}
                y={y + boardHeight - 10}
                fill="#94a3b8"
                fontSize={10}
                fontWeight="bold"
            >
                ANALOG
            </text>

            {/* Power pin labels */}
            <text
                x={x + 15}
                y={y + 25}
                fill="#94a3b8"
                fontSize={10}
                fontWeight="bold"
            >
                POWER
            </text>

            {/* Render all pins */}
            {ARDUINO_UNO_PINS.map(pin => (
                <PinSlot
                    key={pin.id}
                    pin={pin}
                    offsetX={x}
                    offsetY={y}
                    isConnected={connectedPins.has(pin.id)}
                    isHovered={hoveredPin === pin.id}
                    isWiringMode={isWiringMode}
                    onMouseEnter={(pinId) => onPinHover(pinId)}
                    onMouseLeave={() => onPinHover(null)}
                    onPinClick={onPinClick}
                />
            ))}
        </g>
    )
}
