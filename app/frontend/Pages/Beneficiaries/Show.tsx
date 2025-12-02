import React from 'react'
import { Link } from '@inertiajs/react'
import { PageProps, Beneficiary } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Pencil,
  User,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react'

interface BeneficiaryShowProps extends PageProps {
  beneficiary: Beneficiary
}

export default function Show({ beneficiary, translations }: BeneficiaryShowProps) {
  const t = translations?.beneficiaries || {}
  const common = translations?.common || {}

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/beneficiaries">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {common.back || 'Kembali'}
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{beneficiary.name}</h1>
                <Badge variant="outline">{beneficiary.target_group?.name}</Badge>
              </div>
              <p className="text-gray-600">{beneficiary.institution?.name}</p>
            </div>
          </div>
          <Link href={`/beneficiaries/${beneficiary.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              {common.edit || 'Edit'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t.gender || 'Jenis Kelamin'}</p>
                  <p className="font-medium">{beneficiary.gender_name_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t.age || 'Usia'}</p>
                  <p className="font-medium">{beneficiary.age || '-'} tahun</p>
                </div>
              </div>

              {beneficiary.date_of_birth && (
                <div className="flex items-center gap-3 pt-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">{t.date_of_birth || 'Tanggal Lahir'}</p>
                    <p className="font-medium">
                      {new Date(beneficiary.date_of_birth).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Institution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Institusi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/institutions/${beneficiary.institution?.id}`}
                className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="font-medium text-emerald-600">{beneficiary.institution?.name}</p>
                <p className="text-sm text-gray-500">{beneficiary.institution?.institution_type_name_id}</p>
              </Link>

              <div className="mt-4 p-4 rounded-lg bg-emerald-50">
                <p className="text-sm text-emerald-700">Kelompok Sasaran</p>
                <p className="font-semibold text-emerald-800">{beneficiary.target_group?.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dietary Restrictions */}
          {beneficiary.has_dietary_restrictions && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  {t.dietary_restrictions || 'Pantangan Makanan'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {beneficiary.allergies && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{t.allergies || 'Alergi'}</p>
                      <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                        <p className="text-red-700">{beneficiary.allergies}</p>
                      </div>
                    </div>
                  )}
                  {beneficiary.special_needs && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">{t.special_needs || 'Kebutuhan Khusus'}</p>
                      <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                        <p className="text-amber-700">{beneficiary.special_needs}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}

