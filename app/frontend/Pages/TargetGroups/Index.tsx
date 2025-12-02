import React from 'react'
import { Link } from '@inertiajs/react'
import { PageProps, TargetGroup } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Users, Zap, Beef, Droplet, Wheat } from 'lucide-react'

interface TargetGroupsIndexProps extends PageProps {
  target_groups: TargetGroup[]
}

export default function Index({ target_groups, translations }: TargetGroupsIndexProps) {
  const t = translations?.target_groups || {}
  const nutrition = translations?.nutrition || {}

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title || 'Kelompok Sasaran'}</h1>
          <p className="text-gray-600">Standar gizi untuk setiap kelompok penerima MBG</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {target_groups.map((group) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge variant="outline">{group.code}</Badge>
                </div>
                {group.age_range_start && group.age_range_end && (
                  <p className="text-sm text-gray-500">
                    {t.age_range || 'Rentang Usia'}: {group.age_range_start} - {group.age_range_end} {t.years || 'tahun'}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t.nutrition_requirements || 'Kebutuhan Gizi Minimal'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-orange-50">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-gray-500">{nutrition.energy || 'Energi'}</p>
                        <p className="text-sm font-semibold">{group.min_energy} kkal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded bg-red-50">
                      <Beef className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">{nutrition.protein || 'Protein'}</p>
                        <p className="text-sm font-semibold">{group.min_protein} g</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded bg-yellow-50">
                      <Droplet className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-gray-500">{nutrition.fat || 'Lemak'}</p>
                        <p className="text-sm font-semibold">{group.min_fat} g</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 rounded bg-amber-50">
                      <Wheat className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-500">{nutrition.carbohydrate || 'Karbo'}</p>
                        <p className="text-sm font-semibold">{group.min_carbohydrate} g</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link href={`/target_groups/${group.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

