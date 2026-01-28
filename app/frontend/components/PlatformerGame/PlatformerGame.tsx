// PlatformerGame.tsx - Main React Component

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import type * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { Play, RotateCcw, ChevronLeft, ChevronRight, Trophy, XCircle } from 'lucide-react'

import { PlatformerEngine } from './PlatformerEngine'
import { PlatformerInterpreter } from './PlatformerInterpreter'
import { getLevelConfig } from './PlatformerLevels'
import { createPlatformerToolbox, definePlatformerBlocks } from './PlatformerToolbox'
import { ResultType, MAX_LEVEL } from './PlatformerTypes'
import { useTranslation } from '@/hooks/useTranslation'

// Initialize blocks on module load
definePlatformerBlocks()

interface PlatformerGameProps {
    initialLevel?: number
    onComplete?: (resultType: ResultType) => void
}

const PlatformerGame: React.FC<PlatformerGameProps> = ({ initialLevel = 1, onComplete }) => {
    const { t } = useTranslation()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const engineRef = useRef<PlatformerEngine | null>(null)
    const interpreterRef = useRef<PlatformerInterpreter | null>(null)

    const [level, setLevel] = useState(initialLevel)
    const [isRunning, setIsRunning] = useState(false)
    const [result, setResult] = useState<ResultType>(ResultType.UNSET)
    const [code, setCode] = useState('')
    const [blockCount, setBlockCount] = useState(0)
    const [collectedCount, setCollectedCount] = useState(0)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showFailure, setShowFailure] = useState(false)
    const [earnedPoints, setEarnedPoints] = useState<number>(0)

    const levelConfig = getLevelConfig(level)
    const toolbox = createPlatformerToolbox(levelConfig, t)

    const workspaceConfiguration = {
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

    // Handle Game Completion
    const handleGameComplete = useCallback(
        (resultType: ResultType) => {
            setResult(resultType)
            setIsRunning(false)
            setCollectedCount(engineRef.current?.getCollectedCount() || 0)

            if (onComplete) {
                onComplete(resultType)
            }

            if (resultType === ResultType.SUCCESS) {
                const points = level * 50
                setEarnedPoints(points)
                setShowSuccess(true)
            } else if (resultType === ResultType.FAILURE || resultType === ResultType.CRASH) {
                setShowFailure(true)
            }
        },
        [level, onComplete]
    )

    // Initialize engine
    useEffect(() => {
        if (canvasRef.current && !engineRef.current) {
            const engine = new PlatformerEngine(levelConfig)
            engineRef.current = engine
            interpreterRef.current = new PlatformerInterpreter(engine)

            engine.setOnComplete(handleGameComplete)

            engine.initialize(canvasRef.current)
        }

        return () => {
            if (engineRef.current) {
                engineRef.current.destroy()
                engineRef.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update level
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setLevel(levelConfig)
            setResult(ResultType.UNSET)
            setShowSuccess(false)
            setShowFailure(false)
            setEarnedPoints(0)
            setCollectedCount(0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level])

    const handleWorkspaceChange = useCallback((workspace: Blockly.WorkspaceSvg) => {
        const generatedCode = javascriptGenerator.workspaceToCode(workspace)
        setCode(generatedCode)
        setBlockCount(workspace.getAllBlocks(false).length)
    }, [])

    const handleRun = async () => {
        if (!interpreterRef.current || isRunning) return

        if (blockCount === 0) {
            setShowFailure(true)
            setResult(ResultType.FAILURE)
            return
        }

        setIsRunning(true)
        setResult(ResultType.UNSET)
        setShowSuccess(false)
        setShowFailure(false)

        try {
            await interpreterRef.current.execute(code)
        } catch (error) {
            console.error('Execution error:', error)
            setShowFailure(true)
            setResult(ResultType.FAILURE)
            setIsRunning(false)
        }
    }

    const handleReset = () => {
        if (engineRef.current) {
            engineRef.current.reset()
        }
        if (interpreterRef.current) {
            interpreterRef.current.stop()
        }
        setIsRunning(false)
        setResult(ResultType.UNSET)
        setShowSuccess(false)
        setShowFailure(false)
        setCollectedCount(0)
    }

    const handleNextLevel = () => {
        if (level < MAX_LEVEL) {
            setLevel(level + 1)
            handleReset()
        }
    }

    const handlePrevLevel = () => {
        if (level > 1) {
            setLevel(level - 1)
            handleReset()
        }
    }

    const getFailureMessage = () => {
        switch (result) {
            case ResultType.CRASH:
                return t('platformer.failure.crash') || 'Kamu menabrak duri!'
            case ResultType.FAILURE:
                if (collectedCount < levelConfig.requiredCollectibles) {
                    return t('platformer.failure.not_enough_items') || `Kumpulkan ${levelConfig.requiredCollectibles} item dulu!`
                }
                return t('platformer.failure.fell') || 'Kamu jatuh ke jurang!'
            default:
                return t('platformer.failure.try_again') || 'Coba Lagi!'
        }
    }

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🏰</span>
                    <div>
                        <h1 className="text-xl font-bold">{t('platformer.title') || 'Dungeon Platformer'}</h1>
                        <p className="text-sm text-indigo-100">
                            {t('platformer.subtitle') || 'Bantu petualang mencapai tujuan!'}
                        </p>
                    </div>
                </div>

                {/* Level selector */}
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <button
                        onClick={handlePrevLevel}
                        disabled={level <= 1}
                        className="p-1 hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-bold min-w-[100px] text-center">
                        Level {level}/{MAX_LEVEL}
                    </span>
                    <button
                        onClick={handleNextLevel}
                        disabled={level >= MAX_LEVEL}
                        className="p-1 hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors"
                    >
                        <RotateCcw size={18} />
                        {t('platformer.reset') || 'Reset'}
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={18} />
                        {isRunning ? t('platformer.running') || 'Menjalankan...' : t('platformer.run') || 'Jalankan'}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 gap-4 min-h-0">
                {/* Blockly Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex-1 relative">
                        <BlocklyWorkspace
                            className="w-full h-full"
                            toolboxConfiguration={toolbox}
                            workspaceConfiguration={workspaceConfiguration}
                            onWorkspaceChange={handleWorkspaceChange}
                        />
                    </div>
                    {/* Code preview */}
                    <div className="h-24 bg-gray-900 overflow-y-auto p-3 text-xs font-mono text-green-400 border-t border-gray-700">
                        <div className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">
                            {t('platformer.generated_code') || 'Kode Yang Dibuat'}
                        </div>
                        <pre className="whitespace-pre-wrap">{code || '// Tarik blok untuk melihat kode...'}</pre>
                    </div>
                </div>

                {/* Game canvas and info */}
                <div className="w-[520px] flex flex-col gap-4">
                    {/* Canvas container */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
                        <canvas
                            ref={canvasRef}
                            className="rounded-lg border-4 border-indigo-200 shadow-inner"
                            style={{ imageRendering: 'pixelated' }}
                        />

                        {/* Block limit indicator */}
                        {levelConfig.maxBlocks !== Infinity && (
                            <div className="mt-3 text-sm text-gray-600">
                                {t('platformer.block_limit') || 'Batas blok'}:{' '}
                                <span className={`font-bold ${blockCount > levelConfig.maxBlocks ? 'text-red-600' : 'text-indigo-600'}`}>
                                    {blockCount}/{levelConfig.maxBlocks}
                                </span>
                            </div>
                        )}

                        {/* Collectibles counter */}
                        {levelConfig.requiredCollectibles > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                🪙 {collectedCount}/{levelConfig.requiredCollectibles}
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                            {t('platformer.instructions.title') || '📋 Instruksi'}
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>{t('platformer.instructions.step1') || '1. Tarik blok untuk membuat program'}</li>
                            <li>{t('platformer.instructions.step2') || '2. Klik Jalankan untuk eksekusi'}</li>
                            <li>{t('platformer.instructions.step3') || '3. Pandu petualang 🧙 ke tujuan 🚩'}</li>
                            {levelConfig.requiredCollectibles > 0 && (
                                <li className="text-amber-600 font-medium">
                                    {t('platformer.instructions.collect') || `🪙 Kumpulkan ${levelConfig.requiredCollectibles} item!`}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl animate-bounce-in">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {t('platformer.success.title') || '🎉 Selamat!'}
                        </h2>
                        <p className="text-gray-600 mb-2">
                            {t('platformer.success.message') || `Kamu menyelesaikan Level ${level}!`}
                        </p>

                        {earnedPoints > 0 && (
                            <div className="bg-green-100 text-green-700 py-1 px-3 rounded-full inline-block font-bold mb-6">
                                {t('platformer.success.xp_earned') || `+${earnedPoints} XP Didapat!`}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                            >
                                {t('platformer.success.close') || 'Tutup'}
                            </button>
                            {level < MAX_LEVEL && (
                                <button
                                    onClick={() => {
                                        setShowSuccess(false)
                                        handleNextLevel()
                                    }}
                                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                                >
                                    {t('platformer.success.next_level') || 'Level Berikutnya →'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Failure Modal */}
            {showFailure && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {t('platformer.failure.title') || '😢 Coba Lagi!'}
                        </h2>
                        <p className="text-gray-600 mb-6">{getFailureMessage()}</p>
                        <button
                            onClick={() => {
                                setShowFailure(false)
                                handleReset()
                            }}
                            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors"
                        >
                            {t('platformer.failure.try_again') || 'Coba Lagi'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlatformerGame
