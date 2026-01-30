/// <reference path="../../../types/wokwi-elements.d.ts" />
import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useArduinoSimulation } from '@/hooks/useArduinoSimulation'
import { useCircuitState } from '@/hooks/useCircuitState'
import {
    Play,
    Square,
    Save,
    FolderOpen,
    Plus,
    Cpu,
    RotateCcw,
    Code,
    Puzzle,
    ChevronDown,
    Lightbulb,
    Download,
    Upload,
    Globe,
    Loader2,
} from 'lucide-react'
import { BlocklyWorkspace } from 'react-blockly'
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { defineArduinoBlocks } from '@/components/ArduinoBlockly/ArduinoBlocks'
import { configureArduinoGenerator } from '@/components/ArduinoBlockly/ArduinoGenerator'
import { arduinoToolbox } from '@/components/ArduinoBlockly/ArduinoToolbox'
import {
    ARDUINO_BOARDS,
    BoardType,
    ArduinoSketch,
} from '@/components/ArduinoBlockly/ArduinoConfig'
import { EXAMPLE_TEMPLATES } from '@/components/ArduinoPlayground/Examples'
import { WiringCanvas, ComponentPalette, PropertiesPanel, ModuleType, STARTER_CIRCUITS } from '@/components/ArduinoPlayground'

// Initialize Arduino blocks and generator
defineArduinoBlocks()
const generatorHelpers = configureArduinoGenerator()

interface Props {
    sketches: ArduinoSketch[]
    currentSketch: ArduinoSketch
}

type ViewMode = 'circuit' | 'code' | 'split'

