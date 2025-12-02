import React from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps, Institution, SelectOption } from '@/types'
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

interface InstitutionFormProps extends PageProps {
  institution: Institution
  institution_types: SelectOption[]
  is_edit: boolean
}

export default function Form({ institution, institution_types, is_edit, errors, translations }: InstitutionFormProps) {
  const t = translations?.institutions || {}
  const common = translations?.common || {}

  const { data, setData, post, put, processing } = useForm({
    name: institution.name || '',
    institution_type: institution.institution_type || '',
    address: institution.address || '',
    province: institution.province || '',
    city: institution.city || '',
    district: institution.district || '',
    postal_code: institution.postal_code || '',
    phone: institution.phone || '',
    email: institution.email || '',
    student_count: institution.student_count || 0,
    contact_person: institution.contact_person || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (is_edit) {
      put(`/institutions/${institution.id}`, { data: { institution: data } })
    } else {
      post('/institutions', { data: { institution: data } })
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/institutions">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {common.back || 'Kembali'}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {is_edit ? (t.edit || 'Edit Institusi') : (t.add_new || 'Tambah Institusi')}
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
                      placeholder="Nama institusi"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution_type">{common.type || 'Tipe'} *</Label>
                    <Select
                      value={data.institution_type}
                      onValueChange={value => setData('institution_type', value)}
                    >
                      <SelectTrigger className={errors.institution_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Pilih tipe institusi" />
                      </SelectTrigger>
                      <SelectContent>
                        {institution_types.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.institution_type && <p className="text-sm text-red-500">{errors.institution_type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student_count">{t.student_count || 'Jumlah Siswa'}</Label>
                    <Input
                      id="student_count"
                      type="number"
                      value={data.student_count}
                      onChange={e => setData('student_count', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_person">{t.contact_person || 'Penanggung Jawab'}</Label>
                    <Input
                      id="contact_person"
                      value={data.contact_person}
                      onChange={e => setData('contact_person', e.target.value)}
                      placeholder="Nama penanggung jawab"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Alamat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">{t.address || 'Alamat'}</Label>
                  <textarea
                    id="address"
                    value={data.address}
                    onChange={e => setData('address', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Alamat lengkap"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">{t.province || 'Provinsi'}</Label>
                    <Input
                      id="province"
                      value={data.province}
                      onChange={e => setData('province', e.target.value)}
                      placeholder="Provinsi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t.city || 'Kota/Kabupaten'}</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={e => setData('city', e.target.value)}
                      placeholder="Kota/Kabupaten"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">{t.district || 'Kecamatan'}</Label>
                    <Input
                      id="district"
                      value={data.district}
                      onChange={e => setData('district', e.target.value)}
                      placeholder="Kecamatan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">{t.postal_code || 'Kode Pos'}</Label>
                    <Input
                      id="postal_code"
                      value={data.postal_code}
                      onChange={e => setData('postal_code', e.target.value)}
                      placeholder="Kode Pos"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.phone || 'Telepon'}</Label>
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={e => setData('phone', e.target.value)}
                      placeholder="Nomor telepon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email || 'Email'}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      placeholder="Email"
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
                <Link href="/institutions" className="block">
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

