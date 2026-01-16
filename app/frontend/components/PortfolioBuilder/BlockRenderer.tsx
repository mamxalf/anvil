import React, { useState, useRef } from 'react'
import { PortfolioBlock, ThemeName, THEMES } from './types'
import { Upload, Play, Mail, Github, Linkedin } from 'lucide-react'


interface BlockRendererProps {
    block: PortfolioBlock
    theme: ThemeName
    isEditing: boolean
    onUpdate: (id: string, content: Record<string, unknown>) => void
    onImageUpload: (file: File) => Promise<string>
}

export function BlockRenderer({
    block,
    theme,
    isEditing,
    onUpdate,
    onImageUpload,
}: BlockRendererProps) {
    const themeColors = THEMES[theme].colors

    const updateContent = (updates: Record<string, unknown>) => {
        onUpdate(block.id, { ...block.content, ...updates })
    }

    switch (block.type) {
        case 'header':
            return (
                <HeaderBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                />
            )
        case 'text':
            return (
                <TextBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                />
            )
        case 'image':
            return (
                <ImageBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                    onImageUpload={onImageUpload}
                />
            )
        case 'video':
            return (
                <VideoBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                />
            )
        case 'skills':
            return (
                <SkillsBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                />
            )
        case 'projects':
            return (
                <ProjectsBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                />
            )
        case 'contact':
            return (
                <ContactBlock
                    content={block.content}
                    theme={themeColors}
                    isEditing={isEditing}
                    onUpdate={updateContent}
                />
            )
        case 'spacer':
            return <SpacerBlock content={block.content} isEditing={isEditing} onUpdate={updateContent} />
        default:
            return <div className="p-4 text-gray-500">Unknown block type</div>
    }
}

// Settings helpers
interface BlockSettings {
    textAlign?: 'left' | 'center' | 'right'
    fontSize?: 'small' | 'medium' | 'large' | 'xlarge'
    textColor?: string
    bgColor?: string
    padding?: number
    borderRadius?: number
}

const FONT_SIZE_MAP = {
    small: { heading: 'text-2xl md:text-3xl', text: 'text-sm', subtext: 'text-base' },
    medium: { heading: 'text-4xl md:text-5xl', text: 'text-base', subtext: 'text-lg' },
    large: { heading: 'text-5xl md:text-6xl', text: 'text-lg', subtext: 'text-xl' },
    xlarge: { heading: 'text-6xl md:text-7xl', text: 'text-xl', subtext: 'text-2xl' },
}

const TEXT_COLOR_MAP: Record<string, string> = {
    default: '#1f2937',
    primary: '#f97316',
    secondary: '#8b5cf6',
    muted: '#6b7280',
    white: '#ffffff',
}

const BG_COLOR_MAP: Record<string, string> = {
    none: 'transparent',
    gray: '#f3f4f6',
    orange: '#fff7ed',
    blue: '#eff6ff',
    green: '#f0fdf4',
    purple: '#faf5ff',
}

function getBlockSettings(content: Record<string, unknown>): BlockSettings {
    return (content.settings as BlockSettings) || {}
}

function getWrapperStyle(settings: BlockSettings) {
    return {
        backgroundColor: settings.bgColor ? BG_COLOR_MAP[settings.bgColor] || 'transparent' : 'transparent',
        padding: settings.padding !== undefined ? `${settings.padding}px` : undefined,
        borderRadius: settings.borderRadius !== undefined ? `${settings.borderRadius}px` : undefined,
        textAlign: settings.textAlign || 'center',
    } as React.CSSProperties
}

// Header Block
function HeaderBlock({
    content,
    theme,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const name = (content.name as string) || 'Your Name'
    const title = (content.title as string) || 'Your Title'
    const bio = (content.bio as string) || 'Your bio...'
    const settings = getBlockSettings(content)
    const fontSizes = FONT_SIZE_MAP[settings.fontSize || 'medium']
    const textColor = settings.textColor ? TEXT_COLOR_MAP[settings.textColor] : undefined

    return (
        <div
            className="py-8 space-y-4"
            style={getWrapperStyle(settings)}
        >
            <h1
                className={`${fontSizes.heading} font-black`}
                style={{ color: textColor || theme.primary }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ name: e.currentTarget.textContent })}
            >
                {name}
            </h1>
            <p
                className={`${fontSizes.subtext} font-bold`}
                style={{ color: textColor || theme.secondary }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ title: e.currentTarget.textContent })}
            >
                {title}
            </p>
            <p
                className={`${fontSizes.text} max-w-2xl mx-auto`}
                style={{ color: textColor || theme.text, opacity: textColor ? 1 : 0.8 }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => onUpdate({ bio: e.currentTarget.textContent })}
            >
                {bio}
            </p>
        </div>
    )
}

