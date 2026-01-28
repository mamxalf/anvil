import React from 'react'
import { PlayCircle, BookOpen } from 'lucide-react'

interface LessonContentProps {
  lesson: any
  onReadComplete?: () => void
}

export function LessonContent({ lesson, onReadComplete }: LessonContentProps) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100

    if (scrollPercentage > 90 && onReadComplete) {
      onReadComplete()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video if present */}
      {lesson.video_url && lesson.youtube_embed_url && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={lesson.youtube_embed_url}
            className="w-full aspect-video"
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}

      {/* Rich text content */}
      <div
        className="prose prose-lg max-w-none"
        onScroll={handleScroll}
        style={{ maxHeight: '70vh', overflowY: 'auto' }}
        dangerouslySetInnerHTML={{ __html: lesson.content?.body?.toFullString() || '' }}
      />

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Materi Tambahan
          </h3>
          <ul className="space-y-2">
            {lesson.resources.map((resource: any) => (
              <li key={resource.id}>
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  📎 {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
