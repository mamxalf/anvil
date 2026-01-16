import React, { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import StudentLayout from '@/Layouts/StudentLayout'
import { Plus, ExternalLink, Edit3, Trash2, Globe, EyeOff, X, Sparkles } from 'lucide-react'
import { Portfolio, THEMES, ThemeName } from '@/components/PortfolioBuilder'

interface PortfoliosIndexProps extends PageProps {
    portfolios: Portfolio[]
    themes: string[]
    canCreate: boolean
    maxPortfolios: number
}

export default function Index({ portfolios, canCreate = true, maxPortfolios = 3 }: PortfoliosIndexProps) {
    const { t } = useTranslation()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const openCreateModal = () => {
        if (!canCreate) {
            alert(`You can only create up to ${maxPortfolios} portfolios.`)
            return
        }
        setShowCreateModal(true)
    }

    const handleCreate = () => {
        if (!newTitle.trim()) return
        setIsCreating(true)
        router.post(
            '/student/portfolios',
            { portfolio: { title: newTitle.trim() } },
            {
                onSuccess: () => {
                    setShowCreateModal(false)
                    setNewTitle('')
                },
                onFinish: () => setIsCreating(false),
            }
        )
    }

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Delete "${title}"? This cannot be undone.`)) {
            router.delete(`/student/portfolios/${id}`)
        }
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header - Orange Theme */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-8 md:p-10 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 text-white text-sm font-bold mb-4">
                        <Sparkles className="w-4 h-4" />
                        Portfolio Builder
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                        {t('portfolio.title', { defaultValue: 'My Portfolios' })}
                    </h1>
                    <p className="text-white/90 text-lg max-w-xl mb-6">
                        {t('portfolio.description', {
                            defaultValue:
                                'Build your personal portfolio website with our easy drag-and-drop builder. Show off your skills and projects!',
                        })}
                    </p>
                    <Button
                        onClick={openCreateModal}
                        disabled={!canCreate}
                        className="bg-white text-kodibot-orange hover:bg-white/90 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {t('portfolio.create_new', { defaultValue: 'Create New Portfolio' })}
                        {!canCreate && ` (${portfolios.length}/${maxPortfolios})`}
                    </Button>
                </div>
            </section>

            {/* Portfolios Grid */}
            {portfolios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => {
                        const theme = THEMES[portfolio.theme as ThemeName] || THEMES.modern

                        return (
                            <div
                                key={portfolio.id}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Preview */}
                                <div
                                    className="h-40 relative"
                                    style={{
                                        background:
                                            typeof theme.colors.background === 'string' &&
                                                theme.colors.background.includes('gradient')
                                                ? theme.colors.background
                                                : `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.secondary}20 100%)`,
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl">{theme.preview}</span>
                                    </div>
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        {portfolio.published ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-kodibot-green text-white text-xs font-bold rounded-full">
                                                <Globe className="w-3 h-3" />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full">
                                                <EyeOff className="w-3 h-3" />
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{portfolio.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Theme: {theme.name} • Updated{' '}
                                        {new Date(portfolio.updatedAt).toLocaleDateString()}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            asChild
                                            size="sm"
                                            className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-kodibot-orange hover:from-orange-600 hover:to-kodibot-orange"
                                        >
                                            <Link href={`/student/portfolios/${portfolio.id}`}>
                                                <Edit3 className="w-4 h-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                        {portfolio.publicUrl && (
                                            <Button asChild variant="outline" size="sm" className="rounded-xl">
                                                <a href={portfolio.publicUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl text-red-500 hover:bg-red-50 hover:border-red-200"
                                            onClick={() => handleDelete(portfolio.id, portfolio.title)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Create New Card */}
                    {canCreate && (
                        <button
                            onClick={openCreateModal}
                            className="h-64 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-kodibot-orange hover:text-kodibot-orange hover:bg-orange-50/50 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-colors">
                                <Plus className="w-8 h-8" />
                            </div>
                            <span className="font-bold">Create New Portfolio</span>
                            <span className="text-sm mt-1">({portfolios.length}/{maxPortfolios})</span>
                        </button>
                    )}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">🎨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Portfolios Yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Create your first portfolio and start showcasing your amazing projects and skills to
                        the world!
                    </p>
                    <Button
                        onClick={openCreateModal}
                        className="bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create My First Portfolio
                    </Button>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-kodibot-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Create New Portfolio</h2>
                            <p className="text-gray-500 mt-2">Give your portfolio a catchy name!</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Portfolio Title
                                </label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                    placeholder="My Awesome Portfolio"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-kodibot-orange focus:outline-none focus:ring-2 focus:ring-kodibot-orange/20 transition-all text-lg"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 rounded-xl py-3"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={!newTitle.trim() || isCreating}
                                    className="flex-1 rounded-xl py-3 bg-gradient-to-r from-orange-500 to-kodibot-orange hover:from-orange-600 hover:to-kodibot-orange text-white font-bold shadow-lg shadow-orange-200"
                                >
                                    {isCreating ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

Index.layout = (page: React.ReactNode) => <StudentLayout children={page} />