// Text Block
function TextBlock({
    content,
    theme,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const text = (content.content as string) || 'Write your content here...'
    const settings = getBlockSettings(content)
    const fontSizes = FONT_SIZE_MAP[settings.fontSize || 'medium']
    const textColor = settings.textColor ? TEXT_COLOR_MAP[settings.textColor] : undefined

    return (
        <div
            className={`prose max-w-none py-4 ${fontSizes.text}`}
            style={{
                ...getWrapperStyle(settings),
                color: textColor || theme.text,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.innerHTML })}
            dangerouslySetInnerHTML={{ __html: text }}
        />
    )
}

// Image Block
function ImageBlock({
    content,
    theme,
    isEditing,
    onUpdate,
    onImageUpload,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
    onImageUpload: (file: File) => Promise<string>
}) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const url = content.url as string
    const caption = (content.caption as string) || ''

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const uploadedUrl = await onImageUpload(file)
            onUpdate({ url: uploadedUrl })
        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setUploading(false)
        }
    }

    if (!url && isEditing) {
        return (
            <div
                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-kodibot-orange hover:bg-orange-50/50 transition-all"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="font-bold text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                </p>
                <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 10MB</p>
            </div>
        )
    }

    return (
        <figure className="py-4">
            <img
                src={url || 'https://placehold.co/800x400/f97316/white?text=Your+Image'}
                alt={content.alt as string}
                className="w-full rounded-2xl shadow-lg"
            />
            {(caption || isEditing) && (
                <figcaption
                    className="text-center mt-4 text-sm"
                    style={{ color: theme.text, opacity: 0.7 }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate({ caption: e.currentTarget.textContent })}
                >
                    {caption || 'Add a caption...'}
                </figcaption>
            )}
        </figure>
    )
}

// Video Block
function VideoBlock({
    content,
    theme,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const [inputUrl, setInputUrl] = useState('')
    const youtubeUrl = content.youtubeUrl as string
    const caption = (content.caption as string) || ''

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const match = url.match(
            /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
        )
        return match ? match[1] : null
    }

    const videoId = getYouTubeId(youtubeUrl || '')

    if (!youtubeUrl && isEditing) {
        return (
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <Play className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="font-bold text-gray-600 mb-4">Embed YouTube Video</p>
                <div className="flex gap-2 max-w-md mx-auto">
                    <input
                        type="url"
                        placeholder="Paste YouTube URL here..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-kodibot-orange focus:outline-none"
                    />
                    <button
                        onClick={() => {
                            if (getYouTubeId(inputUrl)) {
                                onUpdate({ youtubeUrl: inputUrl })
                                setInputUrl('')
                            }
                        }}
                        className="px-4 py-2 bg-kodibot-orange text-white rounded-xl font-bold hover:bg-kodibot-orange/90"
                    >
                        Add
                    </button>
                </div>
            </div>
        )
    }

    return (
        <figure className="py-4">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
                {videoId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <Play className="w-16 h-16" />
                    </div>
                )}
            </div>
            {(caption || isEditing) && (
                <figcaption
                    className="text-center mt-4 text-sm"
                    style={{ color: theme.text, opacity: 0.7 }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate({ caption: e.currentTarget.textContent })}
                >
                    {caption || 'Add a caption...'}
                </figcaption>
            )}
        </figure>
    )
}

