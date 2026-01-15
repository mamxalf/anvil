import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BlocklyWorkspace } from 'react-blockly';
import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Trophy, XCircle } from 'lucide-react';

import { MazeEngine } from './MazeEngine';
import { MazeInterpreter } from './MazeInterpreter';
import { getLevelConfig } from './MazeLevels';
import { createMazeToolbox } from './MazeToolbox';
import { ResultType, MAX_LEVEL } from './MazeTypes';
import { defineCustomBlocks } from '../Blockly/CustomBlocks';
import { configureGenerator } from '../Blockly/Generator';

// Initialize blocks and generators
defineCustomBlocks();
configureGenerator();

interface MazeGameProps {
    initialLevel?: number;
}

const MazeGame: React.FC<MazeGameProps> = ({ initialLevel = 1 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<MazeEngine | null>(null);
    const interpreterRef = useRef<MazeInterpreter | null>(null);

    const [level, setLevel] = useState(initialLevel);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<ResultType>(ResultType.UNSET);
    const [code, setCode] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    const levelConfig = getLevelConfig(level);
    const toolbox = createMazeToolbox(levelConfig);

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
    };

    // Initialize engine
    useEffect(() => {
        if (canvasRef.current && !engineRef.current) {
            const engine = new MazeEngine(level);
            engineRef.current = engine;
            interpreterRef.current = new MazeInterpreter(engine);

            engine.setOnComplete((resultType) => {
                setResult(resultType);
                setIsRunning(false);
                if (resultType === ResultType.SUCCESS) {
                    setShowSuccess(true);
                } else if (resultType === ResultType.FAILURE || resultType === ResultType.CRASH) {
                    setShowFailure(true);
                }
            });

            engine.initialize(canvasRef.current);
        }

        return () => {
            if (engineRef.current) {
                engineRef.current.destroy();
                engineRef.current = null;
            }
        };
    }, []);

    // Update level
    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.setLevel(level);
            setResult(ResultType.UNSET);
            setShowSuccess(false);
            setShowFailure(false);
        }
    }, [level]);

    const handleWorkspaceChange = useCallback((workspace: Blockly.WorkspaceSvg) => {
        const generatedCode = javascriptGenerator.workspaceToCode(workspace);
        setCode(generatedCode);
    }, []);

    const handleRun = async () => {
        if (!interpreterRef.current || isRunning) return;

        setIsRunning(true);
        setResult(ResultType.UNSET);
        setShowSuccess(false);
        setShowFailure(false);

        await interpreterRef.current.execute(code);
    };

    const handleReset = () => {
        if (engineRef.current) {
            engineRef.current.reset();
        }
        if (interpreterRef.current) {
            interpreterRef.current.stop();
        }
        setIsRunning(false);
        setResult(ResultType.UNSET);
        setShowSuccess(false);
        setShowFailure(false);
    };

    const handleNextLevel = () => {
        if (level < MAX_LEVEL) {
            setLevel(level + 1);
            handleReset();
        }
    };

    const handlePrevLevel = () => {
        if (level > 1) {
            setLevel(level - 1);
            handleReset();
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🐰</span>
                    <div>
                        <h1 className="text-xl font-bold">Rabbit Maze</h1>
                        <p className="text-sm text-orange-100">Help the rabbit reach the goal!</p>
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
                    <span className="font-bold min-w-[80px] text-center">
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
                        Reset
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={18} />
                        {isRunning ? 'Running...' : 'Run'}
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
                        <div className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">Generated Code</div>
                        <pre className="whitespace-pre-wrap">{code || '// Drag blocks to see code...'}</pre>
                    </div>
                </div>

                {/* Game canvas and info */}
                <div className="w-[520px] flex flex-col gap-4">
                    {/* Canvas container */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
                        <canvas
                            ref={canvasRef}
                            className="rounded-lg border-4 border-amber-200 shadow-inner"
                            style={{ imageRendering: 'pixelated' }}
                        />

                        {/* Block limit indicator */}
                        {levelConfig.maxBlocks !== Infinity && (
                            <div className="mt-3 text-sm text-gray-600">
                                Block limit: <span className="font-bold text-orange-600">{levelConfig.maxBlocks}</span>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">📋 Instructions</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>1. Drag blocks to create a program</li>
                            <li>2. Click <strong>Run</strong> to execute</li>
                            <li>3. Guide the rabbit 🐰 to the goal 🏁</li>
                            {levelConfig.collectiblesCount > 0 && (
                                <li className="text-orange-600 font-medium">
                                    🥕 Collect {levelConfig.collectiblesCount} carrot(s)!
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Congratulations!</h2>
                        <p className="text-gray-600 mb-6">You completed Level {level}!</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                            {level < MAX_LEVEL && (
                                <button
                                    onClick={() => {
                                        setShowSuccess(false);
                                        handleNextLevel();
                                    }}
                                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                                >
                                    Next Level →
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">😢 Try Again!</h2>
                        <p className="text-gray-600 mb-6">
                            {result === ResultType.CRASH
                                ? "The rabbit hit a wall!"
                                : "The rabbit didn't reach the goal."}
                        </p>
                        <button
                            onClick={() => {
                                setShowFailure(false);
                                handleReset();
                            }}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MazeGame;
