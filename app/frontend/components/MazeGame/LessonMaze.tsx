/**
 * LessonMaze - Main container component for code.org-style maze lessons
 * Uses MazeEngine (same as playground) for consistent behavior
 * 3-column layout: Canvas | Blockly | MaterialPanel
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Play, RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlocklyWorkspace } from 'react-blockly'
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

import { MazeEngine } from './MazeEngine'
import { MazeInterpreter } from './MazeInterpreter'
import { getLevelConfig } from './MazeLevels'
import { createMazeToolbox } from './MazeToolbox'
import { MaterialPanel } from './MaterialPanel'
import { CompletionModal } from './CompletionModal'
import { HintTooltip } from './HintTooltip'
import { useMazeTracker } from '@/hooks/useMazeTracker'
import { useSmartHints } from '@/hooks/useSmartHints'
import { completeAttempt } from '@/lib/api'
import { defineCustomBlocks } from '@/components/Blockly/CustomBlocks'
import { configureGenerator } from '@/components/Blockly/Generator'
import { ResultType, MAZE_WIDTH, MAZE_HEIGHT, DirectionType, LevelMap, LevelConfig } from './MazeTypes'
import { useTranslation } from '@/hooks/useTranslation'

// Initialize Blockly blocks
defineCustomBlocks()
configureGenerator()

// Database activity_config format
interface ActivityConfig {
    maze_level?: number
    // Full config fields (when maze_level is not used)
    map?: number[][]
    blocks?: string[]
    max_blocks?: number
    initial_direction?: string
    collectibles_count?: number
}

interface LessonMazeProps {
    lessonId: string
    activityConfig: ActivityConfig
    lessonContent: string
    videoUrl?: string
    onComplete: (stars: number) => void
}


export function LessonMaze({
    lessonId,
    activityConfig,
    lessonContent,
    videoUrl,
    onComplete
}: LessonMazeProps) {
    const { t } = useTranslation()

    // Panel states
    const [materialExpanded, setMaterialExpanded] = useState(true)

    // Game states
    const [isRunning, setIsRunning] = useState(false)
    const [code, setCode] = useState('')
    const [blockCount, setBlockCount] = useState(0)

    // Completion states
    const [showCompletion, setShowCompletion] = useState(false)
    const [earnedStars, setEarnedStars] = useState(0)
    const [earnedXp, setEarnedXp] = useState(0)
    const [error, setError] = useState<string | null>(null)

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<MazeEngine | null>(null)
    const interpreterRef = useRef<MazeInterpreter | null>(null)

    // Hooks
    const { attempt, updateAttempt, immediateSync } = useMazeTracker(lessonId)
    const { visibleHint, dismissHint } = useSmartHints(lessonId, attempt)

    // Get level config - either from database or from MazeLevels.ts
    const levelConfig = useMemo(() => {
        if (activityConfig.map) {
            // Full config from database
            const directionMap: Record<string, DirectionType> = {
                'NORTH': DirectionType.NORTH,
                'EAST': DirectionType.EAST,
                'SOUTH': DirectionType.SOUTH,
                'WEST': DirectionType.WEST,
            }
            return {
                level: activityConfig.maze_level || 0,
                map: activityConfig.map as LevelMap,
                blocks: activityConfig.blocks || ['maze_forward'],
                maxBlocks: activityConfig.max_blocks ?? Infinity,
                initialDirection: directionMap[activityConfig.initial_direction || 'EAST'] ?? DirectionType.EAST,
                collectiblesCount: activityConfig.collectibles_count || 0,
            } as LevelConfig
        } else {
            // Level number from database, config from MazeLevels.ts
            return getLevelConfig(activityConfig.maze_level || 1)
        }
    }, [activityConfig])

    const toolbox = createMazeToolbox(levelConfig, t)


    const workspaceConfig = {
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true,
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2,
        },
        trashcan: true,
        maxBlocks: levelConfig.maxBlocks === Infinity ? undefined : levelConfig.maxBlocks,
    }

    // Handle Game Completion from Engine
    const handleGameComplete = useCallback(async (resultType: ResultType) => {
        setIsRunning(false)

        if (resultType === ResultType.SUCCESS) {
            // Always show completion modal
            setShowCompletion(true)

            // Try to sync and complete attempt if available
            if (attempt) {
                try {
                    await immediateSync()
                    const response = await completeAttempt(attempt.id, {
                        blocks_used: blockCount,
                        time_elapsed_seconds: 0
                    })

                    setEarnedStars(response.attempt.stars_earned)
                    setEarnedXp(response.xp_earned)
                    onComplete(response.attempt.stars_earned)
                } catch (err) {
                    console.error('Complete attempt error:', err)
                    // Still show completion with default values
                    setEarnedStars(1)
                    setEarnedXp(50)
                    onComplete(1)
                }
            } else {
                // No attempt tracking, show default completion
                setEarnedStars(1)
                setEarnedXp(50)
                onComplete(1)
            }
        } else if (resultType === ResultType.FAILURE || resultType === ResultType.CRASH) {
            setError(resultType === ResultType.CRASH
                ? 'Kelinci menabrak dinding!'
                : 'Belum sampai tujuan! Coba lagi.')

            if (attempt) {
                updateAttempt({
                    failed_runs: (attempt.failed_runs || 0) + 1
                })
                await immediateSync()
            }
        }
    }, [attempt, blockCount, immediateSync, onComplete, updateAttempt])

    // Initialize engine
    useEffect(() => {
        if (canvasRef.current) {
            const engine = new MazeEngine(levelConfig)
            engineRef.current = engine
            interpreterRef.current = new MazeInterpreter(engine)

            engine.setOnComplete(handleGameComplete)
            engine.initialize(canvasRef.current)
        }

        return () => {
            if (engineRef.current) {
                engineRef.current.destroy()
                engineRef.current = null
            }
            interpreterRef.current = null
        }
    }, [levelConfig, handleGameComplete])

    // Handle workspace changes
    const handleWorkspaceChange = useCallback((workspace: Blockly.WorkspaceSvg) => {
        const generatedCode = javascriptGenerator.workspaceToCode(workspace)
        setCode(generatedCode)
        setBlockCount(workspace.getAllBlocks(false).length)
    }, [])

    // Handle reset
    const handleReset = useCallback(() => {
        if (engineRef.current) {
            engineRef.current.reset()
        }
        if (interpreterRef.current) {
            interpreterRef.current.stop()
        }
        setError(null)
        setIsRunning(false)
    }, [])

    // Handle run
    const handleRun = useCallback(async () => {
        if (!interpreterRef.current || !engineRef.current || isRunning) return

        setError(null)

        if (blockCount === 0) {
            setError('Tambahkan blok dulu sebelum menjalankan!')
            return
        }

        // Reset before running
        engineRef.current.reset()
        setIsRunning(true)

        // Update attempt
        if (attempt) {
            updateAttempt({
                blocks_used: blockCount,
                time_elapsed_seconds: 0
            })
        }

        try {
            await interpreterRef.current.execute(code)
        } catch (err) {
            console.error('Execution error:', err)
            setError('Terjadi kesalahan! Coba lagi.')
            setIsRunning(false)
        }
    }, [code, blockCount, isRunning, attempt, updateAttempt])

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setShowCompletion(false)
    }, [])

    return (
        <div className="h-full flex gap-2">
            {/* Column 1: Game Canvas */}
            <div className="flex flex-col gap-3 shrink-0">
                {/* Canvas Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col items-center">
                    <canvas
                        ref={canvasRef}
                        width={MAZE_WIDTH}
                        height={MAZE_HEIGHT}
                        className="rounded-lg border-4 border-amber-200 shadow-inner"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    {/* Block limit indicator */}
                    {levelConfig.maxBlocks !== Infinity && (
                        <div className="mt-3 text-sm text-gray-600">
                            Batas blok: <span className="font-bold text-orange-600">{levelConfig.maxBlocks}</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Menjalankan...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Jalankan
                            </>
                        )}
                    </Button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Hint tooltip */}
                {visibleHint && (
                    <HintTooltip hint={visibleHint} onClose={dismissHint} />
                )}
            </div>

            {/* Column 2: Blockly Workspace */}
            <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex-1 relative">
                    <BlocklyWorkspace
                        className="w-full h-full"
                        toolboxConfiguration={toolbox}
                        workspaceConfiguration={workspaceConfig}
                        onWorkspaceChange={handleWorkspaceChange}
                    />
                </div>
                {/* Code preview */}
                <div className="h-20 bg-gray-900 overflow-y-auto p-3 text-xs font-mono text-green-400 border-t border-gray-700">
                    <div className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">
                        Generated Code
                    </div>
                    <pre className="whitespace-pre-wrap">{code || '// Drag blocks to see code...'}</pre>
                </div>
            </div>

            {/* Column 3: Material Panel */}
            <MaterialPanel
                isExpanded={materialExpanded}
                onToggle={() => setMaterialExpanded(!materialExpanded)}
                content={lessonContent}
                videoUrl={videoUrl}
                availableBlocks={levelConfig.blocks}
            />

            {/* Completion Modal */}
            {showCompletion && (
                <CompletionModal
                    stars={earnedStars}
                    xp={earnedXp}
                    onClose={handleModalClose}
                />
            )}
        </div>
    )
}

export default LessonMaze
