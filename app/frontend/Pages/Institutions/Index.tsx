import React from 'react'
import { Link, router } from '@inertiajs/react'
import { PageProps, Institution, InstitutionFilters, SelectOption } from '@/types'
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
import { Plus, Eye, Pencil, Trash2, Search, Building2 } from 'lucide-react'

interface InstitutionsIndexProps extends PageProps {
  institutions: Institution[]
  institution_types: SelectOption[]
  filters: InstitutionFilters
}

export default function Index({ institutions, institution_types, filters, translations }: InstitutionsIndexProps) {
  const t = translations?.institutions || {}
  const common = translations?.common || {}

  const handleFilter = (key: string, value: string) => {
    router.get('/institutions', { ...filters, [key]: value || undefined }, { preserveState: true })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    handleFilter('search', formData.get('search') as string)
  }

  const handleDelete = (id: string) => {
    if (confirm(common.confirm_delete || 'Apakah Anda yakin ingin menghapus?')) {
      router.delete(`/institutions/${id}`)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title || 'Daftar Institusi'}</h1>
            <p className="text-gray-600">Kelola sekolah, posyandu, dan pesantren penerima MBG</p>
          </div>
          <Link href="/institutions/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t.add_new || 'Tambah Institusi'}
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
                    placeholder="Cari nama institusi..."
                    defaultValue={filters.search || ''}
                    className="pl-10 w-64"
                  />
                </div>
                <Button type="submit" variant="outline">Cari</Button>
              </form>
              <div className="w-48">
                <Select
                  value={filters.institution_type || 'all'}
                  onValueChange={(value) => handleFilter('institution_type', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipe Institusi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {institution_types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
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
                  <TableHead>{common.type || 'Tipe'}</TableHead>
                  <TableHead>{t.city || 'Kota'}</TableHead>
                  <TableHead>{t.province || 'Provinsi'}</TableHead>
                  <TableHead className="text-right">{t.student_count || 'Jumlah Siswa'}</TableHead>
                  <TableHead className="text-right">Penerima</TableHead>
                  <TableHead className="text-right">{common.actions || 'Aksi'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutions.length > 0 ? (
                  institutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">{institution.name}</p>
                            {institution.contact_person && (
                              <p className="text-sm text-gray-500">{institution.contact_person}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{institution.institution_type_name_id}</Badge>
                      </TableCell>
                      <TableCell>{institution.city || '-'}</TableCell>
                      <TableCell>{institution.province || '-'}</TableCell>
                      <TableCell className="text-right">
                        {institution.student_count?.toLocaleString('id-ID') || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {institution.total_beneficiaries?.toLocaleString('id-ID') || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/institutions/${institution.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/institutions/${institution.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(institution.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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

