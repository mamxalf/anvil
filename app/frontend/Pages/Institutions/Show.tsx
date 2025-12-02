import React from 'react'
import { Link } from '@inertiajs/react'
import { PageProps, Institution, MealDistribution } from '@/types'
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
  ArrowLeft,
  Pencil,
  MapPin,
  Phone,
  Mail,
  Users,
  Building2,
  Plus,
} from 'lucide-react'

interface InstitutionShowProps extends PageProps {
  institution: Institution
  recent_distributions: MealDistribution[]
}

export default function Show({ institution, recent_distributions, translations }: InstitutionShowProps) {
  const t = translations?.institutions || {}
  const common = translations?.common || {}

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/institutions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {common.back || 'Kembali'}
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{institution.name}</h1>
                <Badge variant="outline">{institution.institution_type_name_id}</Badge>
              </div>
              {institution.full_address && (
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {institution.full_address}
                </p>
              )}
            </div>
          </div>
          <Link href={`/institutions/${institution.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              {common.edit || 'Edit'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informasi Institusi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t.student_count || 'Jumlah Siswa'}</p>
                  <p className="font-semibold text-lg">{institution.student_count?.toLocaleString('id-ID') || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Penerima Terdaftar</p>
                  <p className="font-semibold text-lg">{institution.total_beneficiaries?.toLocaleString('id-ID') || 0}</p>
                </div>
              </div>

              <hr />

              {institution.contact_person && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t.contact_person || 'Penanggung Jawab'}</p>
                    <p className="font-medium">{institution.contact_person}</p>
                  </div>
                </div>
              )}

              {institution.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t.phone || 'Telepon'}</p>
                    <p className="font-medium">{institution.phone}</p>
                  </div>
                </div>
              )}

              {institution.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t.email || 'Email'}</p>
                    <p className="font-medium">{institution.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Beneficiaries */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Penerima Manfaat</CardTitle>
              <Link href={`/beneficiaries/new?institution_id=${institution.id}`}>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead className="text-right">Usia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institution.beneficiaries && institution.beneficiaries.length > 0 ? (
                    institution.beneficiaries.slice(0, 10).map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell>
                          <Link
                            href={`/beneficiaries/${beneficiary.id}`}
                            className="font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            {beneficiary.name}
                          </Link>
                        </TableCell>
                        <TableCell>{beneficiary.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                        <TableCell className="text-right">{beneficiary.age || '-'} tahun</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        Belum ada penerima manfaat terdaftar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {institution.beneficiaries && institution.beneficiaries.length > 10 && (
                <div className="p-4 text-center border-t">
                  <Link href={`/beneficiaries?institution_id=${institution.id}`}>
                    <Button variant="link">Lihat semua ({institution.total_beneficiaries})</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Distributions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Distribusi Terbaru</CardTitle>
            <Link href={`/meal_distributions/new?institution_id=${institution.id}`}>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Catat Distribusi
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Menu</TableHead>
                  <TableHead className="text-right">Jumlah Penerima</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent_distributions.length > 0 ? (
                  recent_distributions.map((dist) => (
                    <TableRow key={dist.id}>
                      <TableCell>
                        {new Date(dist.distribution_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>{dist.menu?.name}</TableCell>
                      <TableCell className="text-right font-medium">
                        {dist.recipient_count.toLocaleString('id-ID')} orang
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      Belum ada riwayat distribusi
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

