import React from 'react'
import { Link } from '@inertiajs/react'
import { PageProps, MealDistribution } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Pencil,
  Calendar,
  Building2,
  UtensilsCrossed,
  Users,
  User,
} from 'lucide-react'

interface MealDistributionShowProps extends PageProps {
  distribution: MealDistribution
}

export default function Show({ distribution, translations }: MealDistributionShowProps) {
  const t = translations?.meal_distributions || {}
  const common = translations?.common || {}
  const nutrition = translations?.nutrition || {}

  const formatNumber = (value: unknown, decimals: number) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(decimals) : '-'
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/meal_distributions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {common.back || 'Kembali'}
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Distribusi</h1>
              <p className="text-gray-600">
                {new Date(distribution.distribution_date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <Link href={`/meal_distributions/${distribution.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              {common.edit || 'Edit'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Institusi</p>
                    <Link
                      href={`/institutions/${distribution.institution?.id}`}
                      className="font-semibold text-lg text-blue-600 hover:text-blue-700"
                    >
                      {distribution.institution?.name}
                    </Link>
                    <p className="text-sm text-gray-500">{distribution.institution?.institution_type_name_id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-100">
                    <UtensilsCrossed className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.menu_served || 'Menu'}</p>
                    <Link
                      href={`/menus/${distribution.menu?.id}`}
                      className="font-semibold text-lg text-amber-600 hover:text-amber-700"
                    >
                      {distribution.menu?.name}
                    </Link>
                    <p className="text-sm text-gray-500">{distribution.target_group_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.recipient_count || 'Jumlah Penerima'}</p>
                    <p className="font-semibold text-2xl text-emerald-600">
                      {distribution.recipient_count.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-500">orang</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.distributed_by || 'Didistribusikan Oleh'}</p>
                    <p className="font-semibold text-lg">{distribution.distributed_by?.name}</p>
                  </div>
                </div>
              </div>

              {distribution.notes && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-2">{t.notes || 'Catatan'}</p>
                  <p className="text-gray-700">{distribution.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nutrition Delivered */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Gizi Terdistribusi</CardTitle>
            </CardHeader>
            <CardContent>
              {distribution.nutrition_delivered && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                    <p className="text-sm text-emerald-100">{nutrition.energy || 'Energi'}</p>
                    <p className="text-2xl font-bold">
                      {distribution.nutrition_delivered.energy?.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-emerald-100">kkal total</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg bg-gray-50 text-center">
                      <p className="text-xs text-gray-500">{nutrition.protein || 'Protein'}</p>
                      <p className="font-bold text-gray-900">
                        {formatNumber(
                          distribution.nutrition_delivered.protein != null
                            ? distribution.nutrition_delivered.protein / 1000
                            : null,
                          1
                        )}
                      </p>
                      <p className="text-xs text-gray-500">kg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 text-center">
                      <p className="text-xs text-gray-500">{nutrition.fat || 'Lemak'}</p>
                      <p className="font-bold text-gray-900">
                        {formatNumber(
                          distribution.nutrition_delivered.fat != null
                            ? distribution.nutrition_delivered.fat / 1000
                            : null,
                          1
                        )}
                      </p>
                      <p className="text-xs text-gray-500">kg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 text-center">
                      <p className="text-xs text-gray-500">{nutrition.carbohydrate || 'Karbo'}</p>
                      <p className="font-bold text-gray-900">
                        {formatNumber(
                          distribution.nutrition_delivered.carbohydrate != null
                            ? distribution.nutrition_delivered.carbohydrate / 1000
                            : null,
                          1
                        )}
                      </p>
                      <p className="text-xs text-gray-500">kg</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

