import { useState, useCallback, useMemo } from 'react'
import {
    CircuitState,
    CircuitModule,
    Wire,
    ModuleType,
    MODULE_CONFIGS,
    getNextWireColor,
} from '@/components/ArduinoPlayground/types'

const GRID_SIZE = 10

function snapToGrid(value: number): number {
    return Math.round(value / GRID_SIZE) * GRID_SIZE
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export interface UseCircuitStateReturn {
    state: CircuitState

    // Arduino actions
    moveArduino: (x: number, y: number) => void

    // Module actions
    addModule: (type: ModuleType, x?: number, y?: number) => void
    removeModule: (id: string) => void
    moveModule: (id: string, x: number, y: number) => void
    updateModuleProperties: (id: string, properties: Record<string, unknown>) => void

    // Wire actions
    startWiring: (componentId: string, pinId: string, mouseX: number, mouseY: number) => void
    updateWiringPosition: (mouseX: number, mouseY: number) => void
    completeWiring: (componentId: string, pinId: string) => boolean
    cancelWiring: () => void
    removeWire: (wireId: string) => void

    // Selection actions
    selectItem: (id: string | null) => void
    deleteSelected: () => void

    // Utility
    getWiresForComponent: (componentId: string) => Wire[]
    isValidConnection: (fromComponent: string, fromPin: string, toComponent: string, toPin: string) => boolean

    // Serialization
    exportCircuit: () => string
    importCircuit: (json: string) => boolean
    clearCircuit: () => void
}

const initialState: CircuitState = {
    arduino: { x: 100, y: 100 },
    modules: [],
    wires: [],
    selectedId: null,
    wiringMode: null,
}

export function useCircuitState(initial?: Partial<CircuitState>): UseCircuitStateReturn {
    const [state, setState] = useState<CircuitState>({
        ...initialState,
        ...initial,
    })

    // Arduino actions
    const moveArduino = useCallback((x: number, y: number) => {
        setState(prev => ({
            ...prev,
            arduino: { x: snapToGrid(x), y: snapToGrid(y) },
        }))
    }, [])

    // Module actions
    const addModule = useCallback((type: ModuleType, x = 400, y = 200) => {
        const config = MODULE_CONFIGS[type]
        const newModule: CircuitModule = {
            id: `${type}_${generateId()}`,
            type,
            position: { x: snapToGrid(x), y: snapToGrid(y) },
            properties: { ...config.defaultProperties },
        }

        setState(prev => ({
            ...prev,
            modules: [...prev.modules, newModule],
            selectedId: newModule.id,
        }))
    }, [])

    const removeModule = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            modules: prev.modules.filter(m => m.id !== id),
            wires: prev.wires.filter(w => w.fromComponent !== id && w.toComponent !== id),
            selectedId: prev.selectedId === id ? null : prev.selectedId,
        }))
    }, [])

    const moveModule = useCallback((id: string, x: number, y: number) => {
        setState(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                m.id === id
                    ? { ...m, position: { ...m.position, x: snapToGrid(x), y: snapToGrid(y) } }
                    : m
            ),
        }))
    }, [])

    const updateModuleProperties = useCallback((id: string, properties: Record<string, unknown>) => {
        setState(prev => ({
            ...prev,
            modules: prev.modules.map(m =>
                m.id === id
                    ? { ...m, properties: { ...m.properties, ...properties } }
                    : m
            ),
        }))
    }, [])

    // Wire actions
    const startWiring = useCallback((componentId: string, pinId: string, mouseX: number, mouseY: number) => {
        setState(prev => ({
            ...prev,
            wiringMode: {
                fromComponent: componentId,
                fromPin: pinId,
                mouseX,
                mouseY,
            },
        }))
    }, [])

    const updateWiringPosition = useCallback((mouseX: number, mouseY: number) => {
        setState(prev => {
            if (!prev.wiringMode) return prev
            return {
                ...prev,
                wiringMode: {
                    ...prev.wiringMode,
                    mouseX,
                    mouseY,
                },
            }
        })
    }, [])

    const isValidConnection = useCallback((
        fromComponent: string,
        fromPin: string,
        toComponent: string,
        toPin: string
    ): boolean => {
        // Can't connect to same component
        if (fromComponent === toComponent) return false

        // Can't connect same pin types (power to power, ground to ground)
        // This is simplified - real validation would check pin types

        // Check if connection already exists
        const exists = state.wires.some(
            w =>
                (w.fromComponent === fromComponent && w.fromPin === fromPin &&
                    w.toComponent === toComponent && w.toPin === toPin) ||
                (w.fromComponent === toComponent && w.fromPin === toPin &&
                    w.toComponent === fromComponent && w.toPin === fromPin)
        )

        return !exists
    }, [state.wires])

    const completeWiring = useCallback((componentId: string, pinId: string): boolean => {
        let success = false

        setState(prev => {
            if (!prev.wiringMode) return prev

            const { fromComponent, fromPin } = prev.wiringMode

            // Validate connection
            if (fromComponent === componentId) {
                // Can't connect to same component
                return { ...prev, wiringMode: null }
            }

            // Check for existing connection
            const exists = prev.wires.some(
                w =>
                    (w.fromComponent === fromComponent && w.fromPin === fromPin &&
                        w.toComponent === componentId && w.toPin === pinId) ||
                    (w.fromComponent === componentId && w.fromPin === pinId &&
                        w.toComponent === fromComponent && w.toPin === fromPin)
            )

            if (exists) {
                return { ...prev, wiringMode: null }
            }

            // Create new wire
            const newWire: Wire = {
                id: `wire_${generateId()}`,
                fromComponent,
                fromPin,
                toComponent: componentId,
                toPin: pinId,
                color: getNextWireColor(prev.wires),
            }

            success = true

            return {
                ...prev,
                wires: [...prev.wires, newWire],
                wiringMode: null,
                selectedId: newWire.id,
            }
        })

        return success
    }, [])

    const cancelWiring = useCallback(() => {
        setState(prev => ({
            ...prev,
            wiringMode: null,
        }))
    }, [])

    const removeWire = useCallback((wireId: string) => {
        setState(prev => ({
            ...prev,
            wires: prev.wires.filter(w => w.id !== wireId),
            selectedId: prev.selectedId === wireId ? null : prev.selectedId,
        }))
    }, [])

    // Selection actions
    const selectItem = useCallback((id: string | null) => {
        setState(prev => ({
            ...prev,
            selectedId: id,
        }))
    }, [])

    const deleteSelected = useCallback(() => {
        setState(prev => {
            if (!prev.selectedId) return prev

            // Check if it's a wire
            const isWire = prev.wires.some(w => w.id === prev.selectedId)
            if (isWire) {
                return {
                    ...prev,
                    wires: prev.wires.filter(w => w.id !== prev.selectedId),
                    selectedId: null,
                }
            }

            // Check if it's a module
            const isModule = prev.modules.some(m => m.id === prev.selectedId)
            if (isModule) {
                return {
                    ...prev,
                    modules: prev.modules.filter(m => m.id !== prev.selectedId),
                    wires: prev.wires.filter(
                        w => w.fromComponent !== prev.selectedId && w.toComponent !== prev.selectedId
                    ),
                    selectedId: null,
                }
            }

            return prev
        })
    }, [])

    // Utility
    const getWiresForComponent = useCallback((componentId: string): Wire[] => {
        return state.wires.filter(
            w => w.fromComponent === componentId || w.toComponent === componentId
        )
    }, [state.wires])

    // Serialization
    const exportCircuit = useCallback((): string => {
        const data = {
            version: 1,
            arduino: state.arduino,
            modules: state.modules,
            wires: state.wires,
        }
        return JSON.stringify(data, null, 2)
    }, [state.arduino, state.modules, state.wires])

    const importCircuit = useCallback((json: string): boolean => {
        try {
            const data = JSON.parse(json)
            if (data.version !== 1) {
                console.error('Unsupported circuit version')
                return false
            }

            setState(prev => ({
                ...prev,
                arduino: data.arduino || initialState.arduino,
                modules: data.modules || [],
                wires: data.wires || [],
                selectedId: null,
                wiringMode: null,
            }))

            return true
        } catch (error) {
            console.error('Failed to import circuit:', error)
            return false
        }
    }, [])

    const clearCircuit = useCallback(() => {
        setState({
            ...initialState,
        })
    }, [])

    return useMemo(() => ({
        state,
        moveArduino,
        addModule,
        removeModule,
        moveModule,
        updateModuleProperties,
        startWiring,
        updateWiringPosition,
        completeWiring,
        cancelWiring,
        removeWire,
        selectItem,
        deleteSelected,
        getWiresForComponent,
        isValidConnection,
        exportCircuit,
        importCircuit,
        clearCircuit,
    }), [
        state,
        moveArduino,
        addModule,
        removeModule,
        moveModule,
        updateModuleProperties,
        startWiring,
        updateWiringPosition,
        completeWiring,
        cancelWiring,
        removeWire,
        selectItem,
        deleteSelected,
        getWiresForComponent,
        isValidConnection,
        exportCircuit,
        importCircuit,
        clearCircuit,
    ])
}
