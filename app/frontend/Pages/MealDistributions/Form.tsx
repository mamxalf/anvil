import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps, MealDistribution, Institution, Menu } from '@/types'
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

interface MealDistributionFormProps extends PageProps {
  distribution: MealDistribution
  institutions: Institution[]
  menus: Menu[]
  is_edit: boolean
}

export default function Form({ distribution, institutions, menus, is_edit, errors, translations }: MealDistributionFormProps) {
  const t = translations?.meal_distributions || {}
  const common = translations?.common || {}

  const { data, setData, post, put, processing } = useForm({
    institution_id: distribution.institution_id || '',
    menu_id: distribution.menu_id || '',
    distribution_date: distribution.distribution_date || new Date().toISOString().split('T')[0],
    recipient_count: distribution.recipient_count || 0,
    notes: distribution.notes || '',
  })

  const selectedInstitution = institutions.find(i => i.id === data.institution_id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (is_edit) {
      put(`/meal_distributions/${distribution.id}`, { data: { meal_distribution: data } })
    } else {
      post('/meal_distributions', { data: { meal_distribution: data } })
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/meal_distributions">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {common.back || 'Kembali'}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {is_edit ? (t.edit || 'Edit Distribusi') : (t.add_new || 'Catat Distribusi')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Distribusi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distribution_date">{t.distribution_date || 'Tanggal Distribusi'} *</Label>
                    <Input
                      id="distribution_date"
                      type="date"
                      value={data.distribution_date}
                      onChange={e => setData('distribution_date', e.target.value)}
                      className={errors.distribution_date ? 'border-red-500' : ''}
                    />
                    {errors.distribution_date && <p className="text-sm text-red-500">{errors.distribution_date}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient_count">{t.recipient_count || 'Jumlah Penerima'} *</Label>
                    <Input
                      id="recipient_count"
                      type="number"
                      value={data.recipient_count}
                      onChange={e => setData('recipient_count', parseInt(e.target.value) || 0)}
                      min="0"
                      className={errors.recipient_count ? 'border-red-500' : ''}
                    />
                    {errors.recipient_count && <p className="text-sm text-red-500">{errors.recipient_count}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution_id">Institusi *</Label>
                    <Select
                      value={data.institution_id}
                      onValueChange={value => setData('institution_id', value)}
                    >
                      <SelectTrigger className={errors.institution_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih institusi" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map(inst => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.name} ({inst.student_count} siswa)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.institution_id && <p className="text-sm text-red-500">{errors.institution_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="menu_id">{t.menu_served || 'Menu'} *</Label>
                    <Select
                      value={data.menu_id}
                      onValueChange={value => setData('menu_id', value)}
                    >
                      <SelectTrigger className={errors.menu_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih menu" />
                      </SelectTrigger>
                      <SelectContent>
                        {menus.map(menu => (
                          <SelectItem key={menu.id} value={menu.id}>
                            {menu.name} - {menu.target_group?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.menu_id && <p className="text-sm text-red-500">{errors.menu_id}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t.notes || 'Catatan'}</Label>
                  <textarea
                    id="notes"
                    value={data.notes}
                    onChange={e => setData('notes', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Catatan tambahan (opsional)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedInstitution && (
                  <div className="p-4 rounded-lg bg-emerald-50">
                    <p className="text-sm text-emerald-700">Institusi Terpilih</p>
                    <p className="font-semibold text-emerald-800">{selectedInstitution.name}</p>
                    <p className="text-sm text-emerald-600">{selectedInstitution.student_count} siswa terdaftar</p>
                  </div>
                )}

                {data.recipient_count > 0 && (
                  <div className="p-4 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-700">Jumlah Penerima</p>
                    <p className="text-2xl font-bold text-blue-800">{data.recipient_count.toLocaleString('id-ID')}</p>
                    <p className="text-sm text-blue-600">orang</p>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={processing}
                  >
                    {processing ? 'Menyimpan...' : (common.save || 'Simpan')}
                  </Button>
                  <Link href="/meal_distributions" className="block">
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

