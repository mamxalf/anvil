import React from 'react'
import { Link, router } from '@inertiajs/react'
import { PageProps, Beneficiary, TargetGroup, Institution, BeneficiaryFilters } from '@/types'
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
import { Plus, Eye, Pencil, Trash2, Search, AlertCircle } from 'lucide-react'

interface BeneficiariesIndexProps extends PageProps {
  beneficiaries: Beneficiary[]
  target_groups: TargetGroup[]
  institutions: Institution[]
  filters: BeneficiaryFilters
}

export default function Index({ beneficiaries, target_groups, institutions, filters, translations }: BeneficiariesIndexProps) {
  const t = translations?.beneficiaries || {}
  const common = translations?.common || {}

  const handleFilter = (key: string, value: string) => {
    router.get('/beneficiaries', { ...filters, [key]: value || undefined }, { preserveState: true })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    handleFilter('search', formData.get('search') as string)
  }

  const handleDelete = (id: string) => {
    if (confirm(common.confirm_delete || 'Apakah Anda yakin ingin menghapus?')) {
      router.delete(`/beneficiaries/${id}`)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title || 'Daftar Penerima Manfaat'}</h1>
            <p className="text-gray-600">Kelola data penerima makanan bergizi gratis</p>
          </div>
          <Link href="/beneficiaries/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              {t.add_new || 'Tambah Penerima'}
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
                    placeholder="Cari nama penerima..."
                    defaultValue={filters.search || ''}
                    className="pl-10 w-64"
                  />
                </div>
                <Button type="submit" variant="outline">Cari</Button>
              </form>
              <div className="w-48">
                <Select
                  value={filters.target_group_id || 'all'}
                  onValueChange={(value) => handleFilter('target_group_id', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kelompok Sasaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelompok</SelectItem>
                    {target_groups.map((tg) => (
                      <SelectItem key={tg.id} value={tg.id}>{tg.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select
                  value={filters.institution_id || 'all'}
                  onValueChange={(value) => handleFilter('institution_id', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Institusi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Institusi</SelectItem>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Select
                  value={filters.gender || 'all'}
                  onValueChange={(value) => handleFilter('gender', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
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
                  <TableHead>Institusi</TableHead>
                  <TableHead>Kelompok Sasaran</TableHead>
                  <TableHead>{t.gender || 'Gender'}</TableHead>
                  <TableHead className="text-right">{t.age || 'Usia'}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">{common.actions || 'Aksi'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficiaries.length > 0 ? (
                  beneficiaries.map((beneficiary) => (
                    <TableRow key={beneficiary.id}>
                      <TableCell className="font-medium">{beneficiary.name}</TableCell>
                      <TableCell>{beneficiary.institution?.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{beneficiary.target_group?.name}</Badge>
                      </TableCell>
                      <TableCell>{beneficiary.gender_name_id}</TableCell>
                      <TableCell className="text-right">{beneficiary.age || '-'} tahun</TableCell>
                      <TableCell>
                        {beneficiary.has_dietary_restrictions && (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" />
                            Pantangan
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/beneficiaries/${beneficiary.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/beneficiaries/${beneficiary.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(beneficiary.id)}
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

