import { useState,useEffect } from "react";
import api from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
const EditProject = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name:'',
        description:'',
    })
    const fetchProject = async()=>{
        try {
            const theProject = await api.get(`/projects/${id}/`)
            console.log("The project is =>", theProject.data)
            setFormData({
                name:theProject.data.name,
                description:theProject.data.description
            })
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        fetchProject()
    },[])
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            const res = await api.put(`/projects/${id}/`,formData)
            console.log("New data to be displayed should be:",res)
            setFormData({
                name:'',
                description:''
            })
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    return (
        <div>
            <h1>Edit Project</h1>
            <form onSubmit={handleSubmit}>
                <input name="name" value={formData.name} onChange={handleChange}/>
                <textarea name="description" value={formData.description} onChange={handleChange}/>
                <button type="submit">Edit</button>
            </form>
        </div>
    )
}

export default EditProject;