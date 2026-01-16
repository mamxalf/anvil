import { PortfolioBlock } from './types'
import { X, AlignLeft, AlignCenter, AlignRight, Type, Palette } from 'lucide-react'

interface BlockSettingsPanelProps {
    block: PortfolioBlock
    onUpdate: (id: string, content: Record<string, unknown>) => void
    onClose: () => void
}

const FONT_SIZES = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'Extra Large', value: 'xlarge' },
]

const TEXT_COLORS = [
    { label: 'Default', value: 'default', color: '#1f2937' },
    { label: 'Primary', value: 'primary', color: '#f97316' },
    { label: 'Secondary', value: 'secondary', color: '#8b5cf6' },
    { label: 'Muted', value: 'muted', color: '#6b7280' },
    { label: 'White', value: 'white', color: '#ffffff' },
]

const BG_COLORS = [
    { label: 'None', value: 'none', color: 'transparent' },
    { label: 'Light Gray', value: 'gray', color: '#f3f4f6' },
    { label: 'Light Orange', value: 'orange', color: '#fff7ed' },
    { label: 'Light Blue', value: 'blue', color: '#eff6ff' },
    { label: 'Light Green', value: 'green', color: '#f0fdf4' },
    { label: 'Light Purple', value: 'purple', color: '#faf5ff' },
]

export function BlockSettingsPanel({ block, onUpdate, onClose }: BlockSettingsPanelProps) {
    const settings = (block.content.settings as Record<string, unknown>) || {}

    const updateSettings = (key: string, value: unknown) => {
        onUpdate(block.id, {
            ...block.content,
            settings: { ...settings, [key]: value },
        })
    }

    return (
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-900">Block Settings</h3>
                    <p className="text-xs text-gray-500 capitalize">{block.type} block</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Text Alignment */}
                {['header', 'text'].includes(block.type) && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <AlignLeft className="w-4 h-4 inline mr-2" />
                            Text Alignment
                        </label>
                        <div className="flex gap-2">
                            {[
                                { value: 'left', icon: AlignLeft },
                                { value: 'center', icon: AlignCenter },
                                { value: 'right', icon: AlignRight },
                            ].map(({ value, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => updateSettings('textAlign', value)}
                                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${(settings.textAlign || 'center') === value
                                        ? 'border-kodibot-orange bg-orange-50 text-kodibot-orange'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mx-auto" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Font Size */}
                {['header', 'text'].includes(block.type) && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Type className="w-4 h-4 inline mr-2" />
                            Font Size
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {FONT_SIZES.map(({ label, value }) => (
                                <button
                                    key={value}
                                    onClick={() => updateSettings('fontSize', value)}
                                    className={`p-2 rounded-xl border-2 text-sm font-medium transition-all ${(settings.fontSize || 'medium') === value
                                        ? 'border-kodibot-orange bg-orange-50 text-kodibot-orange'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Text Color */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Text Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TEXT_COLORS.map(({ label, value, color }) => (
                            <button
                                key={value}
                                onClick={() => updateSettings('textColor', value)}
                                className={`w-10 h-10 rounded-xl border-2 transition-all ${(settings.textColor || 'default') === value
                                    ? 'border-kodibot-orange ring-2 ring-kodibot-orange ring-offset-2'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                style={{ backgroundColor: color }}
                                title={label}
                            />
                        ))}
                    </div>
                </div>

                {/* Background Color */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Background
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {BG_COLORS.map(({ label, value, color }) => (
                            <button
                                key={value}
                                onClick={() => updateSettings('bgColor', value)}
                                className={`w-10 h-10 rounded-xl border-2 transition-all ${(settings.bgColor || 'none') === value
                                    ? 'border-kodibot-orange ring-2 ring-kodibot-orange ring-offset-2'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                style={{ backgroundColor: color === 'transparent' ? '#fff' : color }}
                                title={label}
                            >
                                {value === 'none' && <span className="text-xs text-gray-400">∅</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Padding */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Padding
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="48"
                        step="4"
                        value={(settings.padding as number) || 16}
                        onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>None</span>
                        <span>{(settings.padding as number) || 16}px</span>
                        <span>Large</span>
                    </div>
                </div>

                {/* Border Radius */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Corner Radius
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="32"
                        step="4"
                        value={(settings.borderRadius as number) || 0}
                        onChange={(e) => updateSettings('borderRadius', parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Square</span>
                        <span>{(settings.borderRadius as number) || 0}px</span>
                        <span>Round</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
