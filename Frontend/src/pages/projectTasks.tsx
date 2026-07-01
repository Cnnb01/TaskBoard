import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const ProjectTasks = () => {
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

    return (
        <div>
            <h1>Tasks</h1>
            {tasks.map((task: any) => (
                <div key={task.id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>{task.status}</p>
                    <p>{task.priority}</p>
                </div>
            ))}
        </div>
    )
}

export default ProjectTasks;
