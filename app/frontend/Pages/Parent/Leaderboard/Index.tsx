import React from 'react'
import ParentLayout from '@/Layouts/ParentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react'

interface Leader {
  id: string
  total_points: number
  weekly_lessons?: number
  user: {
    name: string
    avatar?: string
  }
}

interface ChildRank {
  id: string
  name: string
  avatar_url: string
  rank: number | null
  totalPoints: number
}

interface LeaderboardProps {
  weeklyLeaders: Leader[]
  allTimeLeaders: Leader[]
  childrenRanks: ChildRank[]
}

export default function Index({ weeklyLeaders, allTimeLeaders, childrenRanks }: LeaderboardProps) {

  const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />
    return <span className="font-bold text-gray-500 text-sm">{rank}</span>
  }

  const LeaderList = ({ leaders, type }: { leaders: Leader[], type: 'weekly' | 'alltime' }) => (
    <div className="space-y-3">
      {leaders.map((leader, index) => (
        <div key={leader.id} className={`flex items-center p-3 rounded-lg border ${index < 3 ? 'bg-yellow-50/50 border-yellow-200' : 'bg-white border-gray-100'}`}>
          <div className="mr-3 flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50">
            <RankIcon rank={index + 1} />
          </div>
          <div className="flex items-center gap-3 flex-grow">
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {leader.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{leader.user.name}</p>
              {type === 'weekly' && (
                <p className="text-xs text-gray-500">{leader.weekly_lessons || 0} Lessons</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold text-kodibot-orange text-sm">
            <Star className="w-4 h-4 fill-kodibot-orange" />
            {leader.total_points}
          </div>
        </div>
      ))}
      
      {leaders.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No data available
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-500 mt-1">See how your children rank among other learners</p>
      </div>

      {/* Children Rankings - Clean Cards */}
      {childrenRanks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Children's Rankings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {childrenRanks.map((child) => (
              <Card key={child.id} className="border-l-4 border-l-kodibot-green">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    {child.avatar_url ? (
                      <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/assets/profile-kodibot.png" alt={child.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{child.name}</p>
                    <p className="text-sm text-gray-500">{child.totalPoints} XP</p>
                  </div>
                  <div className="text-right">
                    {child.rank ? (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-kodibot-green" />
                        <span className="font-bold text-lg text-kodibot-green">#{child.rank}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Unranked</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Global Leaderboard - Clean Tabs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Leaderboard</h2>
        <Tabs defaultValue="alltime" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg h-12">
            <TabsTrigger value="weekly" className="rounded-md font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              This Week
            </TabsTrigger>
            <TabsTrigger value="alltime" className="rounded-md font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              All Time
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly">
            <Card>
              <CardContent className="p-4">
                <LeaderList leaders={weeklyLeaders} type="weekly" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alltime">
            <Card>
              <CardContent className="p-4">
                <LeaderList leaders={allTimeLeaders} type="alltime" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <ParentLayout children={page} />
