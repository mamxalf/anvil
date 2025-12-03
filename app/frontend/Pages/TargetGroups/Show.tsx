import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps, TargetGroup } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users } from 'lucide-react'

interface TargetGroupShowProps extends PageProps {
  target_group: TargetGroup
}

export default function Show({ target_group, translations }: TargetGroupShowProps) {
  const t = translations?.target_groups || {}
  const nutrition = translations?.nutrition || {}
  const common = translations?.common || {}
  const page = usePage<PageProps>()
  const auth = page.props.auth
  const user = auth?.user

  const requirements = target_group.nutrition_requirements
  const profiles = target_group.nutrition_profiles || {}

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/target_groups">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {common.back || 'Kembali'}
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{target_group.name}</h1>
              <Badge variant="outline">{target_group.code}</Badge>
            </div>
            {target_group.age_range_start && target_group.age_range_end && (
              <p className="text-gray-600">
                {t.age_range || 'Rentang Usia'}: {target_group.age_range_start} - {target_group.age_range_end} {t.years || 'tahun'}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {target_group.description && (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600">{target_group.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Nutrition Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Macro Nutrients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kebutuhan Gizi Makro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
                  <span className="text-gray-700">{nutrition.energy || 'Energi'}</span>
                  <span className="font-bold text-orange-600">{requirements?.energy || target_group.min_energy} kkal</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                  <span className="text-gray-700">{nutrition.protein || 'Protein'}</span>
                  <span className="font-bold text-red-600">{requirements?.protein || target_group.min_protein} g</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50">
                  <span className="text-gray-700">{nutrition.fat || 'Lemak'}</span>
                  <span className="font-bold text-yellow-600">{requirements?.fat || target_group.min_fat} g</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50">
                  <span className="text-gray-700">{nutrition.carbohydrate || 'Karbohidrat'}</span>
                  <span className="font-bold text-amber-600">{requirements?.carbohydrate || target_group.min_carbohydrate} g</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                  <span className="text-gray-700">{nutrition.fiber || 'Serat'}</span>
                  <span className="font-bold text-green-600">{requirements?.fiber || target_group.min_fiber} g</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitamins & Minerals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vitamin & Mineral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {requirements?.vitamins && Object.entries(requirements.vitamins).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase">Vitamin {key.toUpperCase()}</p>
                    <p className="font-semibold">{value} {key === 'd' ? 'mcg' : 'mg'}</p>
                  </div>
                ))}
                {requirements?.minerals && Object.entries(requirements.minerals).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-gray-500 uppercase">{key}</p>
                    <p className="font-semibold">{value} mg</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nutrition Profiles Overview */}
        {Object.keys(profiles).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profil Kebutuhan Gizi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(profiles).map(([key, profile]) => (
                  <div key={key} className="p-4 rounded-lg bg-gray-50 space-y-2">
                    <p className="text-sm font-semibold text-gray-800">{key}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>{nutrition.energy || 'Energi'}</span>
                        <span className="font-semibold">{profile.energy} kkal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{nutrition.protein || 'Protein'}</span>
                        <span className="font-semibold">{profile.protein} g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{nutrition.fat || 'Lemak'}</span>
                        <span className="font-semibold">{profile.fat} g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{nutrition.carbohydrate || 'Karbo'}</span>
                        <span className="font-semibold">{profile.carbohydrate} g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{nutrition.fiber || 'Serat'}</span>
                        <span className="font-semibold">{profile.fiber} g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href={`/menus?target_group_id=${target_group.id}`}>
                <Button variant="outline">
                  Lihat Menu untuk Kelompok Ini
                </Button>
              </Link>
              <Link href={`/menus/new?target_group_id=${target_group.id}`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Buat Menu Baru
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

