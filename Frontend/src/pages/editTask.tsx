import { useState,useEffect } from "react";
import api from "../api/client";
import { useParams,useNavigate } from "react-router-dom";
const EditTask = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title:'',
        description:'',
        status:'',
        priority:'',
        due_date:''
    })
    const fetchTask = async() => {
        try {
            const res = await api.get(`/tasks/${id}`)
            console.log(res.data)
            setFormData({
                title:res.data.title,
                description:res.data.description,
                status:res.data.status,
                priority:res.data.priority,
                due_date:res.data.due_date
            })
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=> {
        fetchTask()
    },[])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const resp = await api.put(`/tasks/${id}/`, formData)
            console.log(resp)
            setFormData({
                title:'',
                description:'',
                status:'',
                priority:'',
                due_date:''
            })
            navigate(`/projects/${resp.data.project_id}/tasks/`)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange}/>
            <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange}/>
            <select name="status" value={formData.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <input type="datetime-local" name="due_date" onChange={handleChange}/>
            <button type="submit">Edit</button>
        </form>
    )
}

export default EditTask;