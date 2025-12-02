import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps, User, DashboardStatistics, MealDistribution } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Building2,
  UtensilsCrossed,
  Truck,
  TrendingUp,
  Calendar,
} from 'lucide-react'

interface DashboardProps extends PageProps {
  user: User
  statistics: DashboardStatistics
  recent_distributions: MealDistribution[]
  beneficiary_by_target: Record<string, number>
  monthly_trend: Record<string, number>
}

export default function Index({
  user,
  statistics,
  recent_distributions,
  beneficiary_by_target,
  translations,
}: DashboardProps) {
  const t = translations?.dashboard || {}
  const common = translations?.common || {}

  const stats = [
    {
      name: t.total_beneficiaries || 'Total Penerima Manfaat',
      value: statistics.total_beneficiaries.toLocaleString('id-ID'),
      icon: Users,
      color: 'bg-blue-500',
      href: '/beneficiaries',
    },
    {
      name: t.total_institutions || 'Total Institusi',
      value: statistics.total_institutions.toLocaleString('id-ID'),
      icon: Building2,
      color: 'bg-emerald-500',
      href: '/institutions',
    },
    {
      name: t.total_menus || 'Total Menu',
      value: `${statistics.published_menus} / ${statistics.total_menus}`,
      icon: UtensilsCrossed,
      color: 'bg-amber-500',
      href: '/menus',
    },
    {
      name: t.distributions_this_month || 'Distribusi Bulan Ini',
      value: statistics.distributions_this_month.toLocaleString('id-ID'),
      icon: Truck,
      color: 'bg-purple-500',
      href: '/meal_distributions',
    },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t.title || 'Dasbor'}
          </h1>
          <p className="text-gray-600">
            {t.welcome || 'Selamat datang'}, {user.name}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} rounded-lg p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recipients this month highlight */}
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Total Penerima Bulan Ini</p>
                <p className="text-4xl font-bold mt-1">
                  {statistics.recipients_this_month.toLocaleString('id-ID')}
                </p>
                <p className="text-emerald-200 text-sm mt-1">orang menerima makanan bergizi</p>
              </div>
              <TrendingUp className="h-16 w-16 text-emerald-300" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Beneficiary by Target Group */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Penerima per Kelompok Sasaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(beneficiary_by_target).length > 0 ? (
                  Object.entries(beneficiary_by_target).map(([name, count]) => {
                    const total = Object.values(beneficiary_by_target).reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? (count / total) * 100 : 0
                    return (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{name}</span>
                          <span className="font-medium">{count.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {common.no_data || 'Tidak ada data'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Distributions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.recent_distributions || 'Distribusi Terbaru'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recent_distributions.length > 0 ? (
                  recent_distributions.map((dist) => (
                    <Link
                      key={dist.id}
                      href={`/meal_distributions/${dist.id}`}
                      className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {dist.institution?.name}
                          </p>
                          <p className="text-sm text-gray-500">{dist.menu?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-emerald-600">
                            {dist.recipient_count.toLocaleString('id-ID')} orang
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(dist.distribution_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {common.no_data || 'Tidak ada data'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/menus/new"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition text-center"
              >
                <UtensilsCrossed className="h-8 w-8 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Buat Menu Baru</span>
              </Link>
              <Link
                href="/institutions/new"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-center"
              >
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Tambah Institusi</span>
              </Link>
              <Link
                href="/beneficiaries/new"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-amber-50 hover:bg-amber-100 transition text-center"
              >
                <Users className="h-8 w-8 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Tambah Penerima</span>
              </Link>
              <Link
                href="/meal_distributions/new"
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition text-center"
              >
                <Truck className="h-8 w-8 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Catat Distribusi</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
