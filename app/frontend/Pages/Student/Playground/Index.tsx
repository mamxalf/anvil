import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Play, RotateCcw } from 'lucide-react';
import BlocklyEditor from '@/components/Blockly/Editor';
import Stage, { StageRef } from '@/components/Simulation/Stage';
import { SimulationEngine } from '@/components/Simulation/Engine';
import StudentLayout from '@/Layouts/StudentLayout';

const PlaygroundIndex = () => {
    const [code, setCode] = useState<string>('');
    const stageRef = useRef<StageRef>(null);
    const [engine] = useState(() => new SimulationEngine());

    const handleRun = () => {
        if (stageRef.current) {
            stageRef.current.run(code);
        }
    };

    const handleReset = () => {
        if (stageRef.current) {
            stageRef.current.reset();
        }
    };

    return (
        <StudentLayout>
            <Head title="KodiLab - Playground" />

            <div className="flex flex-col h-[calc(100vh-100px)] gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">KodiLab</h1>
                        <p className="text-gray-500 text-sm">Design your logic and watch it run!</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                        >
                            <RotateCcw size={18} />
                            Reset
                        </button>
                        <button
                            onClick={handleRun}
                            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold shadow-md transform active:scale-95"
                        >
                            <Play size={18} />
                            Run Code
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 gap-6 min-h-0">
                    {/* Left: Editor */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex-1 relative">
                            <BlocklyEditor
                                onCodeChange={setCode}
                            />
                        </div>
                        <div className="h-32 bg-gray-900 overflow-y-auto p-3 text-xs font-mono text-green-400 border-t border-gray-700">
                            <div className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">Generated JavaScript</div>
                            <pre className="whitespace-pre-wrap">{code || "// Drag blocks to see code here..."}</pre>
                        </div>
                    </div>

                    {/* Right: Simulation */}
                    <div className="w-[400px] flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col items-center justify-center">
                            <Stage ref={stageRef} engine={engine} />

                            <div className="mt-8 w-full">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Instructions</h3>
                                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 border border-blue-100">
                                    <p>1. Drag <strong>Actions</strong> blocks to the workspace.</p>
                                    <p className="mt-1">2. Connect them to create a sequence.</p>
                                    <p className="mt-1">3. Press <strong>Run</strong> to move the avatar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default PlaygroundIndex;
