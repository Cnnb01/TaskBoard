import { useState, useEffect } from "react";
import api from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const Summary = () => {
    const {id} = useParams<{id: string}>()
    const navigate = useNavigate()
    const [projects, setProjects] = useState({
        project:"",
        total_tasks:0,
        task_status:[
            {
                status:"",
                countt:0
            }
        ]
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<string | null>(null)
    
    const fetchSummary = async()=>{
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(`/projects/${id}/summary/`)
            // console.log("PROJECT SUMMARY HEREEE=>",res.data)
            setProjects(res.data)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(()=>{
        fetchSummary()
    }, [id])

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">Loading summary...</p>
        </div>
    )

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

            <div className="bg-stone-50 dark:bg-[#1f2028] border border-stone-200 dark:border-[#2e303a] rounded-xl p-6 flex flex-col gap-6">
                <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Project</p>
                    <h2 className="text-stone-800 dark:text-stone-100 font-semibold text-lg">{projects.project}</h2>
                </div>

                <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Total Tasks</p>
                    <p className="text-stone-800 dark:text-stone-100 text-3xl font-bold">{projects.total_tasks}</p>
                </div>

                <div>
                    <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">By Status</p>
                    <div className="flex flex-col gap-2">
                        {projects.task_status.map((s) => (
                            <div key={s.status} className="flex items-center justify-between border-b border-stone-100 dark:border-[#2e303a] pb-2">
                                <span className="text-sm text-stone-600 dark:text-stone-300 capitalize">{s.status.replace('_', ' ')}</span>
                                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{s.countt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Summary;