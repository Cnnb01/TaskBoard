import { useState,useEffect } from "react";
import api from "../api/client";
import { useNavigate,useParams } from "react-router-dom";
import type { Props } from "../types";
import { AxiosError } from "axios";


const TaskForm = ({mode}: Props) =>{
    const { id, taskId } = useParams()
    const navigate = useNavigate()
    const [isLoading, setisLoading] = useState(false)
    const [errors, setErrors] = useState<null|string>(null)
    const [formData, setFormData] = useState({
        title:'',
        description:'',
        status:'todo',
        priority:'low',
        due_date: ''
    })

    useEffect(()=> {
        setErrors(null)
        if (mode === 'edit'){
            setisLoading(true)
            api.get(`/tasks/${taskId}/`)
                .then(res=>setFormData({
                title:res.data.title,
                description:res.data.description,
                status:res.data.status,
                priority:res.data.priority,
                due_date:res.data.due_date}))
                .catch(err=>setErrors(`An error of ${err.message} occurred. Please try again.`))
                .finally(()=>setisLoading(false))
                }
    },[taskId])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        }) 
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            if(mode === 'create'){
                await api.post(`/tasks/`, { ...formData, project: id })
            }else{
                await api.put(`/tasks/${taskId}/`, formData)
            }
            navigate(`/projects/${id}/tasks`)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        }
    }
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
        </div>
    )

    const inputClass = "w-full bg-stone-50 dark:bg-[#1f2028] border border-stone-200 dark:border-[#2e303a] rounded-lg px-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-400 dark:focus:border-orange-600 transition-colors"
    const selectClass = `${inputClass} cursor-pointer`

    return (
        <div className="px-6 py-8 max-w-lg mx-auto">
            {errors && (
                <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">{errors}</p>
            )}
            <h2 className="text-stone-800 dark:text-stone-100 font-semibold text-lg mb-6">
                {mode === 'create' ? 'New Task' : 'Edit Task'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Task title"
                    value={formData.title}
                    onChange={handleChange}
                    className={inputClass}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                    <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <select name="priority" value={formData.priority} onChange={handleChange} className={selectClass}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <input
                    type="datetime-local"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className={inputClass}
                />
                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/projects/${id}/tasks`)}
                        className="flex-1 text-sm font-medium bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300 px-4 py-2.5 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 text-sm font-medium bg-orange-700 hover:bg-orange-800 text-white px-4 py-2.5 rounded-lg transition-colors"
                    >
                        {mode === 'create' ? 'Create' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
export default TaskForm;