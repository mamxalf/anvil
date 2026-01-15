import { Head } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { MazeGame } from '@/components/MazeGame'

const PlaygroundIndex = () => {
  return (
    <StudentLayout>
      <Head title="KodiLab - Rabbit Maze" />

      <div className="h-[calc(100vh-100px)] p-4">
        <MazeGame initialLevel={1} />
      </div>
    </StudentLayout>
  )
}

export default PlaygroundIndex
