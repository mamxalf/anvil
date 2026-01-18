import { Head, Link } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { useTranslation } from '@/hooks/useTranslation'
import { Search, Calendar, Cpu, ArrowLeft, Gamepad2 } from 'lucide-react'
import { useState } from 'react'

interface PublishedSketch {
    id: string
    name: string
    board_type: string
    published_at: string
    author_name: string
    author_avatar?: string
}

interface Pagination {
    current_page: number
    total_pages: number
    prev_page: number | null
    next_page: number | null
}

interface Props {
    sketches: PublishedSketch[]
    pagination: Pagination
}

export default function CommunityIndex({ sketches, pagination }: Props) {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')

    // Filter sketches by search query
    const filteredSketches = sketches.filter(sketch =>
        sketch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sketch.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <StudentLayout>
            <Head title={t('community.title', { defaultValue: 'Community Showcase' })} />

            <div className="space-y-8 pb-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <Link
                            href="/student/playground"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('common.back_to_playground', { defaultValue: 'Back to Playground' })}
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            {t('community.hero_title', { defaultValue: 'Community Showcase' })}
                        </h1>
                        <p className="text-lg text-white/90">
                            {t('community.hero_subtitle', { defaultValue: 'Explore amazing projects created by students like you!' })}
                        </p>

                        {/* Search Bar */}
                        <div className="pt-6 relative max-w-md mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none pt-6">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder={t('community.search_placeholder', { defaultValue: 'Search projects or makers...' })}
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border-0 shadow-lg text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSketches.map((sketch) => (
                        <Link
                            key={sketch.id}
                            href={`/student/community/${sketch.id}`}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:-translate-y-1"
                        >
                            {/* Thumbnail Placeholder */}
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-500">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-colors" />
                                    <Cpu className="w-16 h-16 text-gray-400 group-hover:text-orange-500 transition-colors relative z-10" />
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                    ${sketch.board_type === 'uno' ? 'bg-blue-100 text-blue-700' :
                                            sketch.board_type === 'nano' ? 'bg-green-100 text-green-700' :
                                                sketch.board_type === 'mega' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-orange-100 text-orange-700'}`}>
                                        {sketch.board_type}
                                    </span>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(sketch.published_at)}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                    {sketch.name}
                                </h3>

                                <div className="mt-auto pt-4 flex items-center gap-3 border-t border-gray-100">
                                    {sketch.author_avatar ? (
                                        <img src={sketch.author_avatar} alt={sketch.author_name} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {sketch.author_name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-600">{sketch.author_name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSketches.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                            <Gamepad2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-600 mb-2">
                            {searchQuery ? t('community.no_results', { defaultValue: 'No projects found' }) : t('community.no_projects', { defaultValue: 'No projects published yet' })}
                        </h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            {searchQuery
                                ? t('community.no_results_desc', { defaultValue: 'Try adjusting your search terms' })
                                : t('community.no_projects_desc', { defaultValue: 'Be the first one to publish a project!' })}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/student/playground/arduino"
                                className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-200"
                            >
                                {t('community.create_project', { defaultValue: 'Create Project' })}
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {/* Pagination logic here if needed, for simplicity we can use standard inertia Link if implemented fully */}
                    </div>
                )}
            </div>
        </StudentLayout>
    )
}
