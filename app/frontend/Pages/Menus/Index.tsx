import React from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import { PageProps, Menu, TargetGroup, MenuFilters } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'

interface MenusIndexProps extends PageProps {
  menus: Menu[]
  target_groups: TargetGroup[]
  filters: MenuFilters
}

export default function Index({ menus, target_groups, filters, translations }: MenusIndexProps) {
  const t = translations?.menus || {}
  const common = translations?.common || {}

  const formatNumber = (value: unknown, decimals: number) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(decimals) : '-'
  }

  const handleFilter = (key: string, value: string) => {
    router.get('/menus', { ...filters, [key]: value || undefined }, { preserveState: true })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline',
    }
    const labels: Record<string, string> = {
      draft: (t.status as Record<string, string>)?.draft || 'Draf',
      published: (t.status as Record<string, string>)?.published || 'Dipublikasi',
      archived: (t.status as Record<string, string>)?.archived || 'Diarsipkan',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const handleDelete = (id: string) => {
    if (confirm(common.confirm_delete || 'Apakah Anda yakin ingin menghapus?')) {
      router.delete(`/menus/${id}`)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title || 'Daftar Menu'}</h1>
            <p className="text-gray-600">Kelola menu makanan bergizi untuk penerima manfaat</p>
          </div>
          <Link href="/menus/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t.add_new || 'Buat Menu Baru'}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="w-48">
                <Select
                  value={filters.target_group_id || 'all'}
                  onValueChange={(value) => handleFilter('target_group_id', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kelompok Sasaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelompok</SelectItem>
                    {target_groups.map((tg) => (
                      <SelectItem key={tg.id} value={tg.id}>
                        {tg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) => handleFilter('status', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draf</SelectItem>
                    <SelectItem value="published">Dipublikasi</SelectItem>
                    <SelectItem value="archived">Diarsipkan</SelectItem>
                  </SelectContent>
                </Select>
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
                  <TableHead>{common.name || 'Nama'}</TableHead>
                  <TableHead>Kelompok Sasaran</TableHead>
                  <TableHead className="text-center">Hari</TableHead>
                  <TableHead className="text-right">Energi (kkal)</TableHead>
                  <TableHead className="text-right">Protein (g)</TableHead>
                  <TableHead>{common.status || 'Status'}</TableHead>
                  <TableHead className="text-right">{common.actions || 'Aksi'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <TableRow key={menu.id}>
                      <TableCell className="font-medium">{menu.name}</TableCell>
                      <TableCell>{menu.target_group?.name}</TableCell>
                      <TableCell className="text-center">{menu.day_number || '-'}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(menu.total_energy, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(menu.total_protein, 1)}
                      </TableCell>
                      <TableCell>{getStatusBadge(menu.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/menus/${menu.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/menus/${menu.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(menu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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

