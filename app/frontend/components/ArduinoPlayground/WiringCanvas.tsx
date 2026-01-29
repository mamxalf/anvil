import React, { useCallback, useRef, useState, useEffect } from 'react'
import { CircuitState, Wire } from './types'
import { usePinPositions, getPinPosition, findNearestPin } from './usePinPositions'
import { ArduinoBoard } from './ArduinoBoard'
import { ModuleRenderer } from './ModuleComponents'
import { WireConnection, WiringPreview } from './WireConnection'

interface WiringCanvasProps {
    circuitState: CircuitState
    pinStates: Record<number, boolean>
    onMoveArduino: (x: number, y: number) => void
    onMoveModule: (id: string, x: number, y: number) => void
    onSelectItem: (id: string | null) => void
    onStartWiring: (componentId: string, pinId: string, mouseX: number, mouseY: number) => void
    onUpdateWiringPosition: (mouseX: number, mouseY: number) => void
    onCompleteWiring: (componentId: string, pinId: string) => boolean
    onCancelWiring: () => void
    onRemoveWire: (wireId: string) => void  // eslint-disable-line @typescript-eslint/no-unused-vars
    onButtonPress?: (moduleId: string, pressed: boolean) => void
}

const GRID_SIZE = 10
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 600

export function WiringCanvas({
    circuitState,
    pinStates,
    onMoveArduino,
    onMoveModule,
    onSelectItem,
    onStartWiring,
    onUpdateWiringPosition,
    onCompleteWiring,
    onCancelWiring,
    onRemoveWire: _onRemoveWire,
    onButtonPress,
}: WiringCanvasProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [dragState, setDragState] = useState<{
        type: 'arduino' | 'module'
        id?: string
        offsetX: number
        offsetY: number
    } | null>(null)
    const [hoveredPin, setHoveredPin] = useState<{ componentId: string; pinId: string } | null>(null)
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT })
    const [isPanning, setIsPanning] = useState(false)
    const [panStart, setPanStart] = useState({ x: 0, y: 0 })

    // Calculate pin positions
    const pinPositions = usePinPositions(circuitState.arduino, circuitState.modules)

    // Get connected pins for each component
    const getConnectedPins = useCallback((componentId: string): Set<string> => {
        const connected = new Set<string>()
        circuitState.wires.forEach(wire => {
            if (wire.fromComponent === componentId) connected.add(wire.fromPin)
            if (wire.toComponent === componentId) connected.add(wire.toPin)
        })
        return connected
    }, [circuitState.wires])

    // Convert screen coordinates to SVG coordinates
    const screenToSVG = useCallback((clientX: number, clientY: number) => {
        if (!svgRef.current) return { x: 0, y: 0 }

        const svg = svgRef.current
        const rect = svg.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * viewBox.width + viewBox.x
        const y = ((clientY - rect.top) / rect.height) * viewBox.height + viewBox.y

        return { x, y }
    }, [viewBox])

    // Handle mouse move for dragging and wiring
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const { x, y } = screenToSVG(e.clientX, e.clientY)

        // Handle panning
        if (isPanning) {
            const dx = (e.clientX - panStart.x) * (viewBox.width / (svgRef.current?.clientWidth || 1))
            const dy = (e.clientY - panStart.y) * (viewBox.height / (svgRef.current?.clientHeight || 1))
            setViewBox(prev => ({
                ...prev,
                x: prev.x - dx,
                y: prev.y - dy,
            }))
            setPanStart({ x: e.clientX, y: e.clientY })
            return
        }

        // Handle component dragging
        if (dragState) {
            const newX = x - dragState.offsetX
            const newY = y - dragState.offsetY

            if (dragState.type === 'arduino') {
                onMoveArduino(newX, newY)
            } else if (dragState.id) {
                onMoveModule(dragState.id, newX, newY)
            }
            return
        }

        // Handle wiring mode
        if (circuitState.wiringMode) {
            onUpdateWiringPosition(x, y)

            // Check for pin hover
            const nearestPin = findNearestPin(pinPositions, x, y, 20)
            if (nearestPin && nearestPin.componentId !== circuitState.wiringMode.fromComponent) {
                setHoveredPin({ componentId: nearestPin.componentId, pinId: nearestPin.pinId })
            } else {
                setHoveredPin(null)
            }
        }
    }, [screenToSVG, isPanning, panStart, viewBox, dragState, circuitState.wiringMode, pinPositions, onMoveArduino, onMoveModule, onUpdateWiringPosition])

    // Handle mouse up
    const handleMouseUp = useCallback((_e: React.MouseEvent) => {
        if (isPanning) {
            setIsPanning(false)
            return
        }

        if (dragState) {
            setDragState(null)
            return
        }

        // Complete wiring if hovering over a pin
        if (circuitState.wiringMode && hoveredPin) {
            onCompleteWiring(hoveredPin.componentId, hoveredPin.pinId)
            setHoveredPin(null)
        } else if (circuitState.wiringMode) {
            onCancelWiring()
        }
    }, [isPanning, dragState, circuitState.wiringMode, hoveredPin, onCompleteWiring, onCancelWiring])

    // Handle canvas click (deselect)
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === svgRef.current) {
            onSelectItem(null)
        }
    }, [onSelectItem])

    // Handle middle mouse button for panning
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 1) { // Middle mouse button
            e.preventDefault()
            setIsPanning(true)
            setPanStart({ x: e.clientX, y: e.clientY })
        }
    }, [])

    // Handle wheel for zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault()
        const scaleFactor = e.deltaY > 0 ? 1.1 : 0.9
        const { x, y } = screenToSVG(e.clientX, e.clientY)

        setViewBox(prev => {
            const newWidth = Math.min(Math.max(prev.width * scaleFactor, 400), 2400)
            const newHeight = Math.min(Math.max(prev.height * scaleFactor, 300), 1200)
            const scaleX = newWidth / prev.width
            const scaleY = newHeight / prev.height

            return {
                x: x - (x - prev.x) * scaleX,
                y: y - (y - prev.y) * scaleY,
                width: newWidth,
                height: newHeight,
            }
        })
    }, [screenToSVG])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && circuitState.wiringMode) {
                onCancelWiring()
            }
            if (e.key === 'Delete' && circuitState.selectedId) {
                // Delete selected - handled by parent
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [circuitState.wiringMode, circuitState.selectedId, onCancelWiring])

    // Start dragging Arduino
    const handleArduinoDragStart = useCallback((e: React.MouseEvent) => {
        if (circuitState.wiringMode) return
        const { x, y } = screenToSVG(e.clientX, e.clientY)
        setDragState({
            type: 'arduino',
            offsetX: x - circuitState.arduino.x,
            offsetY: y - circuitState.arduino.y,
        })
    }, [circuitState.wiringMode, circuitState.arduino, screenToSVG])

    // Start dragging a module
    const handleModuleDragStart = useCallback((moduleId: string) => (e: React.MouseEvent) => {
        if (circuitState.wiringMode) return
        const module = circuitState.modules.find(m => m.id === moduleId)
        if (!module) return

        const { x, y } = screenToSVG(e.clientX, e.clientY)
        setDragState({
            type: 'module',
            id: moduleId,
            offsetX: x - module.position.x,
            offsetY: y - module.position.y,
        })
    }, [circuitState.wiringMode, circuitState.modules, screenToSVG])

    // Handle pin click (start or complete wiring)
    const handlePinClick = useCallback((componentId: string, pinId: string) => {
        const pinPos = getPinPosition(pinPositions, componentId, pinId)

        if (circuitState.wiringMode) {
            // Complete wiring
            if (componentId !== circuitState.wiringMode.fromComponent) {
                onCompleteWiring(componentId, pinId)
            } else {
                onCancelWiring()
            }
        } else {
            // Start wiring
            if (pinPos) {
                onStartWiring(componentId, pinId, pinPos.x, pinPos.y)
            }
        }
    }, [circuitState.wiringMode, pinPositions, onStartWiring, onCompleteWiring, onCancelWiring])

    // Handle wire click
    const handleWireClick = useCallback((wire: Wire) => {
        onSelectItem(wire.id)
    }, [onSelectItem])

    // Get wiring preview position
    const wiringPreviewFrom = circuitState.wiringMode
        ? getPinPosition(pinPositions, circuitState.wiringMode.fromComponent, circuitState.wiringMode.fromPin)
        : null

    return (
        <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden">
            {/* Zoom controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
                <button
                    onClick={() => setViewBox(prev => ({
                        ...prev,
                        width: Math.max(prev.width * 0.9, 400),
                        height: Math.max(prev.height * 0.9, 300),
                    }))}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center text-lg font-bold"
                >
                    +
                </button>
                <button
                    onClick={() => setViewBox(prev => ({
                        ...prev,
                        width: Math.min(prev.width * 1.1, 2400),
                        height: Math.min(prev.height * 1.1, 1200),
                    }))}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center text-lg font-bold"
                >
                    −
                </button>
                <button
                    onClick={() => setViewBox({ x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT })}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center text-xs"
                    title="Reset view"
                >
                    ⟲
                </button>
            </div>

            {/* Wiring mode indicator */}
            {circuitState.wiringMode && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-blue-500 text-white text-sm font-bold rounded-lg animate-pulse">
                    🔌 Wiring Mode - Click a pin to connect or press ESC to cancel
                </div>
            )}

            <svg
                ref={svgRef}
                className="w-full h-full"
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onClick={handleCanvasClick}
                onWheel={handleWheel}
                style={{ cursor: isPanning ? 'grabbing' : circuitState.wiringMode ? 'crosshair' : 'default' }}
            >
                {/* Grid pattern */}
                <defs>
                    <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                        <circle cx={GRID_SIZE / 2} cy={GRID_SIZE / 2} r={0.5} fill="#475569" />
                    </pattern>
                    <pattern id="grid-large" width={GRID_SIZE * 10} height={GRID_SIZE * 10} patternUnits="userSpaceOnUse">
                        <rect width={GRID_SIZE * 10} height={GRID_SIZE * 10} fill="url(#grid)" />
                        <path d={`M ${GRID_SIZE * 10} 0 L 0 0 0 ${GRID_SIZE * 10}`} fill="none" stroke="#374151" strokeWidth={0.5} />
                    </pattern>
                </defs>

                {/* Background grid */}
                <rect
                    x={viewBox.x - 100}
                    y={viewBox.y - 100}
                    width={viewBox.width + 200}
                    height={viewBox.height + 200}
                    fill="url(#grid-large)"
                />

                {/* Wires layer (below components) */}
                <g className="wires-layer">
                    {circuitState.wires.map(wire => (
                        <WireConnection
                            key={wire.id}
                            wire={wire}
                            pinPositions={pinPositions}
                            isSelected={circuitState.selectedId === wire.id}
                            onClick={() => handleWireClick(wire)}
                        />
                    ))}

                    {/* Wiring preview */}
                    {circuitState.wiringMode && wiringPreviewFrom && (
                        <WiringPreview
                            fromX={wiringPreviewFrom.x}
                            fromY={wiringPreviewFrom.y}
                            toX={circuitState.wiringMode.mouseX}
                            toY={circuitState.wiringMode.mouseY}
                        />
                    )}
                </g>

                {/* Arduino board */}
                <ArduinoBoard
                    x={circuitState.arduino.x}
                    y={circuitState.arduino.y}
                    isSelected={circuitState.selectedId === 'arduino'}
                    connectedPins={getConnectedPins('arduino')}
                    hoveredPin={hoveredPin?.componentId === 'arduino' ? hoveredPin.pinId : null}
                    isWiringMode={!!circuitState.wiringMode}
                    pinStates={pinStates}
                    onSelect={() => onSelectItem('arduino')}
                    onPinHover={(pinId) => setHoveredPin(pinId ? { componentId: 'arduino', pinId } : null)}
                    onPinClick={(pinId) => handlePinClick('arduino', pinId)}
                    onDragStart={handleArduinoDragStart}
                />

                {/* Modules */}
                {circuitState.modules.map(module => (
                    <ModuleRenderer
                        key={module.id}
                        module={module}
                        isSelected={circuitState.selectedId === module.id}
                        connectedPins={getConnectedPins(module.id)}
                        hoveredPin={hoveredPin?.componentId === module.id ? hoveredPin.pinId : null}
                        isWiringMode={!!circuitState.wiringMode}
                        pinStates={pinStates}
                        onSelect={() => onSelectItem(module.id)}
                        onPinHover={(pinId) => setHoveredPin(pinId ? { componentId: module.id, pinId } : null)}
                        onPinClick={(pinId) => handlePinClick(module.id, pinId)}
                        onDragStart={handleModuleDragStart(module.id)}
                        onButtonPress={onButtonPress ? (pressed) => onButtonPress(module.id, pressed) : undefined}
                    />
                ))}
            </svg>
        </div>
    )
}
