import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps, Beneficiary, TargetGroup, Institution } from '@/types'
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

interface BeneficiaryFormProps extends PageProps {
  beneficiary: Beneficiary
  target_groups: TargetGroup[]
  institutions: Institution[]
  is_edit: boolean
}

export default function Form({ beneficiary, target_groups, institutions, is_edit, errors, translations }: BeneficiaryFormProps) {
  const t = translations?.beneficiaries || {}
  const common = translations?.common || {}

  const { data, setData, post, put, processing } = useForm({
    name: beneficiary.name || '',
    institution_id: beneficiary.institution_id || '',
    target_group_id: beneficiary.target_group_id || '',
    date_of_birth: beneficiary.date_of_birth || '',
    gender: beneficiary.gender || '',
    special_needs: beneficiary.special_needs || '',
    allergies: beneficiary.allergies || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (is_edit) {
      put(`/beneficiaries/${beneficiary.id}`, { data: { beneficiary: data } })
    } else {
      post('/beneficiaries', { data: { beneficiary: data } })
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/beneficiaries">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {common.back || 'Kembali'}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {is_edit ? (t.edit || 'Edit Penerima') : (t.add_new || 'Tambah Penerima')}
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
                      placeholder="Nama lengkap"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">{t.gender || 'Jenis Kelamin'} *</Label>
                    <Select
                      value={data.gender}
                      onValueChange={value => setData('gender', value)}
                    >
                      <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">{t.date_of_birth || 'Tanggal Lahir'}</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={data.date_of_birth}
                      onChange={e => setData('date_of_birth', e.target.value)}
                    />
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
                          <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.institution_id && <p className="text-sm text-red-500">{errors.institution_id}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
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
                </div>
              </CardContent>
            </Card>

            {/* Dietary Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle>{t.dietary_restrictions || 'Pantangan Makanan'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">{t.allergies || 'Alergi'}</Label>
                  <textarea
                    id="allergies"
                    value={data.allergies}
                    onChange={e => setData('allergies', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Contoh: Alergi kacang, susu, seafood"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_needs">{t.special_needs || 'Kebutuhan Khusus'}</Label>
                  <textarea
                    id="special_needs"
                    value={data.special_needs}
                    onChange={e => setData('special_needs', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Contoh: Vegetarian, intoleransi laktosa"
                  />
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
                <Link href="/beneficiaries" className="block">
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

