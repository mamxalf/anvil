import React from 'react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/hooks/useTranslation'
import { Trophy, Medal, Star, Sparkles } from 'lucide-react'

interface Leader {
  id: string
  total_points: number
  weekly_lessons?: number
  user: {
    name: string
    avatar?: string
  }
}

interface LeaderboardProps {
  weeklyLeaders: Leader[]
  allTimeLeaders: Leader[]
  currentRank: number
}

export default function Index({ weeklyLeaders, allTimeLeaders, currentRank }: LeaderboardProps) {
  const { t } = useTranslation()

  const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />
    return <span className="font-bold text-gray-500 text-lg w-6 text-center">{rank}</span>
  }

  const LeaderList = ({ leaders, type }: { leaders: Leader[]; type: 'weekly' | 'alltime' }) => (
    <div className="space-y-4">
      {leaders.map((leader, index) => (
        <div
          key={leader.id}
          className={`flex items-center p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${index < 3 ? 'bg-gradient-to-r from-kodibot-yellow/10 to-white border-kodibot-yellow/30 shadow-sm' : 'bg-white/80 backdrop-blur-sm border-gray-100 hover:border-kodibot-orange/20'}`}
        >
          <div className="mr-4 flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50">
            <RankIcon rank={index + 1} />
          </div>
          <div className="flex items-center gap-3 flex-grow">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-kodibot-orange to-yellow-500 flex items-center justify-center font-bold text-white text-lg shadow-sm">
              {leader.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{leader.user.name}</p>
              {type === 'weekly' && (
                <p className="text-xs text-gray-500">
                  {t('gamification.lessons_this_week', { count: String(leader.weekly_lessons || 0) })}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 font-black text-kodibot-orange bg-kodibot-orange/10 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-kodibot-orange" />
              {leader.total_points} XP
            </div>
          </div>
        </div>
      ))}

      {leaders.length === 0 && (
        <div className="text-center py-12 text-gray-500">No leaders yet. Be the first!</div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Glassmorphism Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-8 text-white text-center mb-10">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-600/30 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Top Learners</span>
          </div>
          <h1 className="text-4xl font-black mb-4">🏆 {t('gamification.leaderboard')}</h1>
          <p className="text-xl text-white/80">See who's leading the learning adventure!</p>

          {currentRank && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
              <Trophy className="w-5 h-5" />
              <span className="font-bold text-lg">Your Rank: #{currentRank}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs with Glassmorphism */}
      <Tabs defaultValue="alltime" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-b from-[#00A86B] to-emerald-600 shadow-xl shadow-emerald-100/50 p-4 rounded-[2rem] h-20 border-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <TabsTrigger
            value="weekly"
            className="rounded-xl h-12 text-lg font-bold z-10 text-white/80 hover:bg-white/20 hover:text-white data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-lg transition-all"
          >
            This Week
          </TabsTrigger>
          <TabsTrigger
            value="alltime"
            className="rounded-xl h-12 text-lg font-bold z-10 text-white/80 hover:bg-white/20 hover:text-white data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-lg transition-all"
          >
            All Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <LeaderList leaders={weeklyLeaders} type="weekly" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alltime">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <LeaderList leaders={allTimeLeaders} type="alltime" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <StudentLayout children={page} />