export default function ArduinoPlaygroundIndex({ sketches, currentSketch }: Props) {
    const { t } = useTranslation()

    // Arduino simulation hook
    const simulation = useArduinoSimulation()

    // Circuit state hook
    const circuit = useCircuitState()

    // State
    const [viewMode, setViewMode] = useState<ViewMode>('split')
    const [activeTab, setActiveTab] = useState<'blocks' | 'code'>('blocks')
    const [code, setCode] = useState(currentSketch.code)
    const codeRef = useRef(code)

    useEffect(() => {
        codeRef.current = code
    }, [code])

    const [sketchName, setSketchName] = useState(currentSketch.name)
    const [sketchId, setSketchId] = useState<string | null>(currentSketch.id)
    const [blocksXml, setBlocksXml] = useState(currentSketch.blocks_xml || '')
    const [boardType, setBoardType] = useState<BoardType>((currentSketch.board_type as BoardType) || 'uno')

    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [savedSketches, setSavedSketches] = useState<ArduinoSketch[]>(sketches)

    const [showSketchList, setShowSketchList] = useState(false)
    const [showBoardMenu, setShowBoardMenu] = useState(false)
    const [showExamples, setShowExamples] = useState(false)

    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

    const board = ARDUINO_BOARDS[boardType]

    // Derive states from simulation
    const isRunning = simulation.state.isRunning
    const isCompiling = simulation.state.isCompiling
    const pinStates = simulation.state.pinStates
    const consoleOutput = simulation.state.serialOutput

    // Determine selected item type
    const getSelectedType = useCallback((): 'arduino' | 'module' | 'wire' | null => {
        if (!circuit.state.selectedId) return null
        if (circuit.state.selectedId === 'arduino') return 'arduino'
        if (circuit.state.selectedId.startsWith('wire_')) return 'wire'
        return 'module'
    }, [circuit.state.selectedId])

    const selectedModule = circuit.state.modules.find(m => m.id === circuit.state.selectedId)

    // Blockly workspace configuration
    const workspaceConfiguration = {
        grid: { spacing: 20, length: 3, colour: '#e5e7eb', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3 },
        trashcan: true,
    }

    // Handle Blockly workspace changes
    const handleWorkspaceChange = useCallback(
        (workspace: Blockly.WorkspaceSvg) => {
            workspaceRef.current = workspace
            generatorHelpers.reset()

            const generatedCode = javascriptGenerator.workspaceToCode(workspace)
            const includes = generatorHelpers.getIncludes()
            const globals = generatorHelpers.getGlobals()

            let fullCode = ''
            if (includes) fullCode += includes + '\n\n'
            if (globals) fullCode += globals + '\n\n'
            fullCode += generatedCode

            setCode(fullCode || '// Empty sketch')

            const xml = Blockly.Xml.workspaceToDom(workspace)
            const xmlText = Blockly.Xml.domToText(xml)
            setBlocksXml(xmlText)
        },
        [generatorHelpers]
    )

    // Simulation
    const runSimulation = useCallback(async () => {
        if (isRunning || isCompiling) return
        const currentCode = codeRef.current
        const success = await simulation.compile(currentCode, boardType)
        if (success) {
            simulation.run()
        }
    }, [isRunning, isCompiling, boardType, simulation])

    const stopSimulation = useCallback(() => {
        simulation.stop()
    }, [simulation])

    const resetSimulation = useCallback(() => {
        simulation.reset()
    }, [simulation])

    // Save sketch with circuit data
    const saveSketch = async () => {
        if (!code.trim() || !sketchName.trim()) return

        setIsSaving(true)
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

            // Include circuit data in save
            const circuitData = {
                arduino: circuit.state.arduino,
                modules: circuit.state.modules,
                wires: circuit.state.wires,
            }

            const payload = {
                arduino_sketch: {
                    name: sketchName,
                    code,
                    board_type: boardType,
                    modules: circuit.state.modules.map(m => ({
                        id: m.id,
                        type: m.type,
                        pin: null,
                        name: m.type,
                    })),
                    blocks_xml: blocksXml,
                    circuit_data: circuitData,
                },
            }

            if (sketchId) {
                const response = await fetch(`/student/arduino_sketches/${sketchId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken || '' },
                    body: JSON.stringify(payload),
                })
                if (response.ok) {
                    const updated = await response.json()
                    setSavedSketches((prev) => prev.map((s) => (s.id === sketchId ? updated : s)))
                }
            } else {
                const response = await fetch('/student/arduino_sketches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken || '' },
                    body: JSON.stringify(payload),
                })
                if (response.ok) {
                    const created = await response.json()
                    setSketchId(created.id)
                    setSavedSketches((prev) => [created, ...prev])
                }
            }
        } catch (error) {
            console.error('Save error:', error)
        } finally {
            setIsSaving(false)
        }
    }

    // Load sketch
    const loadSketch = (sketch: ArduinoSketch) => {
        setCode(sketch.code)
        setSketchName(sketch.name)
        setSketchId(sketch.id)
        setBoardType((sketch.board_type as BoardType) || 'uno')
        setBlocksXml(sketch.blocks_xml || '')
        setShowSketchList(false)
        stopSimulation()

        // Load circuit data if available
        if (sketch.circuit_data) {
            circuit.importCircuit(JSON.stringify({
                version: 1,
                ...sketch.circuit_data,
            }))
        } else {
            circuit.clearCircuit()
        }
    }

    // Publish sketch
    const togglePublish = async () => {
        if (!sketchId) return

        setIsPublishing(true)
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            const currentSketchData = savedSketches.find(s => s.id === sketchId)
            const isPublished = currentSketchData?.published

            const endpoint = `/student/arduino_sketches/${sketchId}/${isPublished ? 'unpublish' : 'publish'}`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken || '' },
            })

            if (response.ok) {
                const updated = await response.json()
                setSavedSketches((prev) => prev.map((s) => (s.id === sketchId ? updated : s)))
            }
        } catch (error) {
            console.error('Publish error:', error)
        } finally {
            setIsPublishing(false)
        }
    }

    // New sketch
    const newSketch = () => {
        setSketchName('New Sketch')
        setSketchId(null)
        setCode('// New Arduino Sketch\n\nvoid setup() {\n  // Setup code here\n}\n\nvoid loop() {\n  // Loop code here\n}')
        setBlocksXml('')
        circuit.clearCircuit()
        stopSimulation()
    }

    // Export circuit
    const exportCircuit = () => {
        const data = circuit.exportCircuit()
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${sketchName.replace(/\s+/g, '_')}_circuit.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Import circuit
    const importCircuit = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const content = e.target?.result as string
                    circuit.importCircuit(content)
                }
                reader.readAsText(file)
            }
        }
        input.click()
    }

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (circuit.state.selectedId && circuit.state.selectedId !== 'arduino') {
                    e.preventDefault()
                    circuit.deleteSelected()
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault()
                saveSketch()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [circuit.state.selectedId, circuit])

    return (
        <StudentLayout>
            <Head title={t('arduino.title', { defaultValue: 'Arduino Playground' })} />

            <div className="h-[calc(100vh-140px)] flex flex-col gap-3">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg shadow-orange-100/50 p-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        {/* Title & Board */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-orange-500 to-kodibot-orange p-2 rounded-lg shadow-lg shadow-orange-200">
                                    <Cpu className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-black text-gray-900">Arduino Playground</h1>
                                    <p className="text-xs text-gray-500">Circuit Designer + Block Programming</p>
                                </div>
                            </div>

                            {/* Board Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowBoardMenu(!showBoardMenu)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <span className="text-base">{board.image}</span>
                                    <span className="text-xs">{board.name}</span>
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                {showBoardMenu && (
                                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                                        {Object.entries(ARDUINO_BOARDS).map(([key, b]) => (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    setBoardType(key as BoardType)
                                                    setShowBoardMenu(false)
                                                }}
                                                className={`w-full p-2.5 text-left hover:bg-gray-50 flex items-center gap-2 ${boardType === key ? 'bg-orange-50' : ''}`}
                                            >
                                                <span className="text-xl">{b.image}</span>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
                                                    <p className="text-xs text-gray-500">{b.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View Mode */}
                            <div className="flex bg-gray-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode('circuit')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'circuit' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Circuit
                                </button>
                                <button
                                    onClick={() => setViewMode('split')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'split' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Split
                                </button>
                                <button
                                    onClick={() => setViewMode('code')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'code' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Code
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <input
                                type="text"
                                value={sketchName}
                                onChange={(e) => setSketchName(e.target.value)}
                                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 w-36"
                                placeholder="Sketch name..."
                            />

                            {/* Examples */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowExamples(!showExamples)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs font-bold"
                                >
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    Examples
                                </button>
                                {showExamples && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border z-[100] overflow-hidden">
                                        <div className="p-2.5 bg-orange-50 border-b">
                                            <p className="font-bold text-orange-800 text-sm">📚 Example Projects</p>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {EXAMPLE_TEMPLATES.map((template) => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => {
                                                        setSketchName(template.name)
                                                        setSketchId(null)
                                                        setBoardType(template.board)
                                                        setBlocksXml(template.blocksXml)
                                                        setCode(template.code)
                                                        setShowExamples(false)
                                                        stopSimulation()

                                                        // Load circuit if available
                                                        if (template.circuitData) {
                                                            circuit.importCircuit(JSON.stringify(template.circuitData))
                                                        } else {
                                                            circuit.clearCircuit()
                                                        }
                                                    }}
                                                    className="w-full p-2.5 text-left hover:bg-gray-50 border-b last:border-0 flex items-center gap-2"
                                                >
                                                    <span className="text-xl">{template.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800 text-sm">{template.name}</p>
                                                        <p className="text-xs text-gray-500">{template.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Import/Export */}
                            <button
                                onClick={importCircuit}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                title="Import Circuit"
                            >
                                <Upload className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                onClick={exportCircuit}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                title="Export Circuit"
                            >
                                <Download className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Save */}
                            <button
                                onClick={saveSketch}
                                disabled={isSaving}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-kodibot-orange hover:from-orange-600 hover:to-orange-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 shadow-lg shadow-orange-200"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>

                            {/* Publish */}
                            <button
                                onClick={togglePublish}
                                disabled={isPublishing || !sketchId}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 shadow-lg transition-all ${savedSketches.find(s => s.id === sketchId)?.published
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Globe className="w-3.5 h-3.5" />
                                {savedSketches.find(s => s.id === sketchId)?.published ? 'Published' : 'Publish'}
                            </button>

                            {/* Open */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSketchList(!showSketchList)}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold"
                                >
                                    <FolderOpen className="w-3.5 h-3.5" />
                                    Open
                                </button>
                                {showSketchList && (
                                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                                        <div className="p-2 bg-gray-50 border-b">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Saved Sketches</p>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {savedSketches.length === 0 ? (
                                                <p className="p-3 text-sm text-gray-400 text-center">No saved sketches</p>
                                            ) : (
                                                savedSketches.map((sketch) => (
                                                    <button
                                                        key={sketch.id}
                                                        onClick={() => loadSketch(sketch)}
                                                        className="w-full p-2.5 text-left hover:bg-teal-50 border-b last:border-0"
                                                    >
                                                        <p className="font-semibold text-gray-800 text-sm">{sketch.name}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {sketch.updated_at ? new Date(sketch.updated_at).toLocaleDateString() : 'Not saved'}
                                                        </p>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* New */}
                            <button
                                onClick={newSketch}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                New
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex gap-3 min-h-0">
                    {/* Circuit View Mode */}
                    {viewMode === 'circuit' && (
                        <>
                            {/* Circuit Canvas (70%) */}
                            <div className="flex-[7] flex flex-col gap-3 min-w-0">
                                <div className="flex-1 rounded-xl overflow-hidden shadow-lg relative">
                                    <WiringCanvas
                                        circuitState={circuit.state}
                                        pinStates={pinStates}
                                        onMoveArduino={circuit.moveArduino}
                                        onMoveModule={circuit.moveModule}
                                        onSelectItem={circuit.selectItem}
                                        onStartWiring={circuit.startWiring}
                                        onUpdateWiringPosition={circuit.updateWiringPosition}
                                        onCompleteWiring={circuit.completeWiring}
                                        onCancelWiring={circuit.cancelWiring}
                                        onRemoveWire={circuit.removeWire}
                                    />

                                    {/* Simulation controls overlay */}
                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        <button
                                            onClick={resetSimulation}
                                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Reset"
                                            disabled={isCompiling}
                                        >
                                            <RotateCcw className="w-4 h-4 text-white" />
                                        </button>
                                        {isCompiling ? (
                                            <button
                                                disabled
                                                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-bold cursor-not-allowed"
                                            >
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Compiling...
                                            </button>
                                        ) : !isRunning ? (
                                            <button
                                                onClick={runSimulation}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg"
                                            >
                                                <Play className="w-4 h-4" />
                                                Run
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopSimulation}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors animate-pulse"
                                            >
                                                <Square className="w-4 h-4" />
                                                Stop
                                            </button>
                                        )}

                                        {/* Load starter circuit button */}
                                        <button
                                            onClick={() => {
                                                const starterCircuit = STARTER_CIRCUITS.ledBlink
                                                circuit.importCircuit(JSON.stringify({
                                                    version: 1,
                                                    ...starterCircuit
                                                }))
                                            }}
                                            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-bold transition-colors"
                                            title="Load LED Blink Demo"
                                        >
                                            <Lightbulb className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Serial Monitor */}
                                <div className="bg-slate-900 rounded-xl overflow-hidden h-28 flex flex-col shadow-xl border border-slate-700">
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                            <span className="text-slate-300 text-xs font-bold">📟 Serial Monitor</span>
                                        </div>
                                        <button
                                            onClick={() => simulation.reset()}
                                            className="px-2 py-0.5 text-xs bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex-1 p-2 font-mono text-xs text-green-400 overflow-y-auto bg-slate-950/50">
                                        {consoleOutput.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-slate-600 text-center">
                                                <span>Output will appear here...</span>
                                            </div>
                                        ) : (
                                            consoleOutput.map((line, i) => (
                                                <div key={i} className="py-0.5 border-b border-slate-800/50">
                                                    <span className="text-slate-500 mr-2">[{i + 1}]</span>
                                                    {line}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar: Component Palette + Properties (30%) */}
                            <div className="flex-[3] flex flex-col gap-3 min-w-[240px]">
                                <div className="flex-1 overflow-hidden">
                                    <ComponentPalette
                                        onAddModule={(type: ModuleType) => circuit.addModule(type)}
                                        selectedId={circuit.state.selectedId}
                                        onDeleteSelected={circuit.deleteSelected}
                                    />
                                </div>
                                <div className="h-[280px]">
                                    <PropertiesPanel
                                        selectedId={circuit.state.selectedId}
                                        selectedType={getSelectedType()}
                                        moduleType={selectedModule?.type}
                                        properties={selectedModule?.properties as Record<string, unknown> | undefined}
                                        onUpdateProperties={(props) => {
                                            if (selectedModule) {
                                                circuit.updateModuleProperties(selectedModule.id, props)
                                            }
                                        }}
                                        onRemoveWire={() => {
                                            if (circuit.state.selectedId?.startsWith('wire_')) {
                                                circuit.removeWire(circuit.state.selectedId)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Split View Mode */}
                    {viewMode === 'split' && (
                        <>
                            {/* Left: Circuit Canvas (50%) */}
                            <div className="flex-1 flex flex-col gap-3 min-w-0">
                                <div className="flex-1 rounded-xl overflow-hidden shadow-lg relative">
                                    <WiringCanvas
                                        circuitState={circuit.state}
                                        pinStates={pinStates}
                                        onMoveArduino={circuit.moveArduino}
                                        onMoveModule={circuit.moveModule}
                                        onSelectItem={circuit.selectItem}
                                        onStartWiring={circuit.startWiring}
                                        onUpdateWiringPosition={circuit.updateWiringPosition}
                                        onCompleteWiring={circuit.completeWiring}
                                        onCancelWiring={circuit.cancelWiring}
                                        onRemoveWire={circuit.removeWire}
                                    />

                                    {/* Simulation controls overlay */}
                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        <button
                                            onClick={resetSimulation}
                                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                                            title="Reset"
                                            disabled={isCompiling}
                                        >
                                            <RotateCcw className="w-4 h-4 text-white" />
                                        </button>
                                        {isCompiling ? (
                                            <button
                                                disabled
                                                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-bold cursor-not-allowed"
                                            >
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Compiling...
                                            </button>
                                        ) : !isRunning ? (
                                            <button
                                                onClick={runSimulation}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg"
                                            >
                                                <Play className="w-4 h-4" />
                                                Run
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopSimulation}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors animate-pulse"
                                            >
                                                <Square className="w-4 h-4" />
                                                Stop
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Serial Monitor (compact) */}
                                <div className="bg-slate-900 rounded-xl overflow-hidden h-24 flex flex-col shadow-xl border border-slate-700">
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                            <span className="text-slate-300 text-xs font-bold">📟 Serial</span>
                                        </div>
                                        <button
                                            onClick={() => simulation.reset()}
                                            className="px-2 py-0.5 text-xs bg-slate-600 hover:bg-slate-500 text-slate-200 rounded"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="flex-1 p-2 font-mono text-xs text-green-400 overflow-y-auto bg-slate-950/50">
                                        {consoleOutput.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-slate-600 text-center text-[10px]">
                                                Output will appear here...
                                            </div>
                                        ) : (
                                            consoleOutput.slice(-5).map((line, i) => (
                                                <div key={i} className="py-0.5 truncate">{line}</div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Code Editor (50%) */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                                    {/* Tabs */}
                                    <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5">
                                        <div className="flex">
                                            <button
                                                onClick={() => setActiveTab('blocks')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'blocks' ? 'bg-white text-kodibot-orange shadow' : 'text-gray-600 hover:text-gray-800'}`}
                                            >
                                                <Puzzle className="w-3.5 h-3.5" />
                                                Blocks
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('code')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'code' ? 'bg-white text-kodibot-orange shadow' : 'text-gray-600 hover:text-gray-800'}`}
                                            >
                                                <Code className="w-3.5 h-3.5" />
                                                Code
                                            </button>
                                        </div>
                                        <span className="text-xs text-gray-500">{board.name}</span>
                                    </div>

                                    {/* Editor Content */}
                                    <div className="flex-1 min-h-0">
                                        {activeTab === 'blocks' ? (
                                            <BlocklyWorkspace
                                                className="w-full h-full"
                                                toolboxConfiguration={arduinoToolbox}
                                                workspaceConfiguration={workspaceConfiguration}
                                                initialXml={blocksXml}
                                                onWorkspaceChange={handleWorkspaceChange}
                                            />
                                        ) : (
                                            <div className="h-full flex flex-col">
                                                <div className="bg-gray-800 px-3 py-1.5 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                                        <span className="ml-2 text-gray-400 text-xs font-mono">{sketchName}.ino</span>
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-3 resize-none focus:outline-none"
                                                    spellCheck={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Code Only Mode */}
                    {viewMode === 'code' && (
                        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                            {/* Tabs */}
                            <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('blocks')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'blocks' ? 'bg-white text-kodibot-orange shadow' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        <Puzzle className="w-3.5 h-3.5" />
                                        Blocks
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('code')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === 'code' ? 'bg-white text-kodibot-orange shadow' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        <Code className="w-3.5 h-3.5" />
                                        Code
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500">{board.name}</span>
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 min-h-0">
                                {activeTab === 'blocks' ? (
                                    <BlocklyWorkspace
                                        className="w-full h-full"
                                        toolboxConfiguration={arduinoToolbox}
                                        workspaceConfiguration={workspaceConfiguration}
                                        initialXml={blocksXml}
                                        onWorkspaceChange={handleWorkspaceChange}
                                    />
                                ) : (
                                    <div className="h-full flex flex-col">
                                        <div className="bg-gray-800 px-3 py-1.5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                                <span className="ml-2 text-gray-400 text-xs font-mono">{sketchName}.ino</span>
                                            </div>
                                        </div>
                                        <textarea
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-3 resize-none focus:outline-none"
                                            spellCheck={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    )
}
