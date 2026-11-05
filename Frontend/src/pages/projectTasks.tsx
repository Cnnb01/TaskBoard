import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types";
import { AxiosError } from "axios";

const statusLabel: Record<string, string> = {
    todo: "Todo",
    in_progress: "In Progress",
    done: "Done",
}

const priorityColors: Record<string, string> = {
    low: "text-stone-400 dark:text-stone-500",
    medium: "text-amber-600 dark:text-amber-400",
    high: "text-rose-600 dark:text-rose-400",
}

const ProjectTasks = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState<string | null>(null)
    const [status, setStatus] = useState<string>('all')
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)

    const fetchTasks = async(url?: string) => {
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(url ?? (status === "all" ? `/tasks/?project=${id}` : `/tasks/?project=${id}&status=${status}`))
            setTasks(res.data.results)
            setNextUrl(res.data.next)
            setPrevUrl(res.data.previous)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchTasks()
    }, [id,status])

    const deleteTask = (id: number) => async () => {
        try {
            await api.delete(`/tasks/${id}/`)
            setTasks(tasks.filter((t:Task)=>t.id !== id))
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">Loading tasks...</p>
        </div>
    )

    const filterBtns = [
        { label: 'All', value: 'all' },
        { label: 'Todo', value: 'todo' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Done', value: 'done' },
    ]

    return (
        <div className="px-6 py-8 max-w-5xl mx-auto">
            {errors && (
                <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">{errors}</p>
            )}

            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
            >
                ← Back
            </button>

            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {filterBtns.map(btn => (
                        <button
                            key={btn.value}
                            onClick={() => setStatus(btn.value)}
                            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                                status === btn.value
                                    ? 'bg-orange-700 text-white'
                                    : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => navigate(`/projects/${id}/create-task`)}
                    className="bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                    + New Task
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                    <p className="text-4xl mb-3">📝</p>
                    <p className="text-sm">No tasks found.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {tasks.map((task: Task) => (
                        <div
                            key={task.id}
                            className="bg-stone-50 dark:bg-[#1f2028] border border-stone-200 dark:border-[#2e303a] rounded-xl px-5 py-4 flex items-start justify-between gap-4"
                        >
                            <div className="flex flex-col gap-1">
                                <h3 className="text-stone-800 dark:text-stone-100 font-semibold text-sm">{task.title}</h3>
                                {task.description && <p className="text-stone-500 dark:text-stone-400 text-xs">{task.description}</p>}
                                <div className="flex gap-3 mt-1">
                                    <span className="text-xs text-stone-400 dark:text-stone-500">{statusLabel[task.status] ?? task.status}</span>
                                    <span className={`text-xs font-medium ${priorityColors[task.priority] ?? ''}`}>{task.priority}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => navigate(`/projects/${id}/tasks/${task.id}/edit-task`)}
                                    className="text-xs font-medium bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={deleteTask(task.id)}
                                    className="text-xs font-medium bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center gap-3 mt-10">
                <button
                    onClick={() => prevUrl && fetchTasks(prevUrl)}
                    disabled={!prevUrl}
                    className="text-sm px-4 py-2 rounded-lg border border-stone-200 dark:border-[#2e303a] text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#1f2028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>
                <button
                    onClick={() => nextUrl && fetchTasks(nextUrl)}
                    disabled={!nextUrl}
                    className="text-sm px-4 py-2 rounded-lg border border-stone-200 dark:border-[#2e303a] text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-[#1f2028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    )
}

export default ProjectTasks;
