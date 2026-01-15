import { useState, useEffect, useCallback } from 'react'
import { router } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import {
    CheckCircle,
    XCircle,
    Clock,
    Trophy,
    Zap,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Play,
    RotateCcw,
} from 'lucide-react'

interface Answer {
    id: string
    content: string
}

interface Question {
    id: string
    content: string
    question_type: 'multiple_choice' | 'true_false' | 'fill_in'
    points: number
    hint?: string
    answered: boolean
    selected_answer_id?: string
    answers: Answer[]
}

interface QuizData {
    id: string
    title: string
    description?: string
    passing_score: number
    time_limit_minutes?: number
    xp_reward: number
    total_questions: number
    can_attempt: boolean
    remaining_attempts?: number
    passed: boolean
    best_score?: number
    current_attempt_id?: string
}

interface QuizAttempt {
    id: string
    quiz_id: string
    started_at: string
    completed_at?: string
    score: number
    passed: boolean
    xp_earned: number
    remaining_time_seconds?: number
    quiz: {
        id: string
        title: string
        description?: string
        passing_score: number
        time_limit_minutes?: number
        xp_reward: number
        questions: Question[]
    }
}

interface QuizPlayerProps {
    quiz: QuizData
    lessonId: string
    courseId: string
}

type QuizState = 'intro' | 'playing' | 'results'

