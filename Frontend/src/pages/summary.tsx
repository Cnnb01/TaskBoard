import { useState, useEffect } from "react";
import api from "../api/client";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

const Summary = () => {
    const {id} = useParams<{id: string}>()
    const [projects, setProjects] = useState({
        project:"",
        total_tasks:0,
        task_status:[
            {
                status:"",
                countt:0
            }
        ]
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<string | null>(null)
    
    const fetchSummary = async()=>{
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(`/projects/${id}/summary/`)
            console.log("PROJECT SUMMARY HEREEE=>",res.data)
            setProjects(res.data)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(()=>{
        fetchSummary()
    }, [id])
    // fetchSummary()
    if(isLoading) return <h1>Loading...</h1>
    return (
        <div>
            <h2>Project Summary</h2>
            <h3>Project:{projects.project} </h3>
            <h4>Total tasks:{projects.total_tasks}</h4>
            <h4>Task statuses{projects.task_status.map((s)=>(
                <p key={s.status}>{s.status}:{s.countt}</p>
            ))}</h4>
        </div>
    )
}
export default Summary;