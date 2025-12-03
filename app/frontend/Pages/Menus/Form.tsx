import React, { useState, useMemo } from 'react'
import { Link, useForm, router } from '@inertiajs/react'
import { PageProps, Menu, TargetGroup, FoodItem } from '@/types'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface MenuFormProps extends PageProps {
  menu: Menu
  target_groups: TargetGroup[]
  food_items: FoodItem[]
  is_edit: boolean
}

interface MenuItemForm {
  id?: string
  food_item_id: string
  portion_size: number
  portion_unit: string
  meal_type: string
  _destroy?: boolean
}

export default function Form({ menu, target_groups, food_items, is_edit, errors, translations }: MenuFormProps) {
  const t = translations?.menus || {}
  const common = translations?.common || {}

  const [menuItems, setMenuItems] = useState<MenuItemForm[]>(
    menu.menu_items?.map(item => ({
      id: item.id,
      food_item_id: item.food_item_id,
      portion_size: item.portion_size,
      portion_unit: item.portion_unit,
      meal_type: item.meal_type,
    })) || []
  )

  const { data, setData, processing } = useForm({
    name: menu.name || '',
    description: menu.description || '',
    target_group_id: menu.target_group_id || '',
    day_number: menu.day_number || 1,
    nutrition_profile: (menu as any).nutrition_profile || 'standard',
    menu_items_attributes: menuItems,
  })

  const selectedTargetGroup = useMemo(() => {
    return target_groups.find(tg => tg.id === data.target_group_id)
  }, [data.target_group_id, target_groups])

  const availableProfiles = useMemo(() => {
    if (!selectedTargetGroup) return [] as string[]
    const profiles = selectedTargetGroup.nutrition_profiles || {}
    const keys = Object.keys(profiles)
    return keys.length > 0 ? keys : ['standard']
  }, [selectedTargetGroup])

  const getProfileLabel = (key: string) => {
    if (key === 'standard') return 'Standar'
    if (key === 'high_protein') return 'Tinggi Protein'
    return key.replace(/_/g, ' ')
  }

  const calculateNutrition = useMemo(() => {
    let energy = 0, protein = 0, fat = 0, carbohydrate = 0

    menuItems.filter(mi => !mi._destroy).forEach(mi => {
      const foodItem = food_items.find(fi => fi.id === mi.food_item_id)
      if (foodItem) {
        const multiplier = mi.portion_size / 100
        energy += foodItem.energy_per_100g * multiplier
        protein += foodItem.protein_per_100g * multiplier
        fat += foodItem.fat_per_100g * multiplier
        carbohydrate += foodItem.carbohydrate_per_100g * multiplier
      }
    })

    return { energy, protein, fat, carbohydrate }
  }, [menuItems, food_items])

  const activeProfileKey = (data as any).nutrition_profile || 'standard'

  const nutritionCompliance = useMemo(() => {
    if (!selectedTargetGroup) return null

    const profiles = selectedTargetGroup.nutrition_profiles || {}
    const profileReq = profiles[activeProfileKey]

    const req = profileReq || selectedTargetGroup.nutrition_requirements || {
      energy: selectedTargetGroup.min_energy,
      protein: selectedTargetGroup.min_protein,
      fat: selectedTargetGroup.min_fat,
      carbohydrate: selectedTargetGroup.min_carbohydrate,
      fiber: selectedTargetGroup.min_fiber,
    }

    const energyRequired = Number(req.energy ?? selectedTargetGroup.min_energy)
    const proteinRequired = Number(req.protein ?? selectedTargetGroup.min_protein)
    const fatRequired = Number(req.fat ?? selectedTargetGroup.min_fat)
    const carbohydrateRequired = Number(req.carbohydrate ?? selectedTargetGroup.min_carbohydrate)

    return {
      energy: {
        value: calculateNutrition.energy,
        required: energyRequired,
        met: energyRequired ? calculateNutrition.energy >= energyRequired : false,
      },
      protein: {
        value: calculateNutrition.protein,
        required: proteinRequired,
        met: proteinRequired ? calculateNutrition.protein >= proteinRequired : false,
      },
      fat: {
        value: calculateNutrition.fat,
        required: fatRequired,
        met: fatRequired ? calculateNutrition.fat >= fatRequired : false,
      },
      carbohydrate: {
        value: calculateNutrition.carbohydrate,
        required: carbohydrateRequired,
        met: carbohydrateRequired ? calculateNutrition.carbohydrate >= carbohydrateRequired : false,
      },
    }
  }, [selectedTargetGroup, calculateNutrition, activeProfileKey])

  const formatNumber = (value: unknown, decimals: number) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(decimals) : '-'
  }

  const addMenuItem = () => {
    setMenuItems([...menuItems, {
      food_item_id: '',
      portion_size: 100,
      portion_unit: 'gram',
      meal_type: 'makanan_utama',
    }])
  }

  const updateMenuItem = (index: number, field: string, value: any) => {
    const updated = [...menuItems]
    updated[index] = { ...updated[index], [field]: value }
    setMenuItems(updated)
  }

  const removeMenuItem = (index: number) => {
    const updated = [...menuItems]
    if (updated[index].id) {
      updated[index]._destroy = true
    } else {
      updated.splice(index, 1)
    }
    setMenuItems(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData: any = { ...data, menu_items_attributes: menuItems }

    if (is_edit) {
      router.put(`/menus/${menu.id}`, { menu: formData as any })
    } else {
      router.post('/menus', { menu: formData as any })
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/menus">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {common.back || 'Kembali'}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {is_edit ? String(t.edit || 'Edit Menu') : String(t.add_new || 'Buat Menu Baru')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{common.name || 'Nama'} *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      placeholder="Contoh: Menu Hari 1 - SD"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_group_id">Kelompok Sasaran *</Label>
                    <Select
                      value={data.target_group_id}
                      onValueChange={value => setData('target_group_id', value)}
                    >
                      <SelectTrigger className={errors.target_group_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih kelompok sasaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {target_groups.map(tg => (
                          <SelectItem key={tg.id} value={tg.id}>{tg.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.target_group_id && <p className="text-sm text-red-500">{errors.target_group_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nutrition_profile">Profil Gizi</Label>
                    <Select
                      value={(data as any).nutrition_profile || availableProfiles[0] || ''}
                      onValueChange={value => setData('nutrition_profile' as any, value)}
                      disabled={!selectedTargetGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih profil gizi" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProfiles.map((key) => (
                          <SelectItem key={key} value={key}>
                            {getProfileLabel(key)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="day_number">Hari ke</Label>
                    <Select
                      value={String(data.day_number)}
                      onValueChange={value => setData('day_number', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(day => (
                          <SelectItem key={day} value={String(day)}>Hari {day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{common.description || 'Deskripsi'}</Label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Deskripsi menu (opsional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Menu Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Bahan Pangan</CardTitle>
                <Button type="button" onClick={addMenuItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bahan Pangan</TableHead>
                      <TableHead className="w-24">Porsi</TableHead>
                      <TableHead className="w-24">Satuan</TableHead>
                      <TableHead className="w-32">Tipe</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuItems.filter(mi => !mi._destroy).length > 0 ? (
                      menuItems.map((item, index) => !item._destroy && (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.food_item_id}
                              onValueChange={value => updateMenuItem(index, 'food_item_id', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih bahan pangan" />
                              </SelectTrigger>
                              <SelectContent>
                                {food_items.map(fi => (
                                  <SelectItem key={fi.id} value={fi.id}>
                                    {fi.name} ({fi.category_name_id})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.portion_size}
                              onChange={e => updateMenuItem(index, 'portion_size', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.1"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.portion_unit}
                              onValueChange={value => updateMenuItem(index, 'portion_unit', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gram">gram</SelectItem>
                                <SelectItem value="porsi">porsi</SelectItem>
                                <SelectItem value="buah">buah</SelectItem>
                                <SelectItem value="potong">potong</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.meal_type}
                              onValueChange={value => updateMenuItem(index, 'meal_type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="makanan_utama">Utama</SelectItem>
                                <SelectItem value="selingan">Selingan</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => removeMenuItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Klik "Tambah" untuk menambahkan bahan pangan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Gizi</CardTitle>
              </CardHeader>
              <CardContent>
                {nutritionCompliance ? (
                  <div className="space-y-4">
                    {Object.entries(nutritionCompliance).map(([key, data]) => {
                      const value = Number(data.value)
                      const required = Number(data.required)
                      const progress =
                        Number.isFinite(required) && required > 0 && Number.isFinite(value)
                          ? Math.min((value / required) * 100, 100)
                          : 0

                      return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600 capitalize">{key}</span>
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
                    )})}

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        Target: <strong>{selectedTargetGroup?.name}</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Pilih kelompok sasaran untuk melihat kebutuhan gizi
                  </p>
                )}

                <div className="mt-6 space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={processing}
                  >
                    {processing ? 'Menyimpan...' : (common.save || 'Simpan')}
                  </Button>
                  <Link href="/menus" className="block">
                    <Button type="button" variant="outline" className="w-full">
                      {common.cancel || 'Batal'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Layout>
  )
}