export default function QuizPlayer({ quiz, lessonId, courseId }: QuizPlayerProps) {
    const { t } = useTranslation()
    const [state, setState] = useState<QuizState>(quiz.current_attempt_id ? 'playing' : 'intro')
    const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
    const [textResponse, setTextResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [remainingTime, setRemainingTime] = useState<number | null>(null)
    const [results, setResults] = useState<{
        score: number
        passed: boolean
        xp_earned: number
        passing_score: number
    } | null>(null)

    // Timer effect
    useEffect(() => {
        if (remainingTime === null || remainingTime <= 0) return

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev === null || prev <= 1) {
                    handleComplete()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [remainingTime])

    // Load existing attempt if there's one in progress
    useEffect(() => {
        if (quiz.current_attempt_id) {
            loadAttempt(quiz.current_attempt_id)
        }
    }, [quiz.current_attempt_id])

    const loadAttempt = async (attemptId: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/student/quiz_attempts/${attemptId}`, {
                headers: { Accept: 'application/json' },
            })
            const data = await response.json()
            setAttempt(data)
            setRemainingTime(data.remaining_time_seconds)
            setState('playing')

            // Find first unanswered question
            const firstUnanswered = data.quiz.questions.findIndex((q: Question) => !q.answered)
            if (firstUnanswered !== -1) {
                setCurrentQuestionIndex(firstUnanswered)
            }
        } catch (error) {
            console.error('Failed to load attempt:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const startQuiz = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/student/quizzes/${quiz.id}/quiz_attempts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-Token':
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            })

            if (!response.ok) {
                const error = await response.json()
                alert(error.error)
                return
            }

            const data = await response.json()
            setAttempt(data)
            setRemainingTime(data.remaining_time_seconds)
            setState('playing')
            setCurrentQuestionIndex(0)
        } catch (error) {
            console.error('Failed to start quiz:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const submitAnswer = async () => {
        if (!attempt) return

        const question = attempt.quiz.questions[currentQuestionIndex]
        if (question.answered) {
            goToNextQuestion()
            return
        }

        setIsLoading(true)
        try {
            const body: Record<string, string> = { question_id: question.id }
            if (question.question_type === 'fill_in') {
                body.text_response = textResponse
            } else {
                body.answer_id = selectedAnswerId || ''
            }

            const response = await fetch(`/student/quiz_attempts/${attempt.id}/submit_answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-Token':
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(body),
            })

            if (response.ok) {
                // Update local state
                const updatedQuestions = [...attempt.quiz.questions]
                updatedQuestions[currentQuestionIndex] = {
                    ...question,
                    answered: true,
                    selected_answer_id: selectedAnswerId || undefined,
                }
                setAttempt({
                    ...attempt,
                    quiz: { ...attempt.quiz, questions: updatedQuestions },
                })

                goToNextQuestion()
            }
        } catch (error) {
            console.error('Failed to submit answer:', error)
        } finally {
            setIsLoading(false)
            setSelectedAnswerId(null)
            setTextResponse('')
        }
    }

    const goToNextQuestion = () => {
        if (!attempt) return
        if (currentQuestionIndex < attempt.quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const handleComplete = useCallback(async () => {
        if (!attempt) return

        setIsLoading(true)
        try {
            const response = await fetch(`/student/quiz_attempts/${attempt.id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-Token':
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setResults(data)
                setState('results')

                if (data.passed) {
                    confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#E18914', '#1D8536', '#F9DB2B'],
                    })
                }
            }
        } catch (error) {
            console.error('Failed to complete quiz:', error)
        } finally {
            setIsLoading(false)
        }
    }, [attempt])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const allQuestionsAnswered = attempt?.quiz.questions.every((q) => q.answered)

    // Intro Screen
    if (state === 'intro') {
        return (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="text-center max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Play className="w-10 h-10 text-kodibot-orange" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{quiz.title}</h2>
                    {quiz.description && <p className="text-gray-500 mb-6">{quiz.description}</p>}

                    <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500">
                                {t('quiz.question', { defaultValue: 'Questions' })}
                            </div>
                            <div className="text-xl font-bold text-gray-900">{quiz.total_questions}</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500">
                                {t('quiz.passing_score', { defaultValue: 'Passing Score' })}
                            </div>
                            <div className="text-xl font-bold text-gray-900">{quiz.passing_score}%</div>
                        </div>
                        {quiz.time_limit_minutes && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="text-sm text-gray-500">
                                    {t('quiz.time_remaining', { defaultValue: 'Time Limit' })}
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {quiz.time_limit_minutes} min
                                </div>
                            </div>
                        )}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-sm text-gray-500">
                                {t('gamification.xp', { defaultValue: 'XP Reward' })}
                            </div>
                            <div className="text-xl font-bold text-emerald-600">{quiz.xp_reward} XP</div>
                        </div>
                    </div>

                    {quiz.best_score !== undefined && (
                        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center justify-center gap-2 text-emerald-700">
                                <Trophy className="w-5 h-5" />
                                <span className="font-bold">
                                    {t('quiz.best_score', { defaultValue: 'Best Score' })}: {quiz.best_score}%
                                </span>
                            </div>
                        </div>
                    )}

                    {quiz.passed && (
                        <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center justify-center gap-2 text-emerald-700">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-bold">
                                    {t('quiz.quiz_passed', { defaultValue: 'Quiz Passed!' })}
                                </span>
                            </div>
                        </div>
                    )}

                    {quiz.remaining_attempts !== null && (
                        <div className="mb-6 text-sm text-gray-500">
                            {t('quiz.attempts_remaining', { defaultValue: 'Attempts Remaining' })}:{' '}
                            <span className="font-bold">
                                {quiz.remaining_attempts ?? t('quiz.unlimited', { defaultValue: 'Unlimited' })}
                            </span>
                        </div>
                    )}

                    {quiz.can_attempt ? (
                        <Button
                            onClick={startQuiz}
                            disabled={isLoading}
                            size="lg"
                            className="w-full h-14 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200"
                        >
                            {isLoading
                                ? t('common.loading', { defaultValue: 'Loading...' })
                                : quiz.passed
                                    ? t('quiz.retake_quiz', { defaultValue: 'Retake Quiz' })
                                    : t('quiz.start_quiz', { defaultValue: 'Start Quiz' })}
                        </Button>
                    ) : (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                            <AlertCircle className="w-5 h-5 inline-block mr-2" />
                            {t('quiz.no_attempts_remaining', { defaultValue: 'No attempts remaining' })}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Results Screen
    if (state === 'results' && results) {
        return (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
                <div className="text-center max-w-lg mx-auto">
                    <div
                        className={cn(
                            'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6',
                            results.passed
                                ? 'bg-gradient-to-br from-emerald-100 to-green-100'
                                : 'bg-gradient-to-br from-red-100 to-orange-100'
                        )}
                    >
                        {results.passed ? (
                            <Trophy className="w-12 h-12 text-emerald-600" />
                        ) : (
                            <XCircle className="w-12 h-12 text-red-500" />
                        )}
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        {results.passed
                            ? t('quiz.passed', { defaultValue: 'You Passed!' })
                            : t('quiz.failed', { defaultValue: 'Quiz Not Passed' })}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 my-8">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="text-sm text-gray-500">
                                {t('quiz.your_score', { defaultValue: 'Your Score' })}
                            </div>
                            <div
                                className={cn(
                                    'text-4xl font-black',
                                    results.passed ? 'text-emerald-600' : 'text-red-500'
                                )}
                            >
                                {results.score}%
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="text-sm text-gray-500">
                                {t('quiz.passing_score', { defaultValue: 'Passing Score' })}
                            </div>
                            <div className="text-4xl font-black text-gray-400">{results.passing_score}%</div>
                        </div>
                    </div>

                    {results.xp_earned > 0 && (
                        <div className="mb-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex items-center justify-center gap-2 text-emerald-700">
                                <Zap className="w-5 h-5" />
                                <span className="font-bold text-lg">
                                    +{results.xp_earned} {t('quiz.xp_earned', { defaultValue: 'XP Earned' })}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        {!results.passed && quiz.can_attempt && (
                            <Button
                                onClick={() => {
                                    setState('intro')
                                    setAttempt(null)
                                    setResults(null)
                                }}
                                variant="outline"
                                size="lg"
                                className="flex-1 h-14 rounded-2xl font-bold border-2"
                            >
                                <RotateCcw className="w-5 h-5 mr-2" />
                                {t('quiz.try_again', { defaultValue: 'Try Again' })}
                            </Button>
                        )}
                        <Button
                            onClick={() =>
                                router.visit(`/student/courses/${courseId}/learn?lesson_id=${lessonId}`)
                            }
                            size="lg"
                            className={cn(
                                'flex-1 h-14 rounded-2xl font-bold shadow-lg',
                                results.passed
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-emerald-200'
                                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 shadow-orange-200'
                            )}
                        >
                            {t('common.continue', { defaultValue: 'Continue' })}
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Playing Screen
    if (state === 'playing' && attempt) {
        const question = attempt.quiz.questions[currentQuestionIndex]
        const progress = ((currentQuestionIndex + 1) / attempt.quiz.questions.length) * 100
        const isLastQuestion = currentQuestionIndex === attempt.quiz.questions.length - 1

        return (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-4 md:p-6">
                    <div className="flex items-center justify-between text-white mb-4">
                        <div className="font-bold">
                            {t('quiz.question', { defaultValue: 'Question' })} {currentQuestionIndex + 1}{' '}
                            {t('quiz.of', { defaultValue: 'of' })} {attempt.quiz.questions.length}
                        </div>
                        {remainingTime !== null && (
                            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
                            </div>
                        )}
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{question.content}</h3>

                    {/* Answers */}
                    {question.question_type === 'fill_in' ? (
                        <input
                            type="text"
                            value={textResponse}
                            onChange={(e) => setTextResponse(e.target.value)}
                            disabled={question.answered}
                            placeholder="Type your answer..."
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-kodibot-orange focus:ring-0 text-lg"
                        />
                    ) : (
                        <div className="space-y-3">
                            {question.answers.map((answer) => (
                                <button
                                    key={answer.id}
                                    onClick={() => !question.answered && setSelectedAnswerId(answer.id)}
                                    disabled={question.answered}
                                    className={cn(
                                        'w-full text-left p-4 rounded-xl border-2 transition-all',
                                        question.answered && question.selected_answer_id === answer.id
                                            ? 'border-kodibot-orange bg-orange-50'
                                            : selectedAnswerId === answer.id
                                                ? 'border-kodibot-orange bg-orange-50 scale-[1.02]'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    )}
                                >
                                    <span className="font-medium text-gray-900">{answer.content}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {question.hint && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm">
                            <AlertCircle className="w-4 h-4 inline-block mr-2" />
                            {question.hint}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                        className="w-full sm:w-auto rounded-xl"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {t('quiz.previous_question', { defaultValue: 'Previous' })}
                    </Button>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {isLastQuestion && allQuestionsAnswered ? (
                            <Button
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold rounded-xl"
                            >
                                {isLoading
                                    ? t('common.loading', { defaultValue: 'Loading...' })
                                    : t('quiz.submit', { defaultValue: 'Submit Quiz' })}
                            </Button>
                        ) : (
                            <Button
                                onClick={submitAnswer}
                                disabled={
                                    isLoading ||
                                    (question.question_type === 'fill_in'
                                        ? !textResponse.trim()
                                        : !selectedAnswerId && !question.answered)
                                }
                                className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-xl"
                            >
                                {isLoading
                                    ? t('common.loading', { defaultValue: 'Loading...' })
                                    : question.answered
                                        ? t('quiz.next_question', { defaultValue: 'Next' })
                                        : t('common.next', { defaultValue: 'Submit & Next' })}
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return null
}
