import React from 'react'
import { useForm, Link } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import ParentLayout from '@/Layouts/ParentLayout'

export default function AddChild() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    birth_date: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/parent/children')
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Add Your Child</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Child's Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="e.g. Budi"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="Leave blank to generate automatically"
              />
              <p className="text-xs text-gray-500">If left blank, we'll create a username for them.</p>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input
                id="birth_date"
                type="date"
                value={data.birth_date}
                onChange={e => setData('birth_date', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? 'Creating Account...' : 'Create Child Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

AddChild.layout = (page: React.ReactNode) => <ParentLayout children={page} />