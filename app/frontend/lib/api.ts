// Maze Attempts API
export async function getActiveAttempt(lessonId: string) {
  const response = await fetch(`/api/maze_attempts/active?lesson_id=${lessonId}`)
  if (!response.ok) throw new Error('Failed to fetch active attempt')
  const data = await response.json()
  return data.active_attempt
}

export async function createAttempt(lessonId: string) {
  const response = await fetch('/api/maze_attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maze_attempt: { lesson_id: lessonId } })
  })
  if (!response.ok) throw new Error('Failed to create attempt')
  return response.json()
}

export async function syncAttempt(attemptId: string, data: Partial<MazeAttempt>) {
  const response = await fetch(`/api/maze_attempts/${attemptId}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maze_attempt: data })
  })
  if (!response.ok) throw new Error('Failed to sync attempt')
  return response.json()
}

export async function completeAttempt(attemptId: string, data: { blocks_used: number; time_elapsed_seconds: number }) {
  const response = await fetch(`/api/maze_attempts/${attemptId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maze_attempt: data })
  })
  if (!response.ok) throw new Error('Failed to complete attempt')
  return response.json()
}

// Lesson Hints API
export async function getLessonHints(lessonId: string) {
  const response = await fetch(`/api/lessons/${lessonId}/hints`)
  if (!response.ok) throw new Error('Failed to fetch lesson hints')
  return response.json()
}

// Alias for consistency with useSmartHints hook
export const fetchHints = getLessonHints

