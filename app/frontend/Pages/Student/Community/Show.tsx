import { Head, Link } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { useTranslation } from '@/hooks/useTranslation'
import {
    ArrowLeft,
    Zap,
    RotateCcw,
    Play,
    Square,
    Code,
    Puzzle,
    User,
    Calendar,
    Eye
} from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import { defineArduinoBlocks } from '@/components/ArduinoBlockly/ArduinoBlocks'
import { arduinoToolbox } from '@/components/ArduinoBlockly/ArduinoToolbox'
import {
    ARDUINO_BOARDS,
    ARDUINO_MODULES,
    BoardType,
    ModuleInstance,
} from '@/components/ArduinoBlockly/ArduinoConfig'

// Initialize Arduino blocks
defineArduinoBlocks()


interface ArduinoSketch {
    id: string
    name: string
    code: string
    board_type: string
    modules: ModuleInstance[]
    blocks_xml: string
    published_at: string
}

interface Author {
    name: string
    avatar?: string
}

interface Props {
    sketch: ArduinoSketch
    author: Author
}

export default function CommunityShow({ sketch, author }: Props) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<'blocks' | 'code'>('blocks')
    const [isRunning, setIsRunning] = useState(false)
    const [ledStates, setLedStates] = useState<Record<number, boolean>>({})
    const [consoleOutput, setConsoleOutput] = useState<string[]>([])

    const runnerRef = useRef<number | null>(null)

    const board = ARDUINO_BOARDS[sketch.board_type as BoardType] || ARDUINO_BOARDS.uno
    const modules = sketch.modules || []

    // Read-only configuration
    const workspaceConfiguration = {
        grid: { spacing: 20, length: 3, colour: '#e5e7eb', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3 },
        readOnly: true,
        trashcan: false,
    }

    const addConsoleLog = useCallback((message: string) => {
        setConsoleOutput((prev) => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${message}`])
    }, [])

    // Simulation
    const runSimulation = useCallback(() => {
        if (isRunning) return

        setConsoleOutput([])
        addConsoleLog('🚀 Starting simulation...')
        addConsoleLog(`📟 Board: ${board.name}`)
        addConsoleLog(`🔌 Modules: ${modules.length}`)

        // Parse delay from code
        const delayMatch = sketch.code.match(/delay\s*\(\s*(\d+)\s*\)/)
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
    }, [isRunning, sketch.code, modules, board.name, addConsoleLog])

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

    // Cleanup
    useEffect(() => {
        return () => {
            if (runnerRef.current) clearInterval(runnerRef.current)
        }
    }, [])

    return (
        <StudentLayout>
            <Head title={`${sketch.name} - Community`} />

            <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/student/community"
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl font-black text-gray-900">{sketch.name}</h1>
                                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase">Read Only</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(sketch.published_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600">Viewing Mode</span>
                        </div>
                    </div>
                </div>

                {/* Workspace */}
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
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 min-h-0 relative">
                            {/* Overlay for read-only hint */}
                            {activeTab === 'blocks' && (
                                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow border border-gray-200 text-xs font-medium text-gray-500 pointer-events-none">
                                    Read Only
                                </div>
                            )}

                            {activeTab === 'blocks' ? (
                                <BlocklyWorkspace
                                    className="w-full h-full"
                                    toolboxConfiguration={arduinoToolbox}
                                    workspaceConfiguration={workspaceConfiguration}
                                    initialXml={sketch.blocks_xml}
                                    onWorkspaceChange={() => { }} // No-op
                                />
                            ) : (
                                <div className="h-full flex flex-col">
                                    <textarea
                                        value={sketch.code}
                                        readOnly
                                        className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Simulation */}
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

                            {/* Board Visualization (Same as Playground) */}
                            <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-4 flex flex-col items-center justify-center gap-4 overflow-y-auto">
                                {/* Board & Modules Rendering - Simplified duplication for now */}
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
                                            <div className={`w-3 h-3 rounded-full transition-all ${ledStates[13] ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-gray-600'}`} />
                                            <span className="text-white text-[8px]">L</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            <span className="text-white text-[8px]">ON</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modules */}
                                {modules.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {modules.map((module) => {
                                            const config = ARDUINO_MODULES[module.type]
                                            return (
                                                <div
                                                    key={module.id}
                                                    className="bg-white rounded-xl p-2 shadow-lg flex flex-col items-center min-w-[60px] relative"
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
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
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
