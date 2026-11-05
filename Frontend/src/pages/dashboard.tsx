import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import type { Project } from "../types";
import { AxiosError } from "axios";

const Dashboard = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<string | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)

    const fetchprojects = async(url = `/projects/`) => {
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(url)
            setProjects(res.data.results)
            setNextUrl(res.data.next)
            setPrevUrl(res.data.previous)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }
        
    useEffect(()=>{
        fetchprojects()
    },[])
    const deleteProject = async(id:number) => {
        try {
            await api.delete(`/projects/${id}/`)
            setProjects(projects.filter((p:Project)=>p.id !== id))
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        }
    }
    
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">Loading projects...</p>
        </div>
    )

    return (
        <div className="px-6 py-8 max-w-5xl mx-auto">
            {errors && (
                <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">{errors}</p>
            )}

            <div className="flex items-center justify-between mb-8">
                <p className="text-stone-400 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                <button
                    onClick={() => navigate("/create-project")}
                    className="bg-orange-700 hover:bg-orange-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                    + New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 text-stone-400">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-sm">No projects yet. Create one to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project: Project) => (
                        <div
                            key={project.id}
                            className="bg-stone-50 dark:bg-[#1f2028] border border-stone-200 dark:border-[#2e303a] rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h3 className="text-stone-800 dark:text-stone-100 font-semibold text-base leading-snug">{project.name}</h3>
                                <p className="text-stone-400 dark:text-stone-500 text-xs mt-1">
                                    {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            {project.description && (
                                <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-2">{project.description}</p>
                            )}
                            <div className="mt-auto pt-2 flex flex-wrap gap-2">
                                <button
                                    onClick={() => navigate(`/projects/${project.id}/tasks`)}
                                    className="flex-1 text-xs font-medium bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/projects/${project.id}/summary`)}
                                    className="flex-1 text-xs font-medium bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Summary
                                </button>
                                <button
                                    onClick={() => navigate(`/projects/${project.id}/edit-project`)}
                                    className="flex-1 text-xs font-medium bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-md transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteProject(project.id)}
                                    className="flex-1 text-xs font-medium bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-md transition-colors"
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
                    onClick={() => prevUrl && fetchprojects(prevUrl)}
                    disabled={!prevUrl}
                    className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>
                <button
                    onClick={() => nextUrl && fetchprojects(nextUrl)}
                    disabled={!nextUrl}
                    className="text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    )
}

export default Dashboard;