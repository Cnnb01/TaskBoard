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
        setisLoading(true)
        setErrors(null)
        if (mode === 'edit') {
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
    
    return(
    <div>
        <h1>{mode === 'create' ? 'Create Project' : 'Edit Project'}</h1>
        <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange}/>
            <textarea name="description" value={formData.description} onChange={handleChange}/>
            <button type="submit">{mode === 'create' ? 'Submit' : 'Edit'}</button>
        </form>
    </div>
    )
}

export default ProjectForm;