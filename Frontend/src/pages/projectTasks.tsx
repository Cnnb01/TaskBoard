import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types";
import { AxiosError } from "axios";

const ProjectTasks = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState<string | null>(null)

    const fetchTasks = async(id: string | undefined) => {
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(`/tasks/?project=${id}`)
            console.log("THE TASKS ARE =>", res.data)
            setTasks(res.data)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
            // console.error("ERROR IS=>", error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchTasks(id)
    }, [id])

    const deleteTask = (id: number) => async () => {
        try {
            await api.delete(`/tasks/${id}/`)
            setTasks(tasks.filter((t:Task)=>t.id !== id))
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
            // console.error(error)
        }
    }
    return (
        <div>
            <button onClick={()=>navigate(`/projects/${id}/create-task`)}>Create New Task</button>
            <h1>Tasks</h1>
            {tasks.map((task: Task) => (
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
