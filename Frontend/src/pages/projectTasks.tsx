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
    const [status, setStatus] = useState<string>('all')
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)

    const fetchTasks = async(url?: string) => {
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(url ?? (status === "all" ? `/tasks/?project=${id}` : `/tasks/?project=${id}&status=${status}`))
            setTasks(res.data.results)
            setNextUrl(res.data.next)
            setPrevUrl(res.data.previous)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchTasks()
    }, [id,status])

    const deleteTask = (id: number) => async () => {
        try {
            await api.delete(`/tasks/${id}/`)
            setTasks(tasks.filter((t:Task)=>t.id !== id))
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        }
    }

    if (isLoading) return <h1>Loading...</h1>

    return (
        <div>
            <button onClick={()=>navigate(`/projects/${id}/create-task`)}>Create New Task</button>
            <h6>Based on status</h6>
            <button onClick={()=>setStatus("all")} >All</button>
            <button onClick={()=>setStatus("todo")}>Todo</button>
            <button onClick={()=>setStatus("in_progress")}>In Progress</button>
            <button onClick={()=>setStatus("done")}>Done</button>
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
            <button onClick={() => prevUrl && fetchTasks(prevUrl)} disabled={!prevUrl}>Previous</button>
            <button onClick={() => nextUrl && fetchTasks(nextUrl)} disabled={!nextUrl}>Next</button>
        </div>
    )
}

export default ProjectTasks;
