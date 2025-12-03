import { Link, router } from '@inertiajs/react'
import { PageProps, Menu, NutritionCompliance } from '@/types'
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
import { ArrowLeft, Pencil, CheckCircle, XCircle, Send, Archive } from 'lucide-react'

interface MenuShowProps extends PageProps {
  menu: Menu
  nutrition_compliance: NutritionCompliance
}

export default function Show({ menu, nutrition_compliance, translations }: MenuShowProps) {
  const t = (translations?.menus || {}) as Record<string, string>
  const nutrition = (translations?.nutrition || {}) as Record<string, string>
  const common = (translations?.common || {}) as Record<string, string>

  const getProfileLabel = (key?: string | null) => {
    if (!key) return ''
    if (key === 'standard') return 'Standar'
    if (key === 'high_protein') return 'Tinggi Protein'
    return key.replace(/_/g, ' ')
  }

  const formatNumber = (value: unknown, decimals: number) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(decimals) : '-'
  }

  const handlePublish = () => {
    router.patch(`/menus/${menu.id}/publish`)
  }

  const handleArchive = () => {
    router.patch(`/menus/${menu.id}/archive`)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline',
    }
    const labels: Record<string, string> = {
      draft: 'Draf',
      published: 'Dipublikasi',
      archived: 'Diarsipkan',
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/menus">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {common.back || 'Kembali'}
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
                {getStatusBadge(menu.status)}
              </div>
              <p className="text-gray-600">
                {menu.target_group?.name} • Hari ke-{menu.day_number || '-'}
                {menu.nutrition_profile && (
                  <> • Profil: {getProfileLabel(menu.nutrition_profile)}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {menu.status === 'draft' && (
              <Button onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="h-4 w-4 mr-2" />
                Publikasi
              </Button>
            )}
            {menu.status === 'published' && (
              <Button variant="outline" onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Arsipkan
              </Button>
            )}
            <Link href={`/menus/${menu.id}/edit`}>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                {common.edit || 'Edit'}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nutrition Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">{t.nutrition_summary || 'Ringkasan Gizi'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(nutrition_compliance).map(([key, data]) => {
                  const value = typeof data.value === 'number' ? data.value : Number(data.value)
                  const required = typeof data.required === 'number' ? data.required : Number(data.required)
                  const progress =
                    Number.isFinite(required) && required > 0 && Number.isFinite(value)
                      ? Math.min((value / required) * 100, 100)
                      : 0

                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 capitalize">
                          {nutrition[key as keyof typeof nutrition] || key}
                        </span>
                        {data.met ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              data.met ? 'bg-emerald-500' : 'bg-red-400'
                            }`}
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-24 text-right">
                          {formatNumber(data.value, 1)} / {formatNumber(data.required, 1)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  {menu.meets_requirements ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="font-medium text-emerald-700">
                        {t.meets_requirements || 'Memenuhi Syarat'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-red-700">
                        {t.does_not_meet_requirements || 'Belum Memenuhi Syarat'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Daftar Bahan Pangan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bahan Pangan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Porsi</TableHead>
                    <TableHead className="text-right">Energi</TableHead>
                    <TableHead className="text-right">Protein</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.menu_items && menu.menu_items.length > 0 ? (
                    menu.menu_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.food_item?.name}</TableCell>
                        <TableCell>{item.food_item?.category_name_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.meal_type === 'makanan_utama' ? 'Utama' : 'Selingan'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.portion_size} {item.portion_unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.energy, 0)} kkal
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.protein, 1)} g
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Belum ada bahan pangan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {menu.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{common.description || 'Deskripsi'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{menu.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

