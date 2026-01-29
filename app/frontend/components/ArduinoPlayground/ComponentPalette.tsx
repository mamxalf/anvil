
import { ModuleType, MODULE_CONFIGS } from './types'
import { Plus, Trash2 } from 'lucide-react'

interface ComponentPaletteProps {
    onAddModule: (type: ModuleType) => void
    selectedId: string | null
    onDeleteSelected: () => void
}

export function ComponentPalette({
    onAddModule,
    selectedId,
    onDeleteSelected,
}: ComponentPaletteProps) {
    const moduleTypes: ModuleType[] = ['led', 'button', 'buzzer', 'lcd']

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Components
                </h3>
                <p className="text-purple-100 text-xs mt-1">
                    Drag modules to canvas
                </p>
            </div>

            {/* Module list */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {moduleTypes.map(type => {
                    const config = MODULE_CONFIGS[type]
                    return (
                        <button
                            key={type}
                            onClick={() => onAddModule(type)}
                            className="w-full p-3 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg flex items-center gap-3 transition-all group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                {config.icon}
                            </span>
                            <div className="text-left flex-1">
                                <p className="font-semibold text-gray-800 text-sm">
                                    {config.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {config.description}
                                </p>
                            </div>
                            <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="w-5 h-5" />
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Delete button when something is selected */}
            {selectedId && selectedId !== 'arduino' && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onDeleteSelected}
                        className="w-full p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Help text */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500 space-y-1">
                    <p>💡 <strong>Click</strong> a pin to start wiring</p>
                    <p>🖱️ <strong>Drag</strong> components to move</p>
                    <p>🔍 <strong>Scroll</strong> to zoom in/out</p>
                    <p>⌫ <strong>Delete</strong> to remove selected</p>
                </div>
            </div>
        </div>
    )
}

interface PropertiesPanelProps {
    selectedId: string | null
    selectedType: 'arduino' | 'module' | 'wire' | null
    moduleType?: ModuleType
    properties?: Record<string, unknown>
    onUpdateProperties?: (props: Record<string, unknown>) => void
    onRemoveWire?: () => void
}

export function PropertiesPanel({
    selectedId,
    selectedType,
    moduleType,
    properties,
    onUpdateProperties,
    onRemoveWire,
}: PropertiesPanelProps) {
    if (!selectedId) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-4 text-center text-gray-400">
                <p className="text-sm">Select an item to see its properties</p>
            </div>
        )
    }

    const renderArduinoProperties = () => (
        <div className="space-y-3">
            <div className="text-center py-4">
                <span className="text-4xl">🔵</span>
                <h4 className="font-bold text-gray-800 mt-2">Arduino UNO</h4>
                <p className="text-sm text-gray-500">ATmega328P</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                <p><strong>Digital Pins:</strong> D0-D13</p>
                <p><strong>Analog Pins:</strong> A0-A5</p>
                <p><strong>PWM Pins:</strong> 3, 5, 6, 9, 10, 11</p>
                <p><strong>Operating Voltage:</strong> 5V</p>
            </div>
        </div>
    )

    const renderModuleProperties = () => {
        const config = moduleType ? MODULE_CONFIGS[moduleType] : null
        if (!config) return null

        return (
            <div className="space-y-3">
                <div className="text-center py-2">
                    <span className="text-3xl">{config.icon}</span>
                    <h4 className="font-bold text-gray-800 mt-1">{config.name}</h4>
                </div>

                {/* Color picker for LED and Button */}
                {(moduleType === 'led' || moduleType === 'button') && properties && onUpdateProperties && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {['red', 'green', 'blue', 'yellow', 'white'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => onUpdateProperties({ color })}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform ${properties.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color === 'white' ? '#f5f5f5' : color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* LCD text input */}
                {moduleType === 'lcd' && properties && onUpdateProperties && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Text
                        </label>
                        <input
                            type="text"
                            value={(properties.text as string) || ''}
                            onChange={(e) => onUpdateProperties({ text: e.target.value })}
                            maxLength={32}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter text..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Max 32 chars (16 per line)
                        </p>
                    </div>
                )}

                {/* Pin info */}
                <div className="bg-gray-50 rounded-lg p-3 text-xs">
                    <p className="font-medium text-gray-700 mb-1">Pins:</p>
                    {config.pins.map(pin => (
                        <p key={pin.id} className="text-gray-500">
                            • {pin.label} ({pin.type})
                        </p>
                    ))}
                </div>
            </div>
        )
    }

    const renderWireProperties = () => (
        <div className="space-y-3">
            <div className="text-center py-2">
                <span className="text-3xl">🔌</span>
                <h4 className="font-bold text-gray-800 mt-1">Wire Connection</h4>
            </div>

            {onRemoveWire && (
                <button
                    onClick={onRemoveWire}
                    className="w-full p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
                >
                    <Trash2 className="w-4 h-4" />
                    Remove Wire
                </button>
            )}
        </div>
    )

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 text-sm">Properties</h3>
            </div>
            <div className="p-4">
                {selectedType === 'arduino' && renderArduinoProperties()}
                {selectedType === 'module' && renderModuleProperties()}
                {selectedType === 'wire' && renderWireProperties()}
            </div>
        </div>
    )
}
