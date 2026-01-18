import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
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
} from '@/components/ArduinoBlockly/ArduinoConfig'

// Initialize Arduino blocks and generator
defineArduinoBlocks()
const generatorHelpers = configureArduinoGenerator()

interface ArduinoSketch {
    id: string | null
    name: string
    code: string
    board_type?: string
    modules?: ModuleInstance[]
    blocks_xml?: string
    updated_at?: string
    published?: boolean
    published_at?: string
}

interface Props {
    sketches: ArduinoSketch[]
    currentSketch: ArduinoSketch
}

export default function ArduinoPlaygroundIndex({ sketches, currentSketch }: Props) {
    const { t } = useTranslation()
    // State
    const [activeTab, setActiveTab] = useState<'blocks' | 'code'>('blocks')
    const [code, setCode] = useState(currentSketch.code)
    const [sketchName, setSketchName] = useState(currentSketch.name)
    const [sketchId, setSketchId] = useState<string | null>(currentSketch.id)
    const [blocksXml, setBlocksXml] = useState(currentSketch.blocks_xml || '')
    const [boardType, setBoardType] = useState<BoardType>((currentSketch.board_type as BoardType) || 'uno')
    const [modules, setModules] = useState<ModuleInstance[]>(currentSketch.modules || [])

    const [isRunning, setIsRunning] = useState(false)
    const [ledStates, setLedStates] = useState<Record<number, boolean>>({})
    const [servoAngles] = useState<Record<number, number>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [savedSketches, setSavedSketches] = useState<ArduinoSketch[]>(sketches)

    const [showSketchList, setShowSketchList] = useState(false)
    const [showBoardMenu, setShowBoardMenu] = useState(false)
    const [showModuleMenu, setShowModuleMenu] = useState(false)
    const [showExamples, setShowExamples] = useState(false)
    const [consoleOutput, setConsoleOutput] = useState<string[]>([])

    const runnerRef = useRef<number | null>(null)
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

    const board = ARDUINO_BOARDS[boardType]

    const addConsoleLog = useCallback((message: string) => {
        setConsoleOutput((prev) => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${message}`])
    }, [])

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

    // Simulation
    const runSimulation = useCallback(() => {
        if (isRunning) return

        setConsoleOutput([])
        addConsoleLog('🚀 Starting simulation...')
        addConsoleLog(`📟 Board: ${board.name}`)
        addConsoleLog(`🔌 Modules: ${modules.length}`)

        // Parse delay from code
        const delayMatch = code.match(/delay\s*\(\s*(\d+)\s*\)/)
        const delayMs = delayMatch ? parseInt(delayMatch[1], 10) : 1000

        setIsRunning(true)
        addConsoleLog('✅ Simulation running!')

        // Simulate LED blink for all LED modules
        const ledModules = modules.filter((m) => m.type === 'led' || m.type === 'rgb_led')
        let ledState = false

        const blinkInterval = setInterval(() => {
            ledState = !ledState
            const newStates: Record<number, boolean> = {}
            ledModules.forEach((m) => {
                newStates[m.pin as number] = ledState
            })
            // Also include pin 13 as default
            newStates[13] = ledState
            setLedStates(newStates)
            addConsoleLog(`💡 LEDs: ${ledState ? 'ON' : 'OFF'}`)
        }, delayMs)

        runnerRef.current = blinkInterval as unknown as number
    }, [isRunning, code, modules, board.name, addConsoleLog])

    const stopSimulation = useCallback(() => {
        if (runnerRef.current) {
            clearInterval(runnerRef.current)
            runnerRef.current = null
        }
        setIsRunning(false)
        setLedStates({})
        addConsoleLog('⏹️ Simulation stopped')
    }, [addConsoleLog])

    const resetSimulation = useCallback(() => {
        stopSimulation()
        setConsoleOutput([])
        addConsoleLog('🔄 Reset complete')
    }, [stopSimulation, addConsoleLog])

    // Add module
    const addModule = (type: ModuleType) => {
        const moduleConfig = ARDUINO_MODULES[type]
        const newModule: ModuleInstance = {
            id: `${type}_${Date.now()}`,
            type,
            pin: moduleConfig.defaultPin,
            name: moduleConfig.name,
        }
        setModules([...modules, newModule])
        setShowModuleMenu(false)
        addConsoleLog(`➕ Added ${moduleConfig.name}`)
    }

    const removeModule = (id: string) => {
        setModules(modules.filter((m) => m.id !== id))
        addConsoleLog('➖ Module removed')
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
        addConsoleLog(`📂 Loaded template: ${template.name}`)

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
                const response = await fetch(`/student/arduino_sketches/${sketchId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken || '' },
                    body: JSON.stringify(payload),
                })
                if (response.ok) {
                    const updated = await response.json()
                    setSavedSketches((prev) => prev.map((s) => (s.id === sketchId ? updated : s)))
                    addConsoleLog(`💾 Saved: ${sketchName}`)
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
                    addConsoleLog(`💾 Created: ${sketchName}`)
                }
            }
        } catch (error) {
            console.error('Save error:', error)
            addConsoleLog('❌ Save failed')
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
        addConsoleLog(`📂 Loaded: ${sketch.name}`)
    }

    // Publish sketch
    const togglePublish = async () => {
        if (!sketchId) {
            addConsoleLog('⚠️ Please save the sketch first')
            return
        }

        setIsPublishing(true)
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            const currentSketch = savedSketches.find(s => s.id === sketchId)
            const isPublished = currentSketch?.published

            const endpoint = `/student/arduino_sketches/${sketchId}/${isPublished ? 'unpublish' : 'publish'}`

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken || '' },
            })

            if (response.ok) {
                const updated = await response.json()
                setSavedSketches((prev) => prev.map((s) => (s.id === sketchId ? updated : s)))
                addConsoleLog(isPublished ? '🔓 Unpublished sketch' : '🌍 Published to Community!')
            } else {
                throw new Error('Failed to update publish status')
            }
        } catch (error) {
            console.error('Publish error:', error)
            addConsoleLog('❌ Publish failed')
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

    // Cleanup
    useEffect(() => {
        return () => {
            if (runnerRef.current) clearInterval(runnerRef.current)
        }
    }, [])

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
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg"
                                        title="Reset"
                                    >
                                        <RotateCcw className="w-4 h-4 text-white" />
                                    </button>
                                    {!isRunning ? (
                                        <button
                                            onClick={runSimulation}
                                            className="flex items-center gap-2 px-4 py-2 bg-white text-kodibot-orange hover:bg-orange-50 rounded-lg text-sm font-bold"
                                        >
                                            <Play className="w-4 h-4" />
                                            {t('arduino.run', { defaultValue: 'Run' })}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopSimulation}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-bold"
                                        >
                                            <Square className="w-4 h-4" />
                                            {t('arduino.stop', { defaultValue: 'Stop' })}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Board Visualization */}
                            <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-4 flex flex-col items-center justify-center gap-4 overflow-y-auto">
                                {/* Arduino Board */}
                                <div
                                    className="bg-[#087A9A] rounded-lg p-3 shadow-xl relative"
                                    style={{ width: '200px', height: '130px' }}
                                >
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(Math.min(board.digitalPins, 14))].map((_, i) => (
                                            <div key={i} className="w-2 h-4 bg-gray-800 rounded-t" />
                                        ))}
                                    </div>
                                    <div className="bg-gray-900 rounded mx-auto w-16 h-10 flex items-center justify-center">
                                        <span className="text-white text-[8px] font-bold">ATmega</span>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2 pr-2">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-3 h-3 rounded-full transition-all ${ledStates[13] ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-gray-600'
                                                    }`}
                                            />
                                            <span className="text-white text-[8px]">L</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            <span className="text-white text-[8px]">ON</span>
                                        </div>
                                    </div>
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-400 rounded-l" />
                                </div>

                                {/* Connected Modules */}
                                {modules.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {modules.map((module) => {
                                            const config = ARDUINO_MODULES[module.type]
                                            return (
                                                <div
                                                    key={module.id}
                                                    className="bg-white rounded-xl p-2 shadow-lg flex flex-col items-center min-w-[60px] relative group"
                                                    style={{ borderTop: `3px solid ${config.color}` }}
                                                >
                                                    <span className="text-2xl">{config.icon}</span>
                                                    <span className="text-[10px] font-bold text-gray-600">Pin {module.pin}</span>
                                                    {module.type === 'led' && (
                                                        <div
                                                            className={`w-4 h-4 rounded-full mt-1 transition-all ${ledStates[module.pin as number]
                                                                ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                                                                : 'bg-gray-300'
                                                                }`}
                                                        />
                                                    )}
                                                    {module.type === 'servo' && (
                                                        <div
                                                            className="w-6 h-1 bg-gray-700 mt-1 origin-left transition-transform"
                                                            style={{ transform: `rotate(${servoAngles[module.pin as number] || 90}deg)` }}
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => removeModule(module.id)}
                                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
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
                                        className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 rounded-lg text-sm font-medium shadow border border-dashed border-orange-300 text-orange-600"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {t('arduino.add_component', { defaultValue: 'Add Component' })}
                                    </button>
                                    {showModuleMenu && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                                            <div className="p-2 bg-orange-50 border-b">
                                                <p className="text-xs font-bold text-orange-600 uppercase">{t('arduino.components', { defaultValue: 'Components' })}</p>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-1 p-2">
                                                {Object.entries(ARDUINO_MODULES).map(([key, m]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => addModule(key as ModuleType)}
                                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-left"
                                                    >
                                                        <span className="text-xl">{m.icon}</span>
                                                        <span className="text-xs font-medium">{m.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Serial Monitor */}
                        <div className="bg-gray-900 rounded-2xl overflow-hidden h-36 flex flex-col shadow-xl">
                            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                <span className="text-gray-400 text-sm font-mono">{t('arduino.serial_monitor', { defaultValue: 'Serial Monitor' })}</span>
                            </div>
                            <div className="flex-1 p-3 font-mono text-xs text-green-400 overflow-y-auto">
                                {consoleOutput.length === 0 ? (
                                    <span className="text-gray-600">{t('arduino.output_placeholder', { defaultValue: '// Output will appear here...' })}</span>
                                ) : (
                                    consoleOutput.map((line, i) => (
                                        <div key={i} className="leading-relaxed">
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
