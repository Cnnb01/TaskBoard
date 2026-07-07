import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const Dashboard = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])

    const fetchprojects = async() => {
        try {
            const res = await api.get(`/projects/`)
            // const data = await res.json()
            console.log("DATA RETRIEVED IS=>",res.data)
            setProjects(res.data)
        } catch (error) {
            console.error("ERROR IS=>", error)
        }
        
    }
        
    useEffect(()=>{
        fetchprojects()
    },[])

    return (
        <div className="dashboard">
            <button onClick={()=> navigate("/create-project")}>Create Project</button>
            <h2>{projects.map((project:any)=>(
                <div key={project.id} style={{border:'2px solid'}}>
                    <h3>{project.name}</h3>
                    <h4>{project.description}</h4>
                    <h5>{project.created_at}</h5>
                    <button onClick={()=> navigate(`/projects/${project.id}/tasks`)}>View Project</button><br/>
                    <button onClick={()=>navigate(`/projects/${project.id}/edit-project`)} >Edit Project</button>
                </div>
            ))}
            </h2>
            
        </div>
    )
}

export default Dashboard;