import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import Layout from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Plus, Trash2, Edit2, Video, FileText } from 'lucide-react'

// Mock Lucide icons if not available, but assuming they are or project setup handles it.
// If lucide-react not present, I should use text or unicode but 'lucide-react' is common in Shadcn.
// Checking imports: usually project has lucide-react.

interface CurriculumProps {
  course: any
  modules: any[]
}

export default function Curriculum({ course, modules }: CurriculumProps) {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<any>(null)
  const [editingLesson, setEditingLesson] = useState<any>(null)

  // Forms
  const moduleForm = useForm({
    title: '',
    description: ''
  })

  const lessonForm = useForm({
    title: '',
    content: '',
    video_url: '',
    duration_minutes: 10,
    free_preview: false
  })

  // Handlers
  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault()
    moduleForm.post(`/courses/${course.id}/course_modules`, {
      onSuccess: () => {
        moduleForm.reset()
        // Close modal logic if manual control needed
      }
    })
  }

  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Are you sure? All lessons in this module will be deleted.')) {
      moduleForm.delete(`/courses/${course.id}/course_modules/${moduleId}`)
    }
  }

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeModuleId) return
    lessonForm.post(`/courses/${course.id}/course_modules/${activeModuleId}/lessons`, {
      onSuccess: () => {
        lessonForm.reset()
      }
    })
  }

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (confirm('Delete this lesson?')) {
      lessonForm.delete(`/courses/${course.id}/course_modules/${moduleId}/lessons/${lessonId}`)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">Curriculum Builder</h1>
             <p className="text-gray-500">Manage content for "{course.title}"</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/courses/${course.id}`}>View Course</Link>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Add Module
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create New Module</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateModule} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Module Title</Label>
                    <Input 
                      value={moduleForm.data.title}
                      onChange={e => moduleForm.setData('title', e.target.value)}
                      placeholder="e.g., Getting Started"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input 
                      value={moduleForm.data.description}
                      onChange={e => moduleForm.setData('description', e.target.value)}
                      placeholder="Short description of this section"
                    />
                  </div>
                  <DialogFooter>
                     <Button type="submit" disabled={moduleForm.processing}>Create Module</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
           {modules.length === 0 && (
             <div className="text-center py-12 bg-gray-50 border-2 border-dashed rounded-xl">
               <p className="text-gray-500">No modules yet. Add one to get started!</p>
             </div>
           )}

           {modules.map((mod: any, index: number) => (
             <Card key={mod.id} className="border border-gray-200">
               <CardContent className="p-0">
                 <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                   <div className="flex items-center gap-3">
                     <span className="font-bold text-gray-400">Section {index + 1}:</span>
                     <span className="font-bold text-gray-900 text-lg">{mod.title}</span>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteModule(mod.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                   </div>
                 </div>

                 <div className="p-4 space-y-2">
                    {/* Lessons List */}
                    {mod.lessons && mod.lessons.map((lesson: any, lIndex: number) => (
                      <div key={lesson.id} className="flex justify-between items-center p-3 bg-white border rounded-lg hover:shadow-sm">
                         <div className="flex items-center gap-3">
                            <Video className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium">{lIndex + 1}. {lesson.title}</span>
                            {lesson.free_preview && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Preview</span>
                            )}
                         </div>
                         <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(mod.id, lesson.id)}>
                            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                         </Button>
                      </div>
                    ))}

                    {/* Add Lesson Button/Modal */}
                    <div className="mt-4 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-full border border-dashed text-gray-500" onClick={() => setActiveModuleId(mod.id)}>
                            <Plus className="w-3 h-3 mr-2" /> Add Lesson
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Add Lesson to "{mod.title}"</DialogTitle></DialogHeader>
                          <form onSubmit={handleCreateLesson} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Lesson Title</Label>
                              <Input 
                                value={lessonForm.data.title}
                                onChange={e => lessonForm.setData('title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                               <Label>Video URL</Label>
                               <Input 
                                 value={lessonForm.data.video_url}
                                 onChange={e => lessonForm.setData('video_url', e.target.value)}
                                 placeholder="YouTube or Vimeo URL"
                               />
                            </div>
                            <div className="flex items-center gap-2">
                               <input 
                                 type="checkbox" 
                                 id="free_preview"
                                 checked={lessonForm.data.free_preview}
                                 onChange={e => lessonForm.setData('free_preview', e.target.checked)}
                               />
                               <Label htmlFor="free_preview">Free Preview?</Label>
                            </div>
                            <DialogFooter>
                               <Button type="submit" disabled={lessonForm.processing}>Add Lesson</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>
      </div>
    </Layout>
  )
}
