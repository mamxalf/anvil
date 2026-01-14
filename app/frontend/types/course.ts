
// Course interface
export interface Course {
    id: string
    title: string
    description: string
    thumbnail: string | null
    level: string
    subject: string
    instructor: {
        name: string
    }
    enrollment_type?: string
    total_duration_minutes?: number
    total_lessons?: number
}
