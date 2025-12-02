import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps, FoodItem, SelectOption } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

interface FoodItemFormProps extends PageProps {
  food_item: FoodItem
  categories: SelectOption[]
  is_edit: boolean
}

export default function Form({ food_item, categories, is_edit, errors, translations }: FoodItemFormProps) {
  const t = translations?.food_items || {}
  const common = translations?.common || {}
  const nutrition = translations?.nutrition || {}

  const { data, setData, post, put, processing } = useForm({
    name: food_item.name || '',
    code: food_item.code || '',
    category: food_item.category || '',
    description: food_item.description || '',
    energy_per_100g: food_item.energy_per_100g || 0,
    protein_per_100g: food_item.protein_per_100g || 0,
    fat_per_100g: food_item.fat_per_100g || 0,
    carbohydrate_per_100g: food_item.carbohydrate_per_100g || 0,
    fiber_per_100g: food_item.fiber_per_100g || 0,
    portion_size: food_item.portion_size || 100,
    portion_unit: food_item.portion_unit || 'gram',
    urt_description: food_item.urt_description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (is_edit) {
      put(`/food_items/${food_item.id}`, { data: { food_item: data } })
    } else {
      post('/food_items', { data: { food_item: data } })
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/food_items">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {common.back || 'Kembali'}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {is_edit ? 'Edit Bahan Pangan' : (t.add_new || 'Tambah Bahan Pangan')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{common.name || 'Nama'} *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      placeholder="Nama bahan pangan"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Kode</Label>
                    <Input
                      id="code"
                      value={data.code}
                      onChange={e => setData('code', e.target.value)}
                      placeholder="Contoh: MP001"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category">{common.category || 'Kategori'} *</Label>
                    <Select
                      value={data.category}
                      onValueChange={value => setData('category', value)}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">{common.description || 'Deskripsi'}</Label>
                    <textarea
                      id="description"
                      value={data.description}
                      onChange={e => setData('description', e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Deskripsi bahan pangan (opsional)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition per 100g */}
            <Card>
              <CardHeader>
                <CardTitle>{t.nutrition_per_100g || 'Nilai Gizi per 100g'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="energy_per_100g">{nutrition.energy || 'Energi'} (kkal)</Label>
                    <Input
                      id="energy_per_100g"
                      type="number"
                      step="0.1"
                      value={data.energy_per_100g}
                      onChange={e => setData('energy_per_100g', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="protein_per_100g">{nutrition.protein || 'Protein'} (g)</Label>
                    <Input
                      id="protein_per_100g"
                      type="number"
                      step="0.1"
                      value={data.protein_per_100g}
                      onChange={e => setData('protein_per_100g', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fat_per_100g">{nutrition.fat || 'Lemak'} (g)</Label>
                    <Input
                      id="fat_per_100g"
                      type="number"
                      step="0.1"
                      value={data.fat_per_100g}
                      onChange={e => setData('fat_per_100g', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carbohydrate_per_100g">{nutrition.carbohydrate || 'Karbohidrat'} (g)</Label>
                    <Input
                      id="carbohydrate_per_100g"
                      type="number"
                      step="0.1"
                      value={data.carbohydrate_per_100g}
                      onChange={e => setData('carbohydrate_per_100g', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiber_per_100g">{nutrition.fiber || 'Serat'} (g)</Label>
                    <Input
                      id="fiber_per_100g"
                      type="number"
                      step="0.1"
                      value={data.fiber_per_100g}
                      onChange={e => setData('fiber_per_100g', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portion Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t.portion_info || 'Informasi Porsi'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portion_size">Ukuran Porsi</Label>
                    <Input
                      id="portion_size"
                      type="number"
                      step="0.1"
                      value={data.portion_size}
                      onChange={e => setData('portion_size', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portion_unit">Satuan Porsi</Label>
                    <Select
                      value={data.portion_unit}
                      onValueChange={value => setData('portion_unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gram">gram</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="buah">buah</SelectItem>
                        <SelectItem value="potong">potong</SelectItem>
                        <SelectItem value="lembar">lembar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urt_description">{t.urt || 'URT'}</Label>
                    <Input
                      id="urt_description"
                      value={data.urt_description}
                      onChange={e => setData('urt_description', e.target.value)}
                      placeholder="Contoh: 3/4 gelas"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={processing}
                >
                  {processing ? 'Menyimpan...' : (common.save || 'Simpan')}
                </Button>
                <Link href="/food_items" className="block">
                  <Button type="button" variant="outline" className="w-full">
                    {common.cancel || 'Batal'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Layout>
  )
}

