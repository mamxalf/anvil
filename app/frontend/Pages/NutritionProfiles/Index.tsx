import React, { useState } from 'react'
import { router } from '@inertiajs/react'
import { PageProps, TargetGroup, NutritionRequirements } from '@/types'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface NutritionProfilesPageProps extends PageProps {
  target_groups: TargetGroup[]
}

export default function Index({ target_groups, translations }: NutritionProfilesPageProps) {
  const t = translations?.target_groups || {}
  const nutrition = translations?.nutrition || {}
  const common = translations?.common || {}

  const [extraTokensByGroup, setExtraTokensByGroup] = useState<Record<string, string[]>>({})

  const handleSaveProfiles = (targetGroupId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const profiles: Record<string, NutritionRequirements> = {}

    // rows are identified by a token; each row has a profile_key_<token> field
    const tokens = new Set<string>()
    formData.forEach((_, key) => {
      if (key.startsWith('profile_key_')) {
        tokens.add(key.replace('profile_key_', ''))
      }
    })

    tokens.forEach((token) => {
      const key = String(formData.get(`profile_key_${token}`) || '').trim()
      if (!key) return

      const buildProfile = (tkn: string): NutritionRequirements => ({
        energy: Number(formData.get(`${tkn}[energy]`) || 0),
        protein: Number(formData.get(`${tkn}[protein]`) || 0),
        fat: Number(formData.get(`${tkn}[fat]`) || 0),
        carbohydrate: Number(formData.get(`${tkn}[carbohydrate]`) || 0),
        fiber: Number(formData.get(`${tkn}[fiber]`) || 0),
      })

      profiles[key] = buildProfile(token)
    })

    router.patch(`/target_groups/${targetGroupId}/nutrition_profiles`, {
      profiles: profiles as any,
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-100">
            <Settings className="h-6 w-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.manage_profiles || 'Kelola Profil Gizi'}
            </h1>
            <p className="text-gray-600">
              {t.manage_profiles_subtitle || 'Sesuaikan kebutuhan gizi tiap kelompok sasaran'}
            </p>
          </div>
        </div>

        {/* Target group cards */}
        <div className="space-y-6">
          {target_groups.map((group) => {
            const profiles = group.nutrition_profiles || {}
            const profileEntries = Object.entries(profiles)
            const extraTokens = extraTokensByGroup[group.id] || []

            return (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm">{group.code}</span>
                    <span className="text-xl text-gray-900">{group.name}</span>
                  </CardTitle>
                  {group.description && (
                    <p className="text-sm text-gray-500">{group.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleSaveProfiles(group.id, e)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileEntries.map(([key, profile]) => {
                        const token = `existing_${key}`
                        return (
                          <ProfileCard
                            key={token}
                            token={token}
                            label={key}
                            nutrition={nutrition}
                            group={group}
                            profile={profile as NutritionRequirements}
                          />
                        )
                      })}
                      {extraTokens.map((token) => (
                        <ProfileCard
                          key={token}
                          token={token}
                          label=""
                          nutrition={nutrition}
                          group={group}
                          profile={{} as NutritionRequirements}
                          isNew
                        />
                      ))}
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setExtraTokensByGroup((prev) => {
                            const current = prev[group.id] || []
                            const newToken = `new_${group.id}_${Date.now()}_${current.length}`
                            return {
                              ...prev,
                              [group.id]: [...current, newToken],
                            }
                          })
                        }}
                      >
                        + Tambah Profil
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {common.save || 'Simpan'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

interface ProfileInputProps {
  label: string
  name: string
  defaultValue?: number
}

function ProfileInput({ label, name, defaultValue }: ProfileInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs text-gray-500">{label}</label>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        step="0.1"
        className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
      />
    </div>
  )
}

interface ProfileCardProps {
  token: string
  label: string
  nutrition: Record<string, string | Record<string, string>>
  group: TargetGroup
  profile: NutritionRequirements
  isNew?: boolean
}

function ProfileCard({ token, label, nutrition, group, profile, isNew }: ProfileCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">
            Nama Profil
          </label>
          <input
            type="text"
            name={`profile_key_${token}`}
            defaultValue={label}
            placeholder={isNew ? 'contoh: tinggi_energi_sd' : 'profil_standar'}
            className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Gunakan huruf kecil, angka, dan underscore (tanpa spasi) untuk memudahkan pemetaan.
          </p>
        </div>
        {!isNew && label && (
          <Button
            type="button"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              if (!confirm(`Hapus profil "${label}" untuk ${group.name}?`)) return
              router.delete(`/target_groups/${group.id}/nutrition_profile`, {
                data: { profile_key: label },
                preserveScroll: true,
              })
            }}
          >
            Hapus
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ProfileInput
          label={`${nutrition.energy || 'Energi'} (kkal)`}
          name={`${token}[energy]`}
          defaultValue={profile.energy ?? group.min_energy}
        />
        <ProfileInput
          label={`${nutrition.protein || 'Protein'} (g)`}
          name={`${token}[protein]`}
          defaultValue={profile.protein ?? group.min_protein}
        />
        <ProfileInput
          label={`${nutrition.fat || 'Lemak'} (g)`}
          name={`${token}[fat]`}
          defaultValue={profile.fat ?? group.min_fat}
        />
        <ProfileInput
          label={`${nutrition.carbohydrate || 'Karbo'} (g)`}
          name={`${token}[carbohydrate]`}
          defaultValue={profile.carbohydrate ?? group.min_carbohydrate}
        />
        <ProfileInput
          label={`${nutrition.fiber || 'Serat'} (g)`}
          name={`${token}[fiber]`}
          defaultValue={profile.fiber ?? group.min_fiber}
        />
      </div>
    </div>
  )
}


