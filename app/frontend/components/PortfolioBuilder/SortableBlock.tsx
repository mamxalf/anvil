import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Settings } from 'lucide-react'
import { PortfolioBlock } from './types'

interface SortableBlockProps {
    block: PortfolioBlock
    children: React.ReactNode
    onDelete: (id: string) => void
    onSettings: (id: string) => void
    isSelected: boolean
    onSelect: (id: string) => void
}

export function SortableBlock({
    block,
    children,
    onDelete,
    onSettings,
    isSelected,
    onSelect,
}: SortableBlockProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative rounded-2xl transition-all duration-200 ${isSelected
                ? 'ring-2 ring-kodibot-orange ring-offset-2'
                : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-2'
                } ${isDragging ? 'z-50 shadow-2xl' : ''}`}
            onClick={() => onSelect(block.id)}
        >
            {/* Toolbar */}
            <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1 transition-opacity z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
            >
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 hover:bg-gray-100 rounded-full cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onSettings(block.id)
                    }}
                    className={`p-1.5 rounded-full ${isSelected ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-blue-500'}`}
                    title="Block settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(block.id)
                    }}
                    className="p-1.5 hover:bg-red-50 rounded-full text-red-500"
                    title="Delete block"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Block Content */}
            <div className={`p-4 ${isSelected ? 'bg-blue-50/30 rounded-xl' : ''}`}>{children}</div>
        </div>
    )
}
