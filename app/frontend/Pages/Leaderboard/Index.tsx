import React from 'react'
import Layout from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/hooks/useTranslation'
import { Trophy, Medal, Star } from 'lucide-react'

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

export default function LeaderboardIndex({ weeklyLeaders, allTimeLeaders, currentRank }: LeaderboardProps) {
  const { t } = useTranslation()

  const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />
    return <span className="font-bold text-gray-500 text-lg w-6 text-center">{rank}</span>
  }

  const LeaderList = ({ leaders, type }: { leaders: Leader[], type: 'weekly' | 'alltime' }) => (
    <div className="space-y-4">
      {leaders.map((leader, index) => (
        <div key={leader.id} className={`flex items-center p-4 rounded-xl border ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200' : 'bg-white border-gray-100'}`}>
          <div className="mr-4 flex items-center justify-center w-8">
            <RankIcon rank={index + 1} />
          </div>
          <div className="flex items-center gap-3 flex-grow">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {leader.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{leader.user.name}</p>
              {type === 'weekly' && (
                <p className="text-xs text-gray-500">{leader.weekly_lessons || 0} Lessons this week</p>
              )}
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1 font-black text-primary">
               <Star className="w-4 h-4 fill-primary" />
               {leader.total_points} XP
             </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-8">
       <div className="text-center mb-10">
         <h1 className="text-4xl font-extrabold text-foreground mb-4">🏆 {t('gamification.leaderboard')}</h1>
         <p className="text-xl text-muted-foreground">See who's leading the learning adventure!</p>
         
         {currentRank && (
           <div className="mt-6 inline-block bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
             <span className="font-bold text-primary">Your Rank: #{currentRank}</span>
           </div>
         )}
       </div>

       <Tabs defaultValue="alltime" className="w-full">
         <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-2xl h-14">
           <TabsTrigger value="weekly" className="rounded-xl text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">This Week</TabsTrigger>
           <TabsTrigger value="alltime" className="rounded-xl text-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">All Time</TabsTrigger>
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

LeaderboardIndex.layout = (page: React.ReactNode) => <Layout children={page} />
