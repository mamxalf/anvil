/**
 * MaterialPanel - Collapsible right-side panel showing lesson content and available blocks
 */

import React from 'react'
import { ChevronRight, ChevronLeft, BookOpen, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MaterialPanelProps {
    content: string
    availableBlocks: string[]
    videoUrl?: string
    isExpanded: boolean
    onToggle: () => void
}

// Block display names mapping
const blockDisplayNames: Record<string, string> = {
    'forward': 'Maju',
    'turn_left': 'Belok Kiri',
    'turn_right': 'Belok Kanan',
    'repeat': 'Ulangi',
    'if_path': 'Jika Ada Jalan',
}

export function MaterialPanel({
    content,
    availableBlocks,
    videoUrl,
    isExpanded,
    onToggle
}: MaterialPanelProps) {
    return (
        <div className={cn(
            "bg-white border-l border-gray-200 transition-all duration-300 flex flex-col h-full overflow-hidden",
            isExpanded ? "w-80" : "w-12"
        )}>
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="w-full h-12 flex items-center justify-center border-b border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
            >
                {isExpanded ? (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                ) : (
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                )}
            </button>

            {/* Collapsed state - just icons */}
            {!isExpanded && (
                <div className="flex flex-col items-center gap-4 py-4">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
            )}

            {/* Expanded content */}
            {isExpanded && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-gray-900">📖 Materi</h3>
                    </div>

                    {/* Video Player (if exists) */}
                    {videoUrl && (
                        <div className="rounded-lg overflow-hidden border border-gray-200">
                            <div className="aspect-video bg-gray-900">
                                <iframe
                                    src={videoUrl}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title="Lesson Video"
                                />
                            </div>
                        </div>
                    )}

                    {/* Lesson Content */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
                            <span>📋</span> Tujuan Pembelajaran
                        </h4>
                        <div
                            className="prose prose-sm prose-orange max-w-none text-gray-600"
                            dangerouslySetInnerHTML={{ __html: content || '<p>Selesaikan maze untuk lanjut ke level berikutnya!</p>' }}
                        />
                    </div>

                    {/* Available Blocks */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200">
                        <h4 className="font-bold text-xs text-orange-800 mb-2 flex items-center gap-1">
                            <span>🧩</span> Blok Tersedia
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {availableBlocks.map(block => (
                                <span
                                    key={block}
                                    className="px-2 py-1 bg-white rounded-md text-xs font-bold text-orange-700 border border-orange-200 shadow-sm"
                                >
                                    {blockDisplayNames[block] || block}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <h4 className="font-bold text-xs text-blue-800 mb-2 flex items-center gap-1">
                            <span>💡</span> Tips
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Gunakan blok seminimal mungkin untuk ⭐⭐</li>
                            <li>• Selesaikan secepat mungkin untuk ⭐⭐⭐</li>
                            <li>• Klik Run untuk jalankan program</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MaterialPanel
