import { useDraggable } from '@dnd-kit/core'


interface DraggableBlockProps {
    type: string
    label: string
    icon: string
    description: string
}

export function DraggableBlock({ type, label, icon, description }: DraggableBlockProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `new-${type}`,
        data: { type, isNew: true },
    })

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`flex items-center gap-3 p-3 bg-white border-2 border-gray-100 rounded-xl cursor-grab active:cursor-grabbing hover:border-kodibot-orange/50 hover:bg-orange-50/50 transition-all ${isDragging ? 'opacity-50 shadow-lg' : ''
                }`}
        >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center text-xl">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-500 truncate">{description}</p>
            </div>
        </div>
    )
}