// Skills Block
function SkillsBlock({
    content,
    theme,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const [newSkill, setNewSkill] = useState('')
    const skills = (content.skills as string[]) || []

    const addSkill = () => {
        if (newSkill.trim()) {
            onUpdate({ skills: [...skills, newSkill.trim()] })
            setNewSkill('')
        }
    }

    const removeSkill = (index: number) => {
        onUpdate({ skills: skills.filter((_, i) => i !== index) })
    }

    return (
        <div className="py-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>
                ⚡ Skills
            </h3>
            <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                        style={{ backgroundColor: theme.primary, color: '#fff' }}
                    >
                        {skill}
                        {isEditing && (
                            <button
                                onClick={() => removeSkill(index)}
                                className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-xs"
                            >
                                ×
                            </button>
                        )}
                    </span>
                ))}
                {isEditing && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            placeholder="Add skill..."
                            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-full text-sm focus:border-kodibot-orange focus:outline-none"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

// Projects Block
function ProjectsBlock({
    content,
    theme,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const projects = (content.projects as Array<{ name: string; description: string; image?: string; url?: string }>) || []

    const addProject = () => {
        onUpdate({
            projects: [...projects, { name: 'New Project', description: 'Project description' }],
        })
    }

    const updateProject = (index: number, updates: Partial<(typeof projects)[0]>) => {
        const newProjects = [...projects]
        newProjects[index] = { ...newProjects[index], ...updates }
        onUpdate({ projects: newProjects })
    }

    const removeProject = (index: number) => {
        onUpdate({ projects: projects.filter((_, i) => i !== index) })
    }

    return (
        <div className="py-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>
                🚀 Projects
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                        style={{ backgroundColor: theme.background }}
                    >
                        <div
                            className="h-32 bg-gradient-to-br"
                            style={{
                                background: `linear-gradient(135deg, ${theme.primary}40 0%, ${theme.secondary}40 100%)`,
                            }}
                        />
                        <div className="p-4">
                            <h4
                                className="text-lg font-bold"
                                style={{ color: theme.text }}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) => updateProject(index, { name: e.currentTarget.textContent || '' })}
                            >
                                {project.name}
                            </h4>
                            <p
                                className="text-sm mt-2"
                                style={{ color: theme.text, opacity: 0.7 }}
                                contentEditable={isEditing}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                    updateProject(index, { description: e.currentTarget.textContent || '' })
                                }
                            >
                                {project.description}
                            </p>
                            {isEditing && (
                                <button
                                    onClick={() => removeProject(index)}
                                    className="mt-3 text-sm text-red-500 font-bold"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isEditing && (
                    <button
                        onClick={addProject}
                        className="h-48 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-kodibot-orange hover:text-kodibot-orange transition-all"
                    >
                        <span className="text-4xl mr-2">+</span> Add Project
                    </button>
                )}
            </div>
        </div>
    )
}

// Contact Block
function ContactBlock({
    content,
    theme,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    theme: (typeof THEMES)[ThemeName]['colors']
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const email = (content.email as string) || ''
    const github = (content.github as string) || ''
    const linkedin = (content.linkedin as string) || ''

    return (
        <div className="py-6 text-center">
            <h3 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>
                📧 Contact Me
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
                {(email || isEditing) && (
                    <a
                        href={email ? `mailto:${email}` : '#'}
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
                        style={{ backgroundColor: theme.primary, color: '#fff' }}
                    >
                        <Mail className="w-5 h-5" />
                        {isEditing ? (
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => onUpdate({ email: e.target.value })}
                                placeholder="your@email.com"
                                className="bg-transparent border-none outline-none placeholder-white/50 w-40"
                                onClick={(e) => e.preventDefault()}
                            />
                        ) : (
                            email || 'Email'
                        )}
                    </a>
                )}
                {(github || isEditing) && (
                    <a
                        href={github ? `https://github.com/${github}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 bg-gray-800 text-white"
                    >
                        <Github className="w-5 h-5" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={github}
                                onChange={(e) => onUpdate({ github: e.target.value })}
                                placeholder="username"
                                className="bg-transparent border-none outline-none placeholder-white/50 w-24"
                                onClick={(e) => e.preventDefault()}
                            />
                        ) : (
                            github || 'GitHub'
                        )}
                    </a>
                )}
                {(linkedin || isEditing) && (
                    <a
                        href={linkedin ? `https://linkedin.com/in/${linkedin}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 bg-blue-600 text-white"
                    >
                        <Linkedin className="w-5 h-5" />
                        {isEditing ? (
                            <input
                                type="text"
                                value={linkedin}
                                onChange={(e) => onUpdate({ linkedin: e.target.value })}
                                placeholder="username"
                                className="bg-transparent border-none outline-none placeholder-white/50 w-24"
                                onClick={(e) => e.preventDefault()}
                            />
                        ) : (
                            linkedin || 'LinkedIn'
                        )}
                    </a>
                )}
            </div>
        </div>
    )
}

// Spacer Block
function SpacerBlock({
    content,
    isEditing,
    onUpdate,
}: {
    content: Record<string, unknown>
    isEditing: boolean
    onUpdate: (updates: Record<string, unknown>) => void
}) {
    const height = (content.height as number) || 40

    return (
        <div
            className={`relative ${isEditing ? 'bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl' : ''}`}
            style={{ height }}
        >
            {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <input
                        type="range"
                        min="20"
                        max="200"
                        value={height}
                        onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
                        className="w-32"
                    />
                    <span className="ml-2 text-sm text-gray-500">{height}px</span>
                </div>
            )}
        </div>
    )
}
