// Portfolio Builder Types
export interface PortfolioBlock {
    id: string
    type: 'header' | 'text' | 'image' | 'video' | 'skills' | 'projects' | 'contact' | 'spacer'
    content: Record<string, unknown>
}

export interface Portfolio {
    id: string
    title: string
    slug: string
    theme: string
    content: PortfolioBlock[]
    published: boolean
    publicUrl: string | null
    createdAt: string
    updatedAt: string
}

export const BLOCK_TYPES = [
    { type: 'header', label: 'Header', icon: '👋', description: 'Name & bio section' },
    { type: 'text', label: 'Text', icon: '📝', description: 'Rich text content' },
    { type: 'image', label: 'Image', icon: '🖼️', description: 'Upload your photo' },
    { type: 'video', label: 'YouTube Video', icon: '🎬', description: 'Embed YouTube video' },
    { type: 'skills', label: 'Skills', icon: '⚡', description: 'Show your skills' },
    { type: 'projects', label: 'Projects', icon: '🚀', description: 'Showcase your projects' },
    { type: 'contact', label: 'Contact', icon: '📧', description: 'Contact information' },
    { type: 'spacer', label: 'Spacer', icon: '↕️', description: 'Add vertical space' },
] as const

export const THEMES = {
    modern: {
        name: 'Modern',
        preview: '🎨',
        colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            background: '#FFFFFF',
            text: '#1F2937',
            accent: '#F59E0B',
        },
    },
    creative: {
        name: 'Creative',
        preview: '🎭',
        colors: {
            primary: '#EC4899',
            secondary: '#F97316',
            background: '#FEF3C7',
            text: '#1F2937',
            accent: '#10B981',
        },
    },
    minimal: {
        name: 'Minimal',
        preview: '⬜',
        colors: {
            primary: '#1F2937',
            secondary: '#6B7280',
            background: '#F9FAFB',
            text: '#111827',
            accent: '#3B82F6',
        },
    },
    dark: {
        name: 'Dark',
        preview: '🌙',
        colors: {
            primary: '#60A5FA',
            secondary: '#A78BFA',
            background: '#111827',
            text: '#F9FAFB',
            accent: '#F59E0B',
        },
    },
    colorful: {
        name: 'Colorful',
        preview: '🌈',
        colors: {
            primary: '#8B5CF6',
            secondary: '#06B6D4',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            text: '#FFFFFF',
            accent: '#F59E0B',
        },
    },
} as const

export type ThemeName = keyof typeof THEMES

export const DEFAULT_BLOCKS: Record<PortfolioBlock['type'], PortfolioBlock['content']> = {
    header: {
        name: 'Student Name',
        title: 'Creative Developer',
        bio: 'I love coding and building cool stuff!',
    },
    text: {
        content: 'Write your story here...',
    },
    image: {
        url: '',
        alt: 'Image description',
        caption: '',
    },
    video: {
        youtubeUrl: '',
        caption: '',
    },
    skills: {
        skills: ['HTML', 'CSS', 'JavaScript'],
    },
    projects: {
        projects: [
            { name: 'My First Website', description: 'A cool website I built', image: '' },
        ],
    },
    contact: {
        email: '',
        github: '',
        linkedin: '',
    },
    spacer: {
        height: 40,
    },
}
