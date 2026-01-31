/// <reference path="../../types/wokwi-elements.d.ts" />
import React, { useCallback, useState } from 'react'
import { ArduinoPin, ARDUINO_UNO_PINS } from './types'
import '@wokwi/elements'

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
    const radius = 6

    return (
        <g
            className="pin-slot"
            onMouseEnter={() => onMouseEnter(pin.id)}
            onMouseLeave={onMouseLeave}
            onClick={() => onPinClick(pin.id)}
            style={{ cursor: isWiringMode ? 'crosshair' : 'pointer' }}
        >
            {/* Invisible Hit Area */}
            <circle
                cx={x}
                cy={y}
                r={radius}
                fill="transparent"
                stroke="none"
            />

            {/* Verification/Highlight Circle */}
            {(isHovered || isConnected) && (
                <circle
                    cx={x}
                    cy={y}
                    r={radius - 1}
                    fill={isConnected ? '#22c55e' : 'none'}
                    stroke={isHovered ? '#fbbf24' : 'none'}
                    strokeWidth={2}
                    opacity={0.8}
                    className={isHovered ? 'animate-pulse' : ''}
                />
            )}

            {/* Pin label tooltip (shown on hover) */}
            {isHovered && (
                <g style={{ pointerEvents: 'none' }}>
                    <rect
                        x={x + 10}
                        y={y - 20}
                        width={pin.label.length * 8 + 12}
                        height={24}
                        rx={4}
                        fill="#1f2937"
                        stroke="#374151"
                        strokeWidth={1}
                        className="shadow-xl"
                    />
                    <text
                        x={x + 16}
                        y={y - 4}
                        fill="#fff"
                        fontSize={12}
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
    ...rest
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

    const led13On = pinStates[13] || false
    const powerOn = true
    const rotation = (rest as any).rotation || 0

    // Board dimensions for rotation center
    const width = 300
    const height = 230
    const cx = width / 2
    const cy = height / 2

    return (
        <g
            className="arduino-board"
            style={{ cursor: isWiringMode ? 'default' : 'grab' }}
            transform={`translate(${x}, ${y}) rotate(${rotation}, ${cx}, ${cy})`}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            {/* Selection Outline */}
            {isSelected && (
                <rect
                    x={-5}
                    y={-5}
                    width={310}
                    height={230}
                    rx={10}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    className="animate-pulse"
                />
            )}

            {/* Wokwi Element Rendered via ForeignObject */}
            {/* Note: Wokwi Uno default size is typically larger, so we scale it down slightly or adjust container */}
            <foreignObject x={0} y={0} width={300} height={220} style={{ pointerEvents: 'none' }}>
                <div style={{ width: '100%', height: '100%', transform: 'scale(1)', transformOrigin: '0 0' }}>
                    <wokwi-arduino-uno
                        led13={led13On ? "" : undefined}
                        ledPower={powerOn ? "" : undefined}
                    />
                </div>
            </foreignObject>

            {/* Render Pin Slots (Interactive Areas - Invisible Overlay) */}
            {ARDUINO_UNO_PINS.map(pin => (
                <PinSlot
                    key={pin.id}
                    pin={pin}
                    offsetX={0} // Coordinates are already relative to board group
                    offsetY={0}
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
