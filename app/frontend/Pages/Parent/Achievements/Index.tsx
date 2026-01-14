import React, { useState } from 'react'
import ParentLayout from '@/Layouts/ParentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Unlock, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  title: string
  description: string
  icon_key?: string
  xp_reward: number
}

interface ChildData {
  id: string
  name: string
  avatar_url: string
  earnedCount: number
  totalXp: number
  level: number
  earnedIds: string[]
}

interface AchievementsIndexProps {
  achievements: Achievement[]
  children: ChildData[]
  totalAchievements: number
}

export default function Index({ achievements, children, totalAchievements }: AchievementsIndexProps) {
  const [selectedChild, setSelectedChild] = useState<string | null>(children[0]?.id || null)
  
  const currentChild = children.find(c => c.id === selectedChild)
  const earnedSet = new Set(currentChild?.earnedIds || [])

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Children's Achievements</h1>
          <p className="text-gray-500 mt-1">Monitor your children's progress and accomplishments</p>
        </div>
      </div>

      {/* Child Selector - Clean Tabs */}
      {children.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                selectedChild === child.id 
                  ? 'border-kodibot-green bg-kodibot-green/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                {child.avatar_url ? (
                  <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                ) : (
                  <img src="/assets/profile-kodibot.png" alt={child.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">{child.name}</p>
                <p className="text-xs text-gray-500">{child.earnedCount}/{totalAchievements} achievements</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Child Stats */}
      {currentChild && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-kodibot-green">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Level</p>
              <p className="text-2xl font-bold text-gray-900">{currentChild.level}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-kodibot-orange">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total XP</p>
              <p className="text-2xl font-bold text-gray-900">{currentChild.totalXp}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Unlocked</p>
              <p className="text-2xl font-bold text-gray-900">{currentChild.earnedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-gray-400">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{totalAchievements - currentChild.earnedCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {currentChild && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Achievement Progress</span>
              <span className="font-bold text-kodibot-green">
                {Math.round((currentChild.earnedCount / totalAchievements) * 100)}%
              </span>
            </div>
            <Progress 
              value={(currentChild.earnedCount / totalAchievements) * 100} 
              className="h-3"
            />
          </CardContent>
        </Card>
      )}

      {/* Achievements Grid - Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const isEarned = earnedSet.has(achievement.id)
          
          return (
            <Card key={achievement.id} className={`transition-all ${isEarned ? 'border-kodibot-green/50' : 'opacity-60'}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  isEarned 
                    ? 'bg-kodibot-yellow/20 border-2 border-kodibot-yellow' 
                    : 'bg-gray-100 border-2 border-gray-200 grayscale'
                }`}>
                  {achievement.icon_key === 'streak' ? '🔥' : 
                   achievement.icon_key === 'xp' ? '⚡' : 
                   achievement.icon_key === 'course' ? '🎓' : '🏆'}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{achievement.title}</h3>
                    {isEarned ? (
                      <Unlock className="w-4 h-4 text-kodibot-green shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{achievement.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-blue-600 font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    +{achievement.xp_reward} XP
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {children.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500">Add children to monitor their achievements</p>
        </div>
      )}
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <ParentLayout children={page} />
