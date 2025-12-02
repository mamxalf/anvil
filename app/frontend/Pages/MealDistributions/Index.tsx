import React from 'react'
import { Link, router } from '@inertiajs/react'
import { PageProps, MealDistribution, Institution, Menu, DistributionFilters, DistributionStats } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Eye, Pencil, Trash2, Truck, Building2, Users, UtensilsCrossed } from 'lucide-react'

interface MealDistributionsIndexProps extends PageProps {
  distributions: MealDistribution[]
  institutions: Institution[]
  menus: Menu[]
  statistics: DistributionStats
  filters: DistributionFilters
}

export default function Index({ distributions, institutions, menus, statistics, filters, translations }: MealDistributionsIndexProps) {
  const t = translations?.meal_distributions || {}
  const common = translations?.common || {}

  const handleFilter = (key: string, value: string) => {
    router.get('/meal_distributions', { ...filters, [key]: value || undefined }, { preserveState: true })
  }

  const handleDelete = (id: string) => {
    if (confirm(common.confirm_delete || 'Apakah Anda yakin ingin menghapus?')) {
      router.delete(`/meal_distributions/${id}`)
    }
  }

  const stats = [
    { name: 'Total Distribusi', value: statistics.total_distributions, icon: Truck, color: 'bg-blue-500' },
    { name: 'Total Penerima', value: statistics.total_recipients, icon: Users, color: 'bg-emerald-500' },
    { name: 'Institusi', value: statistics.unique_institutions, icon: Building2, color: 'bg-amber-500' },
    { name: 'Menu', value: statistics.unique_menus, icon: UtensilsCrossed, color: 'bg-purple-500' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title || 'Distribusi Makanan'}</h1>
            <p className="text-gray-600">Kelola dan pantau distribusi makanan bergizi</p>
          </div>
          <Link href="/meal_distributions/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t.add_new || 'Catat Distribusi'}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color} rounded-lg p-2`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.name}</p>
                    <p className="text-xl font-bold">{stat.value.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-48">
                <Select
                  value={filters.institution_id || 'all'}
                  onValueChange={(value) => handleFilter('institution_id', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Institusi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Institusi</SelectItem>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={filters.start_date || ''}
                  onChange={e => handleFilter('start_date', e.target.value)}
                  className="w-40"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="date"
                  value={filters.end_date || ''}
                  onChange={e => handleFilter('end_date', e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.distribution_date || 'Tanggal'}</TableHead>
                  <TableHead>Institusi</TableHead>
                  <TableHead>{t.menu_served || 'Menu'}</TableHead>
                  <TableHead className="text-right">{t.recipient_count || 'Penerima'}</TableHead>
                  <TableHead>{t.distributed_by || 'Oleh'}</TableHead>
                  <TableHead className="text-right">{common.actions || 'Aksi'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions.length > 0 ? (
                  distributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell>
                        {new Date(dist.distribution_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{dist.institution?.name}</TableCell>
                      <TableCell>{dist.menu?.name}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        {dist.recipient_count.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>{dist.distributed_by?.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/meal_distributions/${dist.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/meal_distributions/${dist.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(dist.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {common.no_data || 'Tidak ada data'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

