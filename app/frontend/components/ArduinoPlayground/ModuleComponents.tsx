/// <reference path="../../types/wokwi-elements.d.ts" />
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { CircuitModule, MODULE_CONFIGS, ModulePin } from './types'

// Import wokwi-elements
import '@wokwi/elements'

interface ModulePinSlotProps {
    pin: ModulePin
    moduleX: number
    moduleY: number
    isConnected: boolean
    isHovered: boolean
    isWiringMode: boolean
    onMouseEnter: (pinId: string) => void
    onMouseLeave: () => void
    onPinClick: (pinId: string) => void
}

function ModulePinSlot({
    pin,
    moduleX,
    moduleY,
    isConnected,
    isHovered,
    isWiringMode,
    onMouseEnter,
    onMouseLeave,
    onPinClick,
}: ModulePinSlotProps) {
    const x = moduleX + pin.x
    const y = moduleY + pin.y

    const color = isConnected
        ? '#22c55e'
        : pin.type === 'ground'
            ? '#1f2937'
            : pin.type === 'power'
                ? '#ef4444'
                : '#f59e0b'

    const radius = isHovered ? 8 : 5

    return (
        <g
            className="module-pin"
            onMouseEnter={() => onMouseEnter(pin.id)}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
                e.stopPropagation()
                onPinClick(pin.id)
            }}
            style={{ cursor: isWiringMode ? 'crosshair' : 'pointer' }}
        >
            {/* Click target */}
            <circle
                cx={x}
                cy={y}
                r={12}
                fill="transparent"
            />
            <circle
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke={isHovered ? '#fbbf24' : '#fff'}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-100"
            />

            {isHovered && (
                <g>
                    <rect
                        x={x + 10}
                        y={y - 12}
                        width={pin.label.length * 8 + 12}
                        height={24}
                        rx={4}
                        fill="#1f2937"
                        stroke="#374151"
                    />
                    <text
                        x={x + 16}
                        y={y + 4}
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

interface BaseModuleProps {
    module: CircuitModule
    isSelected: boolean
    connectedPins: Set<string>
    hoveredPin: string | null
    isWiringMode: boolean
    pinStates: Record<number, boolean>
    onSelect: () => void
    onPinHover: (pinId: string | null) => void
    onPinClick: (pinId: string) => void
    onDragStart: (e: React.MouseEvent) => void
    onButtonPress?: (pressed: boolean) => void
}

// LED Module using wokwi-led
export function LEDModule({
    module,
    isSelected,
    connectedPins,
    hoveredPin,
    isWiringMode,
    pinStates,
    onSelect,
    onPinHover,
    onPinClick,
    onDragStart,
}: BaseModuleProps) {
    const config = MODULE_CONFIGS.led
    if (!config) return null
    const { x, y } = module.position
    const color = (module.properties.color as string) || 'red'

    // Check if LED should be on based on connected pins and pin states
    const isOn = connectedPins.size > 0 && Object.values(pinStates).some(state => state)

    return (
        <g className="led-module">
            {/* Selection indicator */}
            {isSelected && (
                <rect
                    x={x - 5}
                    y={y - 5}
                    width={config.width + 10}
                    height={config.height + 10}
                    rx={8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5,3"
                />
            )}

            {/* Module background for dragging */}
            <rect
                x={x}
                y={y}
                width={config.width}
                height={config.height}
                rx={6}
                fill="transparent"
                style={{ cursor: isWiringMode ? 'default' : 'grab' }}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            />

            <g transform={`rotate(${module.position.rotation || 0}, ${x + config.width / 2}, ${y + config.height / 2})`} style={{ pointerEvents: 'none' }}>
                {/* Wokwi LED element */}
                <foreignObject x={x + 5} y={y + 5} width={50} height={60}>
                    <div>
                        <wokwi-led
                            color={color}
                            value={isOn}
                            brightness={isOn ? 1.0 : 0.1}
                            label=""
                        />
                    </div>
                </foreignObject>

                {/* Label */}
                <text
                    x={x + config.width / 2}
                    y={y + config.height - 8}
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                    textAnchor="middle"
                >
                    LED
                </text>
            </g>

            {/* Pins */}
            {config.pins.map(pin => (
                <ModulePinSlot
                    key={pin.id}
                    pin={pin}
                    moduleX={x}
                    moduleY={y}
                    isConnected={connectedPins.has(pin.id)}
                    isHovered={hoveredPin === pin.id}
                    isWiringMode={isWiringMode}
                    onMouseEnter={onPinHover}
                    onMouseLeave={() => onPinHover(null)}
                    onPinClick={onPinClick}
                />
            ))}
        </g>
    )
}

// Button Module using wokwi-pushbutton
export function ButtonModule({
    module,
    isSelected,
    connectedPins,
    hoveredPin,
    isWiringMode,
    onSelect,
    onPinHover,
    onPinClick,
    onDragStart,
    onButtonPress,
}: BaseModuleProps) {
    const config = MODULE_CONFIGS.button
    if (!config) return null
    const { x, y } = module.position
    const color = (module.properties.color as string) || 'red'
    const [isPressed, setIsPressed] = useState(false)
    const buttonRef = useRef<HTMLElement>(null)

    // Handle button press
    const handlePress = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsPressed(true)
        onButtonPress?.(true)
    }, [onButtonPress])

    const handleRelease = useCallback(() => {
        setIsPressed(false)
        onButtonPress?.(false)
    }, [onButtonPress])

    useEffect(() => {
        const handleGlobalRelease = () => {
            if (isPressed) {
                setIsPressed(false)
                onButtonPress?.(false)
            }
        }
        window.addEventListener('mouseup', handleGlobalRelease)
        return () => window.removeEventListener('mouseup', handleGlobalRelease)
    }, [isPressed, onButtonPress])

    return (
        <g className="button-module">
            {isSelected && (
                <rect
                    x={x - 5}
                    y={y - 5}
                    width={config.width + 10}
                    height={config.height + 10}
                    rx={8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5,3"
                />
            )}

            <rect
                x={x}
                y={y}
                width={config.width}
                height={config.height}
                rx={6}
                fill="transparent"
                style={{ cursor: isWiringMode ? 'default' : 'grab' }}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            />

            <g transform={`rotate(${module.position.rotation || 0}, ${x + config.width / 2}, ${y + config.height / 2})`} style={{ pointerEvents: 'none' }}>
                <foreignObject x={x + 5} y={y + 10} width={50} height={50}>
                    <div style={{ pointerEvents: 'auto' }} onMouseDown={handlePress} onMouseUp={handleRelease}>
                        <wokwi-pushbutton
                            ref={buttonRef}
                            color={color}
                            pressed={isPressed}
                            label=""
                        />
                    </div>
                </foreignObject>

                <text
                    x={x + config.width / 2}
                    y={y + config.height - 5}
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                    textAnchor="middle"
                >
                    BTN
                </text>
            </g>

            {config.pins.map(pin => (
                <ModulePinSlot
                    key={pin.id}
                    pin={pin}
                    moduleX={x}
                    moduleY={y}
                    isConnected={connectedPins.has(pin.id)}
                    isHovered={hoveredPin === pin.id}
                    isWiringMode={isWiringMode}
                    onMouseEnter={onPinHover}
                    onMouseLeave={() => onPinHover(null)}
                    onPinClick={onPinClick}
                />
            ))}
        </g>
    )
}

// Buzzer Module using wokwi-buzzer
export function BuzzerModule({
    module,
    isSelected,
    connectedPins,
    hoveredPin,
    isWiringMode,
    pinStates,
    onSelect,
    onPinHover,
    onPinClick,
    onDragStart,
}: BaseModuleProps) {
    const config = MODULE_CONFIGS.buzzer
    if (!config) return null
    const { x, y } = module.position
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscillatorRef = useRef<OscillatorNode | null>(null)

    const isActive = Array.from(connectedPins).some(() =>
        Object.values(pinStates).some(v => v)
    )

    useEffect(() => {
        if (isActive) {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext()
            }
            if (!oscillatorRef.current && audioContextRef.current) {
                const osc = audioContextRef.current.createOscillator()
                const gain = audioContextRef.current.createGain()
                osc.connect(gain)
                gain.connect(audioContextRef.current.destination)
                osc.frequency.value = 1000
                gain.gain.value = 0.1
                osc.start()
                oscillatorRef.current = osc
            }
        } else {
            if (oscillatorRef.current) {
                oscillatorRef.current.stop()
                oscillatorRef.current = null
            }
        }
        return () => {
            if (oscillatorRef.current) {
                oscillatorRef.current.stop()
                oscillatorRef.current = null
            }
        }
    }, [isActive])

    return (
        <g className="buzzer-module">
            {isSelected && (
                <rect
                    x={x - 5}
                    y={y - 5}
                    width={config.width + 10}
                    height={config.height + 10}
                    rx={8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5,3"
                />
            )}

            <rect
                x={x}
                y={y}
                width={config.width}
                height={config.height}
                rx={6}
                fill="transparent"
                style={{ cursor: isWiringMode ? 'default' : 'grab' }}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            />

            <g transform={`rotate(${module.position.rotation || 0}, ${x + config.width / 2}, ${y + config.height / 2})`} style={{ pointerEvents: 'none' }}>
                <foreignObject x={x + 5} y={y + 5} width={50} height={50}>
                    <div>
                        <wokwi-buzzer hasSignal={isActive} />
                    </div>
                </foreignObject>

                <text
                    x={x + config.width / 2}
                    y={y + config.height - 5}
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                    textAnchor="middle"
                >
                    BUZZ
                </text>
            </g>

            {config.pins.map(pin => (
                <ModulePinSlot
                    key={pin.id}
                    pin={pin}
                    moduleX={x}
                    moduleY={y}
                    isConnected={connectedPins.has(pin.id)}
                    isHovered={hoveredPin === pin.id}
                    isWiringMode={isWiringMode}
                    onMouseEnter={onPinHover}
                    onMouseLeave={() => onPinHover(null)}
                    onPinClick={onPinClick}
                />
            ))}
        </g>
    )
}

// LCD Module using wokwi-lcd1602
export function LCDModule({
    module,
    isSelected,
    connectedPins,
    hoveredPin,
    isWiringMode,
    onSelect,
    onPinHover,
    onPinClick,
    onDragStart,
}: BaseModuleProps) {
    const config = MODULE_CONFIGS.lcd
    if (!config) return null
    const { x, y } = module.position
    const text = (module.properties.text as string) || 'Hello World!'

    return (
        <g className="lcd-module">
            {isSelected && (
                <rect
                    x={x - 5}
                    y={y - 5}
                    width={config.width + 10}
                    height={config.height + 10}
                    rx={8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5,3"
                />
            )}

            <rect
                x={x}
                y={y}
                width={config.width}
                height={config.height}
                rx={6}
                fill="transparent"
                style={{ cursor: isWiringMode ? 'default' : 'grab' }}
                onMouseDown={onDragStart}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect()
                }}
            />

            <g transform={`rotate(${module.position.rotation || 0}, ${x + config.width / 2}, ${y + config.height / 2})`} style={{ pointerEvents: 'none' }}>
                <foreignObject x={x + 5} y={y + 5} width={175} height={65}>
                    <div>
                        <wokwi-lcd1602
                            text={text}
                            backlight={true}
                            color="green"
                        />
                    </div>
                </foreignObject>
            </g>

            {config.pins.map(pin => (
                <ModulePinSlot
                    key={pin.id}
                    pin={pin}
                    moduleX={x}
                    moduleY={y}
                    isConnected={connectedPins.has(pin.id)}
                    isHovered={hoveredPin === pin.id}
                    isWiringMode={isWiringMode}
                    onMouseEnter={onPinHover}
                    onMouseLeave={() => onPinHover(null)}
                    onPinClick={onPinClick}
                />
            ))}
        </g>
    )
}

// Module renderer that picks the right component based on type
interface ModuleRendererProps extends BaseModuleProps { }

export function ModuleRenderer(props: ModuleRendererProps) {
    switch (props.module.type) {
        case 'led':
            return <LEDModule {...props} />
        case 'button':
            return <ButtonModule {...props} />
        case 'buzzer':
            return <BuzzerModule {...props} />
        case 'lcd':
            return <LCDModule {...props} />
        default:
            return null
    }
}
