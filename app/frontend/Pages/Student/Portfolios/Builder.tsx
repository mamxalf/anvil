import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import {
    Portfolio,
    PortfolioBlock,
    ThemeName,
    THEMES,
    BLOCK_TYPES,
    DEFAULT_BLOCKS,
    SortableBlock,
    DraggableBlock,
    BlockRenderer,
    BlockSettingsPanel,
} from '@/components/PortfolioBuilder'
import {
    Save,
    Globe,
    EyeOff,
    ArrowLeft,
    Palette,
    Check,
    ExternalLink,
} from 'lucide-react'

interface BuilderProps extends PageProps {
    portfolio: Portfolio
    themes: string[]
}

export default function Builder({ portfolio: initialPortfolio }: BuilderProps) {
    const [portfolio, setPortfolio] = useState(initialPortfolio)
    const [blocks, setBlocks] = useState<PortfolioBlock[]>(
        (initialPortfolio.content as PortfolioBlock[]) || []
    )
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [showThemePicker, setShowThemePicker] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [saving, setSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    // Generate unique ID
    const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        // Check if dragging a new block from sidebar
        const activeData = active.data.current
        if (activeData?.isNew) {
            const newBlock: PortfolioBlock = {
                id: generateId(),
                type: activeData.type,
                content: { ...DEFAULT_BLOCKS[activeData.type as keyof typeof DEFAULT_BLOCKS] },
            }

            // Find position to insert
            const overIndex = blocks.findIndex((b) => b.id === over.id)
            if (overIndex >= 0) {
                setBlocks([...blocks.slice(0, overIndex + 1), newBlock, ...blocks.slice(overIndex + 1)])
            } else {
                setBlocks([...blocks, newBlock])
            }
            setSelectedBlockId(newBlock.id)
            setHasChanges(true)
            return
        }

        // Reordering existing blocks
        if (active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((b) => b.id === active.id)
                const newIndex = items.findIndex((b) => b.id === over.id)
                setHasChanges(true)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Add block from sidebar click (fallback)
    const addBlock = (type: PortfolioBlock['type']) => {
        const newBlock: PortfolioBlock = {
            id: generateId(),
            type,
            content: { ...DEFAULT_BLOCKS[type] },
        }
        setBlocks([...blocks, newBlock])
        setSelectedBlockId(newBlock.id)
        setHasChanges(true)
    }

    // Delete block
    const deleteBlock = (id: string) => {
        setBlocks(blocks.filter((b) => b.id !== id))
        if (selectedBlockId === id) setSelectedBlockId(null)
        setHasChanges(true)
    }

    // Update block content
    const updateBlockContent = (id: string, content: Record<string, unknown>) => {
        setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)))
        setHasChanges(true)
    }

    // Change theme
    const changeTheme = (theme: ThemeName) => {
        setPortfolio({ ...portfolio, theme })
        setShowThemePicker(false)
        setHasChanges(true)
    }

    // Toggle publish
    const togglePublish = () => {
        setPortfolio({ ...portfolio, published: !portfolio.published })
        setHasChanges(true)
    }

    // Save portfolio
    const savePortfolio = async () => {
        setSaving(true)
        try {
            const response = await fetch(`/student/portfolios/${portfolio.id}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    portfolio: {
                        theme: portfolio.theme,
                        content: blocks,
                        published: portfolio.published,
                    },
                }),
            })
            if (response.ok) {
                setHasChanges(false)
            }
        } finally {
            setSaving(false)
        }
    }

    // Handle image upload
    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch(`/student/portfolios/${portfolio.id}/assets`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-Token':
                    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })

        const data = await response.json()
        if (data.success) {
            return data.url
        }
        throw new Error(data.error || 'Upload failed')
    }

    const currentTheme = THEMES[portfolio.theme as ThemeName] || THEMES.modern

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Toolbar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/student/portfolios')}
                            className="rounded-xl"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="h-6 w-px bg-gray-200" />
                        <h1 className="font-bold text-gray-900">{portfolio.title}</h1>
                        {hasChanges && (
                            <span className="text-xs text-orange-500 font-medium">• Unsaved changes</span>
                        )}
                    </div>

                    {/* Center - Theme Picker */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowThemePicker(!showThemePicker)}
                            className="rounded-xl"
                        >
                            <Palette className="w-4 h-4 mr-2" />
                            {currentTheme.name}
                        </Button>

                        {showThemePicker && (
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 min-w-[300px]">
                                <p className="text-sm font-bold text-gray-500 mb-3">Choose Theme</p>
                                <div className="grid grid-cols-5 gap-3">
                                    {Object.entries(THEMES).map(([key, theme]) => (
                                        <button
                                            key={key}
                                            onClick={() => changeTheme(key as ThemeName)}
                                            className={`relative p-3 rounded-xl text-center transition-all ${portfolio.theme === key
                                                ? 'ring-2 ring-kodibot-orange ring-offset-2'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-2xl block mb-1">{theme.preview}</span>
                                            <span className="text-xs font-medium text-gray-600">{theme.name}</span>
                                            {portfolio.theme === key && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-kodibot-orange rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePublish}
                            className={`rounded-xl ${portfolio.published ? 'text-green-600 border-green-200 bg-green-50' : ''}`}
                        >
                            {portfolio.published ? (
                                <>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Published
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Draft
                                </>
                            )}
                        </Button>

                        {portfolio.publicUrl && (
                            <Button variant="outline" size="sm" asChild className="rounded-xl">
                                <a href={portfolio.publicUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Live
                                </a>
                            </Button>
                        )}

                        <Button
                            onClick={savePortfolio}
                            disabled={saving || !hasChanges}
                            className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-16 flex">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {/* Sidebar - Block Palette */}
                    <div className="w-72 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                        <h3 className="font-bold text-gray-900 mb-4">Add Blocks</h3>
                        <div className="space-y-2">
                            {BLOCK_TYPES.map((block) => (
                                <div key={block.type} onClick={() => addBlock(block.type as PortfolioBlock['type'])}>
                                    <DraggableBlock {...block} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-2">Tips</h3>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li>• Drag blocks to canvas</li>
                                <li>• Click to select & edit</li>
                                <li>• Drag handle to reorder</li>
                                <li>• Don't forget to save!</li>
                            </ul>
                        </div>
                    </div>

                    {/* Canvas */}
                    {/* Canvas Area - Scrollable, shifts when settings panel is open */}
                    <div className={`flex-1 ml-72 p-8 overflow-x-auto transition-all duration-300 ${showSettings ? 'mr-80' : ''}`}>
                        <div
                            className="min-w-[600px] max-w-3xl mx-auto min-h-[80vh] rounded-2xl shadow-xl overflow-hidden"
                            style={{
                                background:
                                    typeof currentTheme.colors.background === 'string' &&
                                        currentTheme.colors.background.includes('gradient')
                                        ? currentTheme.colors.background
                                        : currentTheme.colors.background,
                            }}
                        >
                            {blocks.length > 0 ? (
                                <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
                                    <div className="p-8 space-y-4">
                                        {blocks.map((block) => (
                                            <SortableBlock
                                                key={block.id}
                                                block={block}
                                                onDelete={deleteBlock}
                                                onSettings={(id) => {
                                                    setSelectedBlockId(id)
                                                    setShowSettings(true)
                                                }}
                                                isSelected={selectedBlockId === block.id}
                                                onSelect={setSelectedBlockId}
                                            >
                                                <BlockRenderer
                                                    block={block}
                                                    theme={portfolio.theme as ThemeName}
                                                    isEditing={selectedBlockId === block.id}
                                                    onUpdate={updateBlockContent}
                                                    onImageUpload={handleImageUpload}
                                                />
                                            </SortableBlock>
                                        ))}
                                    </div>
                                </SortableContext>
                            ) : (
                                <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center p-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <span className="text-4xl">🎨</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">Start Building!</h3>
                                    <p className="text-gray-500 max-w-sm">
                                        Drag blocks from the sidebar or click them to add to your portfolio
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Drag Overlay */}
                    <DragOverlay>
                        {activeId && activeId.startsWith('new-') ? (
                            <div className="bg-white rounded-xl shadow-2xl p-4 opacity-80">
                                <span className="font-bold text-kodibot-orange">
                                    {BLOCK_TYPES.find((b) => `new-${b.type}` === activeId)?.label}
                                </span>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Settings Panel */}
                {showSettings && selectedBlockId && (
                    <BlockSettingsPanel
                        block={blocks.find((b) => b.id === selectedBlockId)!}
                        onUpdate={updateBlockContent}
                        onClose={() => setShowSettings(false)}
                    />
                )}
            </div>
        </div>
    )
}

// No layout - full screen builder
Builder.layout = (page: React.ReactNode) => page
