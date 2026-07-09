import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
const ProjectTasks = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [tasks, setTasks] = useState([])

    const fetchTasks = async(id: string | undefined) => {
        try {
            const res = await api.get(`/tasks/?project_id=${id}`)
            console.log("THE TASKS ARE =>", res.data)
            setTasks(res.data)
        } catch (error) {
            console.error("ERROR IS=>", error)
        } 
    }
    useEffect(() => {
        fetchTasks(id)
    }, [id])

    const deleteTask = (id: number) => async () => {
        try {
            await api.delete(`/tasks/${id}/`)
            setTasks(tasks.filter((t:any)=>t.id !== id))
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <button onClick={()=>navigate(`/projects/${id}/create-task`)}>Create New Task</button>
            <h1>Tasks</h1>
            {tasks.map((task: any) => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>{task.status}</p>
                    <p>{task.priority}</p>
                    <button onClick={()=>navigate(`/projects/${id}/tasks/${task.id}/edit-task`)}>Edit Task</button>
                    <button onClick={deleteTask(task.id)}>Delete Task</button>
                </div>
            ))}
        </div>
    )
}

export default ProjectTasks;
