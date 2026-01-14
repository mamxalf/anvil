import React from 'react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Unlock, Zap, Trophy, Flame } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { Progress } from '@/components/ui/progress'

interface Achievement {
  id: string
  title: string
  description: string
  icon_key?: string
  xp_reward: number
  criteria_type: string
  criteria_value: number
}

interface AchievementsIndexProps {
  achievements: Achievement[]
  earnedIds: string[]
  stats: {
    totalXp: number
    streak: number
    level: number
  }
}

export default function AchievementsIndex({
  achievements,
  earnedIds,
  stats,
}: AchievementsIndexProps) {
  const { t } = useTranslation()
  const earnedSet = new Set(earnedIds)
  const earnedCount = earnedSet.size
  const totalCount = achievements.length
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">🏅 Achievements</h1>
          <p className="text-gray-500">Kumpulkan semua lencana dan jadilah juara!</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-6 py-3 bg-yellow-50 rounded-2xl border border-yellow-100">
            <div className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Level</div>
            <div className="text-3xl font-black text-yellow-700">{stats.level}</div>
          </div>
          <div className="text-center px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">Streak</div>
            <div className="text-3xl font-black text-orange-700">{stats.streak}🔥</div>
          </div>
          <div className="text-center px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">Total XP</div>
            <div className="text-3xl font-black text-blue-700">{stats.totalXp}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-700">Progress Pencapaian</span>
          <span className="font-bold text-primary">
            {earnedCount} / {totalCount}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-4 rounded-full bg-gray-100"
          indicatorClassName="bg-gradient-to-r from-primary to-yellow-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const isEarned = earnedSet.has(achievement.id)

          return (
            <Card
              key={achievement.id}
              className={`overflow-hidden transition-all duration-300 ${isEarned ? 'border-primary/50 shadow-md transform hover:-translate-y-1' : 'opacity-70 border-gray-200 bg-gray-50'}`}
            >
              <CardContent className="p-0 relative">
                {/* Status Badge */}
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isEarned ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                >
                  {isEarned ? (
                    <>
                      <Unlock className="w-3 h-3" /> Unlocked
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> Locked
                    </>
                  )}
                </div>

                <div className="p-6 text-center">
                  <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner ${isEarned ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white' : 'bg-gray-200 grayscale'}`}
                  >
                    {achievement.icon_key === 'streak'
                      ? '🔥'
                      : achievement.icon_key === 'xp'
                        ? '⚡'
                        : achievement.icon_key === 'course'
                          ? '🎓'
                          : '🏆'}
                  </div>

                  <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">
                    {achievement.description}
                  </p>

                  <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                    <Zap className="w-3.5 h-3.5 fill-blue-700" />+{achievement.xp_reward} XP
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

AchievementsIndex.layout = (page: React.ReactNode) => <StudentLayout children={page} />
