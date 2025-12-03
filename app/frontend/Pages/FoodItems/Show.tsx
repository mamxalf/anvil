import React from 'react'
import { Link } from '@inertiajs/react'
import { PageProps, FoodItem } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Apple, Flame, Beef, Droplet, Wheat } from 'lucide-react'

interface FoodItemShowProps extends PageProps {
  food_item: FoodItem
}

export default function Show({ food_item, translations }: FoodItemShowProps) {
  const t = translations?.food_items || {}
  const common = translations?.common || {}
  const nutrition = translations?.nutrition || {}

  const formatNumber = (value: unknown, decimals: number) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(decimals) : '-'
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
          <div className="flex items-center gap-4">
            <Link href="/food_items">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {common.back || 'Kembali'}
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{food_item.name}</h1>
                <Badge className={getCategoryColor(food_item.category)}>
                  {food_item.category_name_id}
                </Badge>
              </div>
              {food_item.code && <p className="text-gray-500">{food_item.code}</p>}
            </div>
          </div>
          <Link href={`/food_items/${food_item.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              {common.edit || 'Edit'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nutrition Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5" />
                  <span className="text-sm text-orange-100">{nutrition.energy || 'Energi'}</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(food_item.energy_per_100g, 0)}</p>
                <p className="text-sm text-orange-200">kkal / 100g</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Beef className="h-5 w-5" />
                  <span className="text-sm text-red-100">{nutrition.protein || 'Protein'}</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(food_item.protein_per_100g, 1)}</p>
                <p className="text-sm text-red-200">g / 100g</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="h-5 w-5" />
                  <span className="text-sm text-yellow-100">{nutrition.fat || 'Lemak'}</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(food_item.fat_per_100g, 1)}</p>
                <p className="text-sm text-yellow-200">g / 100g</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wheat className="h-5 w-5" />
                  <span className="text-sm text-amber-100">{nutrition.carbohydrate || 'Karbo'}</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(food_item.carbohydrate_per_100g, 1)}</p>
                <p className="text-sm text-amber-200">g / 100g</p>
              </CardContent>
            </Card>
          </div>

          {/* Portion Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.portion_info || 'Informasi Porsi'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Ukuran Porsi</p>
                <p className="text-lg font-semibold">
                  {food_item.portion_size} {food_item.portion_unit}
                </p>
              </div>
              {food_item.urt_description && (
                <div>
                  <p className="text-sm text-gray-500">{t.urt || 'Ukuran Rumah Tangga'}</p>
                  <p className="text-lg font-semibold">{food_item.urt_description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fiber */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nilai Gizi Lengkap per 100g</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500">{nutrition.energy || 'Energi'}</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(food_item.energy_per_100g, 0)}</p>
                <p className="text-xs text-gray-400">kkal</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500">{nutrition.protein || 'Protein'}</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(food_item.protein_per_100g, 1)}</p>
                <p className="text-xs text-gray-400">g</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500">{nutrition.fat || 'Lemak'}</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(food_item.fat_per_100g, 1)}</p>
                <p className="text-xs text-gray-400">g</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500">{nutrition.carbohydrate || 'Karbohidrat'}</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(food_item.carbohydrate_per_100g, 1)}</p>
                <p className="text-xs text-gray-400">g</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500">{nutrition.fiber || 'Serat'}</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(food_item.fiber_per_100g, 1)}</p>
                <p className="text-xs text-gray-400">g</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {food_item.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{common.description || 'Deskripsi'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{food_item.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

