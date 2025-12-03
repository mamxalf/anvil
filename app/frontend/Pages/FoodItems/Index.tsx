import React from 'react'
import { Link, router } from '@inertiajs/react'
import { PageProps, FoodItem, SelectOption } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Plus, Eye, Pencil, Trash2, Search, Apple } from 'lucide-react'

interface FoodItemsIndexProps extends PageProps {
  food_items: FoodItem[]
  categories: SelectOption[]
  filters: { category?: string; search?: string }
}

export default function Index({ food_items, categories, filters, translations }: FoodItemsIndexProps) {
  const t = translations?.food_items || {}
  const common = translations?.common || {}
  const nutrition = translations?.nutrition || {}

  const formatNumber = (value: unknown, decimals: number) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(decimals) : '-'
  }

  const handleFilter = (key: string, value: string) => {
    router.get('/food_items', { ...filters, [key]: value || undefined }, { preserveState: true })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    handleFilter('search', formData.get('search') as string)
  }

  const handleDelete = (id: string) => {
    if (confirm(common.confirm_delete || 'Apakah Anda yakin ingin menghapus?')) {
      router.delete(`/food_items/${id}`)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      makanan_pokok: 'bg-amber-100 text-amber-800',
      lauk_hewani: 'bg-red-100 text-red-800',
      lauk_nabati: 'bg-green-100 text-green-800',
      sayuran: 'bg-emerald-100 text-emerald-800',
      buah: 'bg-orange-100 text-orange-800',
      susu: 'bg-blue-100 text-blue-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title || 'Daftar Bahan Pangan'}</h1>
            <p className="text-gray-600">Database bahan pangan dengan nilai gizi per 100 gram</p>
          </div>
          <Link href="/food_items/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t.add_new || 'Tambah Bahan Pangan'}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    name="search"
                    placeholder="Cari bahan pangan..."
                    defaultValue={filters.search || ''}
                    className="pl-10 w-64"
                  />
                </div>
                <Button type="submit" variant="outline">Cari</Button>
              </form>
              <div className="w-48">
                <Select
                  value={filters.category || 'all'}
                  onValueChange={(value) => handleFilter('category', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
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
                  <TableHead>{common.category || 'Kategori'}</TableHead>
                  <TableHead className="text-right">{nutrition.energy || 'Energi'}</TableHead>
                  <TableHead className="text-right">{nutrition.protein || 'Protein'}</TableHead>
                  <TableHead className="text-right">{nutrition.fat || 'Lemak'}</TableHead>
                  <TableHead className="text-right">{nutrition.carbohydrate || 'Karbo'}</TableHead>
                  <TableHead>URT</TableHead>
                  <TableHead className="text-right">{common.actions || 'Aksi'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {food_items.length > 0 ? (
                  food_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Apple className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.code && <p className="text-xs text-gray-400">{item.code}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category_name_id}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(item.energy_per_100g, 0)} kkal
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(item.protein_per_100g, 1)} g
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(item.fat_per_100g, 1)} g
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(item.carbohydrate_per_100g, 1)} g
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{item.urt_description || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/food_items/${item.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/food_items/${item.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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

