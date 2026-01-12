import React, { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CourseFormProps {
  course: any
  isEditing: boolean
  errors: any
}

export default function CourseForm({ course, isEditing }: CourseFormProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: course.title || '',
    description: course.description || '',
    level: course.level || 'beginner',
    subject: course.subject || 'coding',
    status: course.status || 'draft',
    thumbnail: null as File | null,
    _method: isEditing ? 'put' : undefined,
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    course.thumbnail_url || null
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditing) {
      post(`/courses/${course.id}`, {
        forceFormData: true,
      })
    } else {
      post('/courses')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('thumbnail', file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl font-bold text-gray-900">
             {isEditing ? 'Edit Course' : 'Create New Course'}
           </h1>
           <Button variant="ghost" onClick={() => window.history.back()}>
             Cancel
           </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input 
                  id="title" 
                  value={data.title} 
                  onChange={e => setData('title', e.target.value)}
                  placeholder="e.g., Introduction to Python Game Development"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder="What will students learn in this course?"
                  className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Level */}
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select 
                    value={data.level} 
                    onValueChange={(val) => setData('level', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={data.subject} 
                    onValueChange={(val) => setData('subject', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="robotics">Robotics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={data.status} 
                  onValueChange={(val) => setData('status', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                    <SelectItem value="published">Published (Visible)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Course Thumbnail</Label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Thumbnail preview" 
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  )}
                  <Input 
                    type="file" 
                    id="thumbnail" 
                    onChange={handleFileChange}
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full md:w-auto" disabled={processing}>
                  {processing ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
