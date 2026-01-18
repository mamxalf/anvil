import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { MazeGame } from '@/components/MazeGame'
import { useTranslation } from '@/hooks/useTranslation'

export default function MazeGamePage() {
    const { t } = useTranslation()

    return (
        <StudentLayout>
            <Head title={t('maze_game.title', { defaultValue: 'Labirin Kelinci' })} />

            <div className="h-[calc(100vh-100px)] p-4">
                <MazeGame initialLevel={1} />
            </div>
        </StudentLayout>
    )
}
