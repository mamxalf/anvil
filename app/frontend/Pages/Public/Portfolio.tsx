import React from 'react'
import { Head } from '@inertiajs/react'
import { BlockRenderer } from '@/components/PortfolioBuilder/BlockRenderer'
import { PortfolioBlock, ThemeName, THEMES } from '@/components/PortfolioBuilder/types'

interface PublicPortfolioProps {
    portfolio: {
        title: string
        theme: string
        content: PortfolioBlock[]
    }
    student: {
        name: string
        avatar: string | null
    }
}

export default function PublicPortfolio({ portfolio, student }: PublicPortfolioProps) {
    const theme = THEMES[portfolio.theme as ThemeName] || THEMES.modern
    const blocks = portfolio.content || []

    // Dummy handlers for public view (no editing)
    const handleUpdate = () => { }
    const handleImageUpload = async () => ''

    return (
        <>
            <Head title={`${portfolio.title} - ${student.name}`} />

            <div
                className="min-h-screen"
                style={{
                    background:
                        typeof theme.colors.background === 'string' &&
                            theme.colors.background.includes('gradient')
                            ? theme.colors.background
                            : theme.colors.background,
                    color: theme.colors.text,
                }}
            >
                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-4 py-16">
                    {blocks.map((block) => (
                        <div key={block.id} className="mb-8">
                            <BlockRenderer
                                block={block}
                                theme={portfolio.theme as ThemeName}
                                isEditing={false}
                                onUpdate={handleUpdate}
                                onImageUpload={handleImageUpload}
                            />
                        </div>
                    ))}
                </main>

                {/* Footer */}
                <footer
                    className="text-center py-8 border-t"
                    style={{ borderColor: `${theme.colors.text}20` }}
                >
                    <p className="text-sm opacity-60">
                        Built with ❤️ using{' '}
                        <a
                            href="https://kodilearn.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold hover:underline"
                            style={{ color: theme.colors.primary }}
                        >
                            Kodilearn
                        </a>
                    </p>
                </footer>
            </div>
        </>
    )
}

// No layout for public pages
PublicPortfolio.layout = (page: React.ReactNode) => page
