import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import type { Project } from "../types";

const Dashboard = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState<Project[]>([])

    const fetchprojects = async() => {
        try {
            const res = await api.get(`/projects/`)
            console.log("DATA RETRIEVED IS=>",res.data)
            setProjects(res.data)
        } catch (error) {
            console.error("ERROR IS=>", error)
        }
        
    }
        
    useEffect(()=>{
        fetchprojects()
    },[])
    const deleteProject = async(id:number) => {
        try {
            const res = await api.delete(`/projects/${id}/`)
            setProjects(projects.filter((p:any)=>p.id !== id))
        } catch (error) {
            console.error(error)
        }
    }
    

    return (
        <div className="dashboard">
            <button onClick={()=> navigate("/create-project")}>Create Project</button>
            <div>{projects.map((project:any)=>(
                <div key={project.id} style={{border:'2px solid'}}>
                    <h3>{project.name}</h3>
                    <h4>{project.description}</h4>
                    <h5>{project.created_at}</h5>
                    <button onClick={()=> navigate(`/projects/${project.id}/tasks`)}>View Project</button><br/>
                    <button onClick={()=>navigate(`/projects/${project.id}/edit-project`)} >Edit Project</button>
                    <button onClick={()=>deleteProject(project.id)}>Delete Project</button>
                </div>
            ))}
            </div>
            
        </div>
    )
}

export default Dashboard;