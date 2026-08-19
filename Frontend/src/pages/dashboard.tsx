import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import type { Project } from "../types";
import { AxiosError } from "axios";

const Dashboard = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<string | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)

    const fetchprojects = async(url = `/projects/`) => {
        setIsLoading(true)
        setErrors(null)
        try {
            const res = await api.get(url)
            setProjects(res.data.results)
            setNextUrl(res.data.next)
            setPrevUrl(res.data.previous)
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }
        
    useEffect(()=>{
        fetchprojects()
    },[])
    const deleteProject = async(id:number) => {
        try {
            await api.delete(`/projects/${id}/`)
            setProjects(projects.filter((p:Project)=>p.id !== id))
        } catch (error) {
            const err = error as AxiosError
            setErrors(`An error of ${err.message} occurred. Please try again.`)
        }
    }
    
    if (isLoading) return <h1>Loading...</h1>
    return (
        <div className="dashboard">
            <button onClick={()=> navigate("/create-project")}>Create Project</button>
            <div>{projects.map((project:Project)=>(
                <div key={project.id} style={{border:'2px solid'}}>
                    <h3>{project.name}</h3>
                    <h4>{project.description}</h4>
                    <h5>{project.created_at}</h5>
                    <button onClick={()=> navigate(`/projects/${project.id}/tasks`)}>View Project</button><br/>
                    <button onClick={()=>navigate(`/projects/${project.id}/edit-project`)} >Edit Project</button><br/>
                    <button onClick={()=>deleteProject(project.id)}>Delete Project</button><br/>
                    <button onClick={()=>navigate(`/projects/${project.id}/summary`)}>Summary</button>
                </div>
            ))}
            </div>
            <button onClick={() => prevUrl && fetchprojects(prevUrl)} disabled={!prevUrl}>Previous</button>
            <button onClick={() => nextUrl && fetchprojects(nextUrl)} disabled={!nextUrl}>Next</button>
        </div>
    )
}

export default Dashboard;