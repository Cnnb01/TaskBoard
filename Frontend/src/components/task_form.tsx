import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";

const TaskForm = () =>{
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title:'',
        description:'',
        status:'',
        priority:'',
        due_date: ''
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        }) 
    }
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
            const res = await api.post(`/tasks/`, { ...formData, project_id: id })
            console.log("DATA SENT IS =>", res)
            navigate(`/projects/${id}/tasks`)
        } catch (error) {
            const err = error as AxiosError
            console.error("ERROR IS =>", err.response?.data)

        }
        setFormData({
            title:'',
            description:'',
            status:'',
            priority:'',
            due_date: ''
        })
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title" onChange={handleChange}/>  
              <textarea name="description"  placeholder="Description" onChange={handleChange}></textarea>
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
              <input type="datetime-local" name="due_date" onChange={handleChange}/>

              <button type="submit">Create Task</button>
            </form>
        </div>
    )
}
export default TaskForm;