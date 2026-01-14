import React from 'react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Unlock, Zap, Sparkles } from 'lucide-react'
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

export default function Index({ achievements, earnedIds, stats }: AchievementsIndexProps) {
  const earnedSet = new Set(earnedIds)
  const earnedCount = earnedSet.size
  const totalCount = achievements.length
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      
      {/* Glassmorphism Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-kodibot-orange to-kodibot-yellow p-8 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-600/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Your Progress</span>
            </div>
            <h1 className="text-4xl font-black mb-2">🏅 Achievements</h1>
            <p className="text-white/80">Kumpulkan semua lencana dan jadilah juara!</p>
          </div>
          
          {/* Glassmorphism Stats */}
          <div className="flex gap-4">
            <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Level</div>
              <div className="text-3xl font-black text-white">{stats.level}</div>
            </div>
            <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Streak</div>
              <div className="text-3xl font-black text-white">{stats.streak}🔥</div>
            </div>
            <div className="text-center px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <div className="text-xs font-bold text-white/80 uppercase tracking-wide">Total XP</div>
              <div className="text-3xl font-black text-white">{stats.totalXp}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar - Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-3">
           <span className="font-bold text-gray-700">Progress Pencapaian</span>
           <span className="font-bold text-kodibot-orange">{earnedCount} / {totalCount}</span>
         </div>
         <Progress value={progressPercentage} className="h-4 rounded-full bg-gray-100" />
      </div>

      {/* Achievements Grid - Glassmorphism Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const isEarned = earnedSet.has(achievement.id)
          
          return (
            <Card key={achievement.id} className={`overflow-hidden transition-all duration-300 rounded-[1.5rem] ${isEarned ? 'border-kodibot-orange/50 shadow-lg shadow-orange-100 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm' : 'opacity-70 border-gray-200 bg-gray-50/80'}`}>
               <CardContent className="p-0 relative">
                 {/* Status Badge */}
                 <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${isEarned ? 'bg-kodibot-green/10 text-kodibot-green border border-kodibot-green/20' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {isEarned ? (
                      <><Unlock className="w-3 h-3" /> Unlocked</>
                    ) : (
                      <><Lock className="w-3 h-3" /> Locked</>
                    )}
                 </div>

                 <div className="p-6 text-center">
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 text-4xl shadow-inner ${isEarned ? 'bg-gradient-to-br from-kodibot-yellow to-kodibot-orange text-white shadow-orange-200' : 'bg-gray-200 grayscale'}`}>
                       {achievement.icon_key === 'streak' ? '🔥' : 
                        achievement.icon_key === 'xp' ? '⚡' : 
                        achievement.icon_key === 'course' ? '🎓' : '🏆'}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{achievement.description}</p>
                    
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
                       <Zap className="w-4 h-4 fill-blue-700" />
                       +{achievement.xp_reward} XP
                    </div>
                 </div>
               </CardContent>
            </Card>
          )
        })}
      </div>

      {achievements.length === 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-12 text-center border-4 border-dashed border-gray-200">
          <div className="mb-6 mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
            🏅
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Achievements Yet</h3>
          <p className="text-gray-500">Start learning to unlock achievements!</p>
        </div>
      )}
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <StudentLayout children={page} />
