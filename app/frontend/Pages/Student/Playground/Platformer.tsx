import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { PlatformerGame } from '@/components/PlatformerGame'
import { useTranslation } from '@/hooks/useTranslation'

export default function PlatformerPage() {
    const { t } = useTranslation()

    return (
        <StudentLayout>
            <Head title={t('platformer.title') || 'Dungeon Platformer'} />

            <div className="h-[calc(100vh-100px)] p-4">
                <PlatformerGame initialLevel={1} />
            </div>
        </StudentLayout>
    )
}
