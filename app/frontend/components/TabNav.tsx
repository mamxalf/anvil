import React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  unlocked: boolean
}

interface TabNavProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10" role="tablist">
      <div className="flex gap-2 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => tab.unlocked && onTabChange(tab.id)}
              disabled={!tab.unlocked}
              role="tab"
              aria-selected={isActive}
              aria-disabled={!tab.unlocked}
              aria-label={tab.label}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                'flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-all',
                isActive
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : tab.unlocked
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  : 'border-transparent text-gray-300 cursor-not-allowed opacity-50'
              )}
            >
              {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
              <span>{tab.label}</span>
              {!tab.unlocked && (
                <span className="text-xs ml-1 flex items-center gap-1" aria-hidden="true">
                  <Lock className="w-3 h-3" />
                  Baca materi dulu
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
