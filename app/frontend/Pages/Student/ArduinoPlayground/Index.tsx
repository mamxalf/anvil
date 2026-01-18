/// <reference path="../../../types/wokwi-elements.d.ts" />
// Reference required for custom element types to be picked up by TS
import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { useState, useRef, useCallback } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useArduinoSimulation } from '@/hooks/useArduinoSimulation'
import {
    Play,
    Square,
    Save,
    FolderOpen,
    Plus,
    Cpu,
    Zap,
    RotateCcw,
    Code,
    Puzzle,
    ChevronDown,
    Lightbulb,
    Download,
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
    ARDUINO_MODULES,
    EXAMPLE_TEMPLATES,
    BoardType,
    ModuleType,
    ModuleInstance,
    ExampleTemplate,
    ArduinoSketch,
} from '@/components/ArduinoBlockly/ArduinoConfig'

// Import Wokwi elements (registers custom elements)
import '@wokwi/elements'

// Initialize Arduino blocks and generator
defineArduinoBlocks()
const generatorHelpers = configureArduinoGenerator()



interface Props {
    sketches: ArduinoSketch[]
    currentSketch: ArduinoSketch
}

export default function ArduinoPlaygroundIndex({ sketches, currentSketch }: Props) {
    const { t } = useTranslation()

    // Arduino simulation hook
    const simulation = useArduinoSimulation()

    // State
    const [activeTab, setActiveTab] = useState<'blocks' | 'code'>('blocks')
    const [code, setCode] = useState(currentSketch.code)
    const [sketchName, setSketchName] = useState(currentSketch.name)
    const [sketchId, setSketchId] = useState<string | null>(currentSketch.id)
    const [blocksXml, setBlocksXml] = useState(currentSketch.blocks_xml || '')
    const [boardType, setBoardType] = useState<BoardType>((currentSketch.board_type as BoardType) || 'uno')
    const [modules, setModules] = useState<ModuleInstance[]>(currentSketch.modules || [])

    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [savedSketches, setSavedSketches] = useState<ArduinoSketch[]>(sketches)

    const [showSketchList, setShowSketchList] = useState(false)
    const [showBoardMenu, setShowBoardMenu] = useState(false)
    const [showModuleMenu, setShowModuleMenu] = useState(false)
    const [showExamples, setShowExamples] = useState(false)

    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

    const board = ARDUINO_BOARDS[boardType]

    // Derive states from simulation
    const isRunning = simulation.state.isRunning
    const isCompiling = simulation.state.isCompiling
    const ledStates = simulation.state.pinStates
    const consoleOutput = simulation.state.serialOutput

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

            // Combine includes, globals, and generated code
            let fullCode = ''
            if (includes) fullCode += includes + '\n\n'
            if (globals) fullCode += globals + '\n\n'
            fullCode += generatedCode

            setCode(fullCode || '// Empty sketch')

            // Save XML state
            const xml = Blockly.Xml.workspaceToDom(workspace)
            const xmlText = Blockly.Xml.domToText(xml)
            setBlocksXml(xmlText)
        },
        [generatorHelpers]
    )

    // Simulation using avr8js
    const runSimulation = useCallback(async () => {
        if (isRunning || isCompiling) return

        // Compile first, then run
        const success = await simulation.compile(code, boardType)
        if (success) {
            simulation.run()
        }
    }, [isRunning, isCompiling, code, boardType, simulation])

    const stopSimulation = useCallback(() => {
        simulation.stop()
    }, [simulation])

    const resetSimulation = useCallback(() => {
        simulation.reset()
    }, [simulation])

    // Add module
    const addModule = (type: ModuleType) => {
        const moduleConfig = ARDUINO_MODULES[type]
        const newModule: ModuleInstance = {
            id: `${type}_${Date.now()} `,
            type,
            pin: moduleConfig.defaultPin,
            name: moduleConfig.name,
        }
        setModules([...modules, newModule])
        setShowModuleMenu(false)
    }

    const removeModule = (id: string) => {
        setModules(modules.filter((m) => m.id !== id))
    }

    // Load example template
    const loadTemplate = (template: ExampleTemplate) => {
        setSketchName(template.name)
        setSketchId(null)
        setBoardType(template.board)
        setModules(template.modules)
        setBlocksXml(template.blocksXml)
        setCode(template.code)
        setShowExamples(false)
        stopSimulation()

        // Load blocks into workspace
        if (workspaceRef.current && template.blocksXml) {
            workspaceRef.current.clear()
            const xml = Blockly.utils.xml.textToDom(template.blocksXml)
            Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
        }
    }

    // Save sketch
    const saveSketch = async () => {
        if (!code.trim() || !sketchName.trim()) return

        setIsSaving(true)
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            const payload = {
                arduino_sketch: {
                    name: sketchName,
                    code,
                    board_type: boardType,
                    modules,
                    blocks_xml: blocksXml,
                },
            }

            if (sketchId) {
                const response = await fetch(`/ student / arduino_sketches / ${sketchId} `, {
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
        setModules(sketch.modules || [])
        setBlocksXml(sketch.blocks_xml || '')
        setShowSketchList(false)
        stopSimulation()
    }

    // Publish sketch
    const togglePublish = async () => {
        if (!sketchId) return

        setIsPublishing(true)
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            const currentSketchData = savedSketches.find(s => s.id === sketchId)
            const isPublished = currentSketchData?.published

            const endpoint = `/ student / arduino_sketches / ${sketchId}/${isPublished ? 'unpublish' : 'publish'}`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken || '' },
            })

            if (response.ok) {
                const updated = await response.json()
                setSavedSketches((prev) => prev.map((s) => (s.id === sketchId ? updated : s)))
            } else {
                throw new Error('Failed to update publish status')
            }
        } catch (error) {
            console.error('Publish error:', error)
        } finally {
            setIsPublishing(false)
        }
    }

    // New sketch
    const newSketch = () => {
        const emptyTemplate = EXAMPLE_TEMPLATES.find((t) => t.id === 'empty')
        if (emptyTemplate) {
            loadTemplate(emptyTemplate)
        }
        setSketchName('New Sketch')
    }

    // Servo angles (placeholder for future implementation)
    const servoAngles: Record<number, number> = {}

    return (
        <StudentLayout>
            <Head title={t('arduino.title', { defaultValue: 'Arduino Playground' })} />

            <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg shadow-orange-100/50 p-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Title & Board Selector */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-orange-500 to-kodibot-orange p-2.5 rounded-xl shadow-lg shadow-orange-200">
                                    <Cpu className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-gray-900">{t('arduino.title', { defaultValue: 'Arduino Playground' })}</h1>
                                    <p className="text-sm text-gray-500">{t('arduino.subtitle', { defaultValue: 'Visual Block Programming' })}</p>
                                </div>
                            </div>

                            {/* Board Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowBoardMenu(!showBoardMenu)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <span className="text-lg">{board.image}</span>
                                    <span>{board.name}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {showBoardMenu && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                                        {Object.entries(ARDUINO_BOARDS).map(([key, b]) => (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    setBoardType(key as BoardType)
                                                    setShowBoardMenu(false)
                                                }}
                                                className={`w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 ${boardType === key ? 'bg-orange-50' : ''
                                                    }`}
                                            >
                                                <span className="text-2xl">{b.image}</span>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{b.name}</p>
                                                    <p className="text-xs text-gray-500">{b.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <input
                                type="text"
                                value={sketchName}
                                onChange={(e) => setSketchName(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 w-40"
                                placeholder={t('arduino.saved_sketches', { defaultValue: 'Sketch name...' })}
                            />

                            {/* Examples Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowExamples(!showExamples)}
                                    className="flex items-center gap-2 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-bold"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    {t('arduino.examples', { defaultValue: 'Examples' })}
                                </button>
                                {showExamples && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                                        <div className="p-3 bg-orange-50 border-b">
                                            <p className="font-bold text-orange-800">📚 {t('arduino.example_projects', { defaultValue: 'Example Projects' })}</p>
                                            <p className="text-xs text-orange-600">{t('arduino.choose_example', { defaultValue: 'Choose an example to get started' })}</p>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {EXAMPLE_TEMPLATES.map((template) => (
                                                <button
                                                    key={template.id}
                                                    onClick={() => loadTemplate(template)}
                                                    className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-0 flex items-center gap-3"
                                                >
                                                    <span className="text-2xl">{template.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">{template.name}</p>
                                                        <p className="text-xs text-gray-500">{template.description}</p>
                                                    </div>
                                                    <span
                                                        className={`text-xs px-2 py-0.5 rounded-full ${template.difficulty === 'easy'
                                                            ? 'bg-green-100 text-green-700'
                                                            : template.difficulty === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        {t(`arduino.difficulty.${template.difficulty}`, { defaultValue: template.difficulty })}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={saveSketch}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-kodibot-orange hover:from-orange-600 hover:to-orange-500 text-white rounded-lg text-sm font-bold disabled:opacity-50 shadow-lg shadow-orange-200"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? t('arduino.saving', { defaultValue: 'Saving...' }) : t('arduino.save', { defaultValue: 'Save' })}
                            </button>

                            <button
                                onClick={togglePublish}
                                disabled={isPublishing || !sketchId}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 shadow-lg transition-all ${savedSketches.find(s => s.id === sketchId)?.published
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200 hover:from-green-600 hover:to-emerald-600'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }`}
                                title={!sketchId ? t('arduino.save_before_publish', { defaultValue: 'Save first to publish' }) : ''}
                            >
                                <Globe className="w-4 h-4" />
                                {isPublishing
                                    ? t('arduino.processing', { defaultValue: '...' })
                                    : savedSketches.find(s => s.id === sketchId)?.published
                                        ? t('arduino.published', { defaultValue: 'Published' })
                                        : t('arduino.publish', { defaultValue: 'Publish' })
                                }
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowSketchList(!showSketchList)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold"
                                >
                                    <FolderOpen className="w-4 h-4" />
                                    {t('arduino.open', { defaultValue: 'Open' })}
                                </button>
                                {showSketchList && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                                        <div className="p-2 bg-gray-50 border-b">
                                            <p className="text-xs font-bold text-gray-500 uppercase">{t('arduino.saved_sketches', { defaultValue: 'Saved Sketches' })}</p>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {savedSketches.length === 0 ? (
                                                <p className="p-4 text-sm text-gray-400 text-center">{t('arduino.no_saved', { defaultValue: 'No saved sketches' })}</p>
                                            ) : (
                                                savedSketches.map((sketch) => (
                                                    <button
                                                        key={sketch.id}
                                                        onClick={() => loadSketch(sketch)}
                                                        className="w-full p-3 text-left hover:bg-teal-50 border-b last:border-0"
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

                            <button
                                onClick={newSketch}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                {t('arduino.new', { defaultValue: 'New' })}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                    {/* Left Panel: Editor (Blocks/Code) */}
                    <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Tabs */}
                        <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('blocks')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'blocks' ? 'bg-white text-kodibot-orange shadow' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Puzzle className="w-4 h-4" />
                                    {t('arduino.blocks', { defaultValue: 'Blocks' })}
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'code' ? 'bg-white text-kodibot-orange shadow' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Code className="w-4 h-4" />
                                    {t('arduino.code', { defaultValue: 'Code' })}
                                </button>
                            </div>
                            <span className="text-xs text-gray-500">{board.name} • {board.digitalPins} {t('arduino.pins', { defaultValue: 'pins' })}</span>
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
                                    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="ml-3 text-gray-400 text-sm font-mono">{sketchName}.ino</span>
                                        </div>
                                        <button className="text-gray-400 hover:text-white p-1">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Simulation & Modules */}
                    <div className="flex flex-col gap-4 min-h-0">
                        {/* Circuit Visualization */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">
                            <div className="bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <Zap className="w-5 h-5" />
                                    <span className="font-bold">{t('arduino.circuit', { defaultValue: 'Circuit' })}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetSimulation}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
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
                                            {t('arduino.compiling', { defaultValue: 'Compiling...' })}
                                        </button>
                                    ) : !isRunning ? (
                                        <button
                                            onClick={runSimulation}
                                            className="flex items-center gap-2 px-4 py-2 bg-white text-kodibot-orange hover:bg-orange-50 rounded-lg text-sm font-bold transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            <Play className="w-4 h-4" />
                                            {t('arduino.run', { defaultValue: 'Run' })}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopSimulation}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-bold transition-colors animate-pulse"
                                        >
                                            <Square className="w-4 h-4" />
                                            {t('arduino.stop', { defaultValue: 'Stop' })}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Board Visualization */}
                            <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col items-center justify-center gap-6 overflow-y-auto">
                                {/* Wokwi Arduino Board */}
                                <div className="relative">
                                    <wokwi-arduino-uno
                                        led13={ledStates[13] ? 'high' : 'low'}
                                        ledPower="high"
                                    />
                                    {/* Status Indicator */}
                                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${isRunning
                                        ? 'bg-green-500 text-white animate-pulse'
                                        : isCompiling
                                            ? 'bg-yellow-500 text-yellow-900'
                                            : 'bg-gray-600 text-gray-300'
                                        }`}>
                                        {isRunning ? '▶ Running' : isCompiling ? '⚙ Compiling' : '⏸ Stopped'}
                                    </div>
                                </div>

                                {/* Connected Modules with Wokwi Elements */}
                                {modules.length > 0 && (
                                    <div className="flex flex-wrap gap-4 justify-center p-4 bg-slate-700/50 rounded-xl">
                                        {modules.map((module) => {
                                            const config = ARDUINO_MODULES[module.type]
                                            return (
                                                <div
                                                    key={module.id}
                                                    className="bg-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center min-w-[80px] relative group border border-slate-600"
                                                >
                                                    {/* Render Wokwi element based on module type */}
                                                    {module.type === 'led' && (
                                                        <wokwi-led
                                                            color="red"
                                                            value={ledStates[module.pin as number] || false}
                                                        />
                                                    )}
                                                    {module.type === 'rgb_led' && (
                                                        <wokwi-rgb-led r={0} g={0} b={0} />
                                                    )}
                                                    {module.type === 'servo' && (
                                                        <wokwi-servo angle={servoAngles[module.pin as number] || 90} />
                                                    )}
                                                    {module.type === 'button' && (
                                                        <wokwi-pushbutton color="red" />
                                                    )}
                                                    {module.type === 'buzzer' && (
                                                        <wokwi-buzzer hasSignal={false} />
                                                    )}
                                                    {module.type === 'potentiometer' && (
                                                        <span className="text-3xl">🎛️</span>
                                                    )}
                                                    {module.type === 'lcd' && (
                                                        <wokwi-lcd1602 text="Hello World!" backlight={true} />
                                                    )}
                                                    {module.type === 'ultrasonic' && (
                                                        <span className="text-3xl">📡</span>
                                                    )}
                                                    {module.type === 'dht11' && (
                                                        <span className="text-3xl">🌡️</span>
                                                    )}

                                                    <span className="text-xs font-bold text-slate-300 mt-2">Pin {module.pin}</span>
                                                    <span className="text-[10px] text-slate-400">{config.name}</span>

                                                    <button
                                                        onClick={() => removeModule(module.id)}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Add Module Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowModuleMenu(!showModuleMenu)}
                                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all text-white"
                                    >
                                        <Plus className="w-5 h-5" />
                                        {t('arduino.add_component', { defaultValue: 'Add Component' })}
                                    </button>
                                    {showModuleMenu && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-600 z-50 overflow-hidden">
                                            <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500">
                                                <p className="text-sm font-bold text-white">🔧 {t('arduino.components', { defaultValue: 'Components' })}</p>
                                            </div>
                                            <div className="max-h-56 overflow-y-auto grid grid-cols-2 gap-2 p-3">
                                                {Object.entries(ARDUINO_MODULES).map(([key, m]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => addModule(key as ModuleType)}
                                                        className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors"
                                                    >
                                                        <span className="text-2xl">{m.icon}</span>
                                                        <span className="text-xs font-medium text-white">{m.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Serial Monitor */}
                        <div className="bg-slate-900 rounded-2xl overflow-hidden h-44 flex flex-col shadow-xl border border-slate-700">
                            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
                                    <span className="text-slate-300 text-sm font-bold">📟 {t('arduino.serial_monitor', { defaultValue: 'Serial Monitor' })}</span>
                                </div>
                                <button
                                    onClick={() => simulation.reset()}
                                    className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg transition-colors"
                                >
                                    🗑️ Clear
                                </button>
                            </div>
                            <div className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto bg-slate-950/50">
                                {consoleOutput.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                        <span className="text-2xl mb-2">💬</span>
                                        <span>{t('arduino.output_placeholder', { defaultValue: 'Output will appear here...' })}</span>
                                    </div>
                                ) : (
                                    consoleOutput.map((line, i) => (
                                        <div key={i} className="leading-relaxed py-0.5 border-b border-slate-800/50">
                                            <span className="text-slate-500 text-xs mr-2">[{i + 1}]</span>
                                            {line}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    )
}
