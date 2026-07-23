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
        status:'',
        priority:'',
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
            setFormData({
                title:'',
                description:'',
                status:'',
                priority:'',
                due_date:''
            })
            navigate(`/projects/${id}/tasks`)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } 
        setFormData({
            title:'',
            description:'',
            status:'',
            priority:'',
            due_date: ''
        })
    }
    
    if (isLoading) return <h1>Loading...</h1>

    return(
        <div>
            <h1>{mode === 'create' ? 'Create Task' : 'Edit Task'}</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange}/>  
              <textarea name="description"  placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
              <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="todo">Todo</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
              </select>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
              </select>
              <input type="datetime-local" name="due_date" value={formData.due_date} onChange={handleChange}/>
              <button type="submit">{mode === 'create'?'Submit':'Edit'}</button>
            </form>
        </div>
    )
}
export default TaskForm;