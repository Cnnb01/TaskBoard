import { useState, useEffect } from "react";
import api from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import type { Props } from "../types";
import { AxiosError } from "axios";

const ProjectForm = ({ mode }: Props) => {
    const { id } = useParams()
    const [isLoading, setisLoading] = useState(false)
    const [errors, setErrors] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name:'',
        description:''
    })
    const navigate = useNavigate()

    useEffect(() => {
        setErrors(null)
        if (mode === 'edit') {
            setisLoading(true)
            api.get(`/projects/${id}/`)
                .then(res => setFormData({ name: res.data.name, description: res.data.description }))
                // .catch(err => console.error(err))
                .catch(err => setErrors(`An error of ${err.message} occurred. Please try again.`))
                .finally(()=>setisLoading(false))
        }
    }, [id])
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setisLoading(true)
        setErrors(null)
        try {
            if (mode === 'create') {
                await api.post(`/projects/`, formData)
            } else {
                await api.put(`/projects/${id}/`, formData)
            }
            setFormData({ name:'', description:'' })
            navigate("/")
        } catch (error) {
            const err = error as AxiosError
            // console.error("ERROR=>",error)
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setisLoading(false)
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
        </div>
    )

    const inputClass = "w-full bg-stone-50 dark:bg-[#1f2028] border border-stone-200 dark:border-[#2e303a] rounded-lg px-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-orange-400 dark:focus:border-orange-600 transition-colors"

    return (
        <div className="px-6 py-8 max-w-lg mx-auto">
            {errors && (
                <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">{errors}</p>
            )}
            <h2 className="text-stone-800 dark:text-stone-100 font-semibold text-lg mb-6">
                {mode === 'create' ? 'New Project' : 'Edit Project'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="name"
                    placeholder="Project name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={inputClass}
                />
                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
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

export default ProjectForm;